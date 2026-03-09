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
  const droppedFramesRef = useRef(0)

  // Latest-only message queue: only keep most recent frame
  const pendingMessageRef = useRef<any>(null)
  const sendLoopRef = useRef<number | null>(null)
  const messageIdRef = useRef(0)

  // Stats aggregation for once-per-second logging
  const statsRef = useRef({
    mainThread: { count: 0, drawTime: 0, previewTime: 0, bitmapTime: 0, postTime: 0, total: 0 },
    worker: { count: 0, drawTime: 0, extractTime: 0, rgbTime: 0, base64Time: 0, total: 0 },
    websocket: { count: 0, sendTime: 0, overwritten: 0 },
    lastLogTime: 0,
    droppedFrames: 0
  })

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
            const hadPending = pendingMessageRef.current !== null

            // Match backend expected format: frontend_visualiser_data
            pendingMessageRef.current = {
              id: messageIdRef.current++,
              type: 'frontend_visualiser_data',
              client_id: clientId,
              vis_id: targetDevice,
              pixels: e.data.pixelData.data, // base64-encoded RGB data
              shape: [e.data.pixelData.height, e.data.pixelData.width], // [rows, cols]
              encoding: 'base64-rgb' // Backend needs to decode: base64 -> RGB byte array
            }

            // Track overwrites (old frame dropped)
            if (hadPending) {
              statsRef.current.websocket.overwritten++
            }
          }

          // Aggregate stats
          const timing = e.data.timing
          const stats = statsRef.current
          stats.worker.count++
          stats.worker.drawTime += timing.drawTime
          stats.worker.extractTime += timing.extractTime
          stats.worker.rgbTime += timing.rgbConvertTime
          stats.worker.base64Time += timing.base64EncodeTime
          stats.worker.total += timing.totalTime

          // Worker finished, ready for next frame
          processingRef.current = false

          // Log aggregated stats once per second (single line)
          const now = performance.now()
          if (stats.lastLogTime === 0) {
            stats.lastLogTime = now
          } else if (now - stats.lastLogTime >= 1000) {
            const elapsed = (now - stats.lastLogTime) / 1000

            if (stats.mainThread.count > 0 || stats.worker.count > 0) {
              const mainAvg =
                stats.mainThread.count > 0
                  ? (stats.mainThread.total / stats.mainThread.count).toFixed(1)
                  : '0.0'
              const workerAvg =
                stats.worker.count > 0
                  ? (stats.worker.total / stats.worker.count).toFixed(1)
                  : '0.0'
              const actualFps = (stats.mainThread.count / elapsed).toFixed(1)

              const parts = [
                `FPS: ${actualFps}/${fps}`,
                `Main: ${mainAvg}ms`,
                `Worker: ${workerAvg}ms`,
                `WS: ${stats.websocket.count} sent`
              ]

              if (stats.websocket.overwritten > 0) {
                parts.push(`${stats.websocket.overwritten} overwritten`)
              }
              if (stats.droppedFrames > 0) {
                parts.push(`${stats.droppedFrames} dropped`)
              }

              console.log(`[OffscreenVizCapture] ${parts.join(' | ')}`)
            }

            // Reset stats
            stats.mainThread = {
              count: 0,
              drawTime: 0,
              previewTime: 0,
              bitmapTime: 0,
              postTime: 0,
              total: 0
            }
            stats.worker = {
              count: 0,
              drawTime: 0,
              extractTime: 0,
              rgbTime: 0,
              base64Time: 0,
              total: 0
            }
            stats.websocket = { count: 0, sendTime: 0, overwritten: 0 }
            stats.droppedFrames = 0
            stats.lastLogTime = now
            droppedFramesRef.current = 0
          }
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
      droppedFramesRef.current = 0
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

      // Send if we have a message pending
      if (message) {
        const t0 = performance.now()
        send(message)
        const t1 = performance.now()

        pendingMessageRef.current = null

        // Track send timing
        statsRef.current.websocket.count++
        statsRef.current.websocket.sendTime += t1 - t0
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
    if (processingRef.current) {
      droppedFramesRef.current++
      statsRef.current.droppedFrames++
      return
    }

    const source = sourceCanvasRef.current

    // Check if the source canvas is still in the DOM
    if (!document.body.contains(source)) {
      sourceCanvasRef.current = null
      setSourceCanvasReady(false)
      return
    }

    const t0 = performance.now()

    try {
      // Draw to offscreen canvas first (do the expensive rescale once)
      if (!offscreenCtxRef.current || !offscreenCanvasRef.current) return

      processingRef.current = true

      offscreenCtxRef.current.drawImage(source, 0, 0, width, height)

      const t1 = performance.now()

      // Copy offscreen to preview (cheap 128x128 → 128x128 blit, no rescaling)
      if (showPreview && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.drawImage(offscreenCanvasRef.current, 0, 0)
        }
      }

      const t2 = performance.now()

      // Create ImageBitmap and transfer to worker for getImageData
      if (workerRef.current) {
        const bitmap = await createImageBitmap(offscreenCanvasRef.current)
        const t3 = performance.now()

        // Transfer bitmap to worker (zero-copy transfer)
        workerRef.current.postMessage({ type: 'capture', bitmap }, [bitmap])

        const t4 = performance.now()

        // Aggregate main thread stats
        const stats = statsRef.current
        stats.mainThread.count++
        stats.mainThread.drawTime += t1 - t0
        stats.mainThread.previewTime += t2 - t1
        stats.mainThread.bitmapTime += t3 - t2
        stats.mainThread.postTime += t4 - t3
        stats.mainThread.total += t4 - t0
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
