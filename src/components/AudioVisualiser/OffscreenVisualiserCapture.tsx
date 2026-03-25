import { useEffect, useRef, useCallback, useState } from 'react'
import { useWebSocket } from '../../utils/Websocket/WebSocketProvider'
import useStore from '../../store/useStore'

/**
 * Binary frame format for frontend_visualiser_data:
 * [1] uint8  message_type = 0x01
 * [2] uint16 width (LE)
 * [2] uint16 height (LE)
 * [1] uint8  vis_id byte length
 * [N] bytes  vis_id (UTF-8)
 * [1] uint8  client_id byte length
 * [M] bytes  client_id (UTF-8)
 * [.] bytes  RGB pixels (width * height * 3)
 */
const enc = new TextEncoder()
function buildBinaryFrame(
  visId: string,
  clientId: string,
  w: number,
  h: number,
  rgbBuffer: ArrayBuffer
): ArrayBuffer {
  const visIdBytes = enc.encode(visId)
  const clientIdBytes = enc.encode(clientId)
  const frame = new ArrayBuffer(
    1 + 2 + 2 + 1 + visIdBytes.length + 1 + clientIdBytes.length + rgbBuffer.byteLength
  )
  const view = new DataView(frame)
  const bytes = new Uint8Array(frame)
  let o = 0
  view.setUint8(o++, 0x01)
  view.setUint16(o, w, true)
  o += 2
  view.setUint16(o, h, true)
  o += 2
  view.setUint8(o++, visIdBytes.length)
  bytes.set(visIdBytes, o)
  o += visIdBytes.length
  view.setUint8(o++, clientIdBytes.length)
  bytes.set(clientIdBytes, o)
  o += clientIdBytes.length
  bytes.set(new Uint8Array(rgbBuffer), o)
  return frame
}

interface OffscreenVisualiserCaptureProps {
  enabled?: boolean
  width?: number
  height?: number
  targetDevice?: string
  fps?: number
  showPreview?: boolean
}

/**
 * OffscreenVisualiserCapture
 *
 * Captures the visualiser output to an offscreen canvas at a specified resolution,
 * then encodes the pixels and sends them to the backend as visualisation_update events.
 *
 * This allows the frontend visualiser to drive LED devices via the backend.
 */
