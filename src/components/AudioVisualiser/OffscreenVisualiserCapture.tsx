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

/**
 * OffscreenVisualiserCapture
 *
 * Captures the visualiser output to an offscreen canvas at a specified resolution,
 * then encodes the pixels and sends them to the backend as visualisation_update events.
 *
 * This allows the frontend visualiser to drive LED devices via the backend.
 */
const OffscreenVisualiserCapture = () => {
  const width = useStore((state) => state.uiPersist.offscreenCapture?.width ?? 128)
  const height = useStore((state) => state.uiPersist.offscreenCapture?.height ?? 128)
  const targetDevice = useStore(
    (state) => state.uiPersist.offscreenCapture?.targetDevice ?? 'unused' // for future use
  )
  const fps = useStore((state) => state.uiPersist.offscreenCapture?.fps ?? 30)
  const showPreview = useStore((state) => state.uiPersist.offscreenCapture?.showPreview ?? false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const previewCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const findCanvasIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const captureIntervalRef = useRef<number | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const [sourceCanvasReady, setSourceCanvasReady] = useState(false)

  // Backpressure: track if we're waiting for worker to finish
  const processingRef = useRef(false)

  const { sendBinary, isConnected } = useWebSocket()
  const clientId = useStore((state) => state.clientIdentity.clientId)

  // Refs for volatile values — keeps the heavy setup effect stable
  const isConnectedRef = useRef(isConnected)
  const targetDeviceRef = useRef(targetDevice)
  const clientIdRef = useRef(clientId)
  const sendBinaryRef = useRef(sendBinary)
  useEffect(() => {
    isConnectedRef.current = isConnected
  }, [isConnected])
  useEffect(() => {
    targetDeviceRef.current = targetDevice
  }, [targetDevice])
  useEffect(() => {
    clientIdRef.current = clientId
  }, [clientId])
  useEffect(() => {
    sendBinaryRef.current = sendBinary
  }, [sendBinary])

  // Create offscreen canvas for capturing at target resolution
  useEffect(() => {
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
          if (isConnectedRef.current && targetDeviceRef.current && clientIdRef.current) {
            sendBinaryRef.current(
              buildBinaryFrame(
                targetDeviceRef.current,
                clientIdRef.current,
                e.data.width,
                e.data.height,
                e.data.rgbBuffer
              )
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
        previewCtxRef.current = canvas.getContext('2d')
        document.body.appendChild(canvas)
      }

      // Initialize worker with dimensions (it will create its own OffscreenCanvas)
      worker.postMessage({ type: 'init', width, height })

      // Try to find the visualiser canvas
      const findVisualiserCanvas = () => {
        const bgContainer = document.querySelector('[data-background-visualizer="true"]')
        if (!bgContainer) return false

        const canvases = bgContainer.querySelectorAll('canvas')

        for (const c of canvases) {
          // Skip our own canvases
          if (c === canvasRef.current) continue
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
  }, [width, height, showPreview, fps])

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
      processingRef.current = true

      // GPU-accelerated resize in a single step — no intermediate canvas
      const bitmap = await createImageBitmap(source, {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality: 'low'
      })

      if (showPreview && previewCtxRef.current) {
        previewCtxRef.current.drawImage(bitmap, 0, 0)
      }

      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'capture', bitmap }, [bitmap])
      } else {
        bitmap.close()
      }
    } catch (error) {
      console.error('[OffscreenVisualiserCapture] Error capturing frame:', error)
      processingRef.current = false
    }
  }, [width, height, showPreview])

  // Hook into the visualiser's render loop
  useEffect(() => {
    // Only start interval if we have a source canvas
    if (!sourceCanvasReady) {
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
      if (!sourceCanvasReady) return

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
  }, [sourceCanvasReady, captureAndSend, fps])

  // This component doesn't render anything visible (except debug canvas)
  return null
}

export default OffscreenVisualiserCapture
