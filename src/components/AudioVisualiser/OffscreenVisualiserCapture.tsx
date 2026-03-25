import { useEffect, useRef, useCallback, useState } from 'react'
import { useWebSocket } from '../../utils/Websocket/WebSocketProvider'
import useStore from '../../store/useStore'

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

  // Latest-only message queue: only keep most recent frame
  const pendingMessageRef = useRef<any>(null)
  const sendLoopRef = useRef<number | null>(null)
  const messageIdRef = useRef(0)

  const { send, isConnected } = useWebSocket()
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
          // Store latest message (overwrites previous if not sent yet)
          if (isConnected && targetDevice) {
            pendingMessageRef.current = {
              id: messageIdRef.current++,
              type: 'frontend_visualiser_data',
              client_id: clientId,
              vis_id: targetDevice,
              pixels: e.data.pixelData.data,
              shape: [e.data.pixelData.height, e.data.pixelData.width],
              encoding: 'base64-rgb'
            }
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
  }, [enabled, width, height, showPreview, send, isConnected, targetDevice, fps, clientId])

  // Send loop: Only send latest message when WebSocket is ready
  useEffect(() => {
    if (!enabled || !isConnected) {
      pendingMessageRef.current = null
      return
    }

    const sendLoop = () => {
      const message = pendingMessageRef.current

      if (message) {
        send(message)
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
  }, [enabled, isConnected, send])

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