const OffscreenVisualiserCapture = ({
  enabled = false,
  width = 128,
  height = 128,
  targetDevice = 'visualiser-capture',
  fps = 30,
  showPreview = false
}: OffscreenVisualiserCaptureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const findCanvasIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const captureIntervalRef = useRef<number | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const [sourceCanvasReady, setSourceCanvasReady] = useState(false)

  // Backpressure: track if we're waiting for worker to finish
  const processingRef = useRef(false)

  // Latest-only frame queue: only keep most recent binary frame
  const pendingMessageRef = useRef<ArrayBuffer | null>(null)
  const sendLoopRef = useRef<number | null>(null)

  const { sendBinary, isConnected } = useWebSocket()
  const clientId = useStore((state) => state.clientIdentity.clientId)

  // Create offscreen canvas for capturing at target resolution
  useEffect(() => {
    if (!enabled) return

    try {
      // Initialize Web Worker for off-thread pixel processing
      const worker = new Worker(
        new URL('../../workers/visualiserCapture.worker.ts', import.meta.url)
      )
      workerRef.current = worker

      worker.onmessage = (e) => {
        if (e.data.type === 'ready') {
          // Worker initialized
        } else if (e.data.type === 'captured') {
          if (isConnected && targetDevice && clientId) {
            pendingMessageRef.current = buildBinaryFrame(
              targetDevice,
              clientId,
              e.data.width,
              e.data.height,
              e.data.rgbBuffer
            )
          }

          // Worker finished, ready for next frame
          processingRef.current = false
        }
      }

      // Create visible canvas for debugging (toggleable via settings)
      if (showPreview) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.style.position = 'fixed'
        canvas.style.bottom = '10px'
        canvas.style.right = '10px'
        canvas.style.border = '2px solid #00ff00'
        canvas.style.zIndex = '10000'
        canvas.style.pointerEvents = 'none'
        canvas.style.opacity = '1'
        canvas.style.backgroundColor = '#000'
        canvasRef.current = canvas
        document.body.appendChild(canvas)
      }

      // Create offscreen canvas for main thread preview/capture
      const offscreen = document.createElement('canvas')
      offscreen.width = width
      offscreen.height = height

      // Get context with optimization for frequent reads
      const ctx = offscreen.getContext('2d', { willReadFrequently: false })
      if (!ctx) {
        console.error('[OffscreenVisualiserCapture] Failed to get 2D context')
        return
      }

      offscreenCanvasRef.current = offscreen
      offscreenCtxRef.current = ctx

      // Initialize worker with dimensions (it will create its own OffscreenCanvas)
      worker.postMessage({ type: 'init', width, height })

      // Try to find the visualiser canvas
      const findVisualiserCanvas = () => {
        const bgContainer = document.querySelector('[data-background-visualizer="true"]')
        if (!bgContainer) return false

        const canvases = bgContainer.querySelectorAll('canvas')

        for (const c of canvases) {
          // Skip our own canvases
          if (c === canvasRef.current || c === offscreen) continue
          // Look for a canvas that's reasonably large (likely the visualiser)
          // Also ensure it's not the tiny default canvas (300x150)
          if (c.width > 400 && c.height > 300) {
            sourceCanvasRef.current = c
            setSourceCanvasReady(true)
            return true
          }
        }
        return false
      }

      // Try to find it immediately, then keep monitoring
      findVisualiserCanvas()
      findCanvasIntervalRef.current = setInterval(() => {
        if (sourceCanvasRef.current && !document.body.contains(sourceCanvasRef.current)) {
          sourceCanvasRef.current = null
          setSourceCanvasReady(false)
          findVisualiserCanvas()
        } else if (!sourceCanvasRef.current) {
          findVisualiserCanvas()
        }
      }, 500)
    } catch (error) {
      console.error('[OffscreenVisualiserCapture] Failed to create canvases:', error)
    }

    return () => {
      if (findCanvasIntervalRef.current) {
        clearInterval(findCanvasIntervalRef.current)
        findCanvasIntervalRef.current = null
      }
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current)
      }
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
      sourceCanvasRef.current = null
      setSourceCanvasReady(false)
      processingRef.current = false
    }
  }, [enabled, width, height, showPreview, sendBinary, isConnected, targetDevice, fps, clientId])

  // Send loop: Only send latest message when WebSocket is ready
  useEffect(() => {
    if (!enabled || !isConnected) {
      pendingMessageRef.current = null
      return
    }

    const sendLoop = () => {
      const message = pendingMessageRef.current

      if (message) {
        sendBinary(message)
        pendingMessageRef.current = null
      }

      sendLoopRef.current = requestAnimationFrame(sendLoop) as any
    }

    sendLoop()

    return () => {
      if (sendLoopRef.current) {
        cancelAnimationFrame(sendLoopRef.current as number)
        sendLoopRef.current = null
      }
      pendingMessageRef.current = null
    }
  }, [enabled, isConnected, sendBinary])

  // Capture frame - offload expensive work to worker
  const captureAndSend = useCallback(async () => {
    if (!sourceCanvasRef.current) return

    // Backpressure: skip frame if worker is still processing previous frame
    if (processingRef.current) return

    const source = sourceCanvasRef.current

    // Check if the source canvas is still in the DOM
    if (!document.body.contains(source)) {
      sourceCanvasRef.current = null
      setSourceCanvasReady(false)
      return
    }

    try {
      if (!offscreenCtxRef.current || !offscreenCanvasRef.current) return

      processingRef.current = true

      offscreenCtxRef.current.drawImage(source, 0, 0, width, height)

      if (showPreview && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.drawImage(offscreenCanvasRef.current, 0, 0)
        }
      }

      if (workerRef.current) {
        const bitmap = await createImageBitmap(offscreenCanvasRef.current)
        workerRef.current.postMessage({ type: 'capture', bitmap }, [bitmap])
      }
    } catch (error) {
      console.error('[OffscreenVisualiserCapture] Error capturing frame:', error)
      processingRef.current = false
    }
  }, [width, height, showPreview])

  // Hook into the visualiser's render loop
  useEffect(() => {
    // Only start interval if enabled AND we have a source canvas
    if (!enabled || !sourceCanvasReady) {
      // Clean up any existing interval
      if (captureIntervalRef.current) {
        cancelAnimationFrame(captureIntervalRef.current as number)
        captureIntervalRef.current = null
      }
      return
    }

    // Use requestAnimationFrame to sync with visualizer rendering
    let lastCaptureTime = performance.now()
    const targetFrameInterval = 1000 / fps

    const captureFrame = () => {
      if (!enabled || !sourceCanvasReady) return

      const now = performance.now()
      const elapsed = now - lastCaptureTime

      // Throttle to target FPS
      if (elapsed >= targetFrameInterval) {
        captureAndSend()
        lastCaptureTime = now - (elapsed % targetFrameInterval)
      }

      captureIntervalRef.current = requestAnimationFrame(captureFrame) as any
    }

    captureFrame()

    return () => {
      if (captureIntervalRef.current) {
        cancelAnimationFrame(captureIntervalRef.current as number)
        captureIntervalRef.current = null
      }
    }
  }, [enabled, sourceCanvasReady, captureAndSend, fps])

  // This component doesn't render anything visible (except debug canvas)
  return null
}

export default OffscreenVisualiserCapture
