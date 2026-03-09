import { useEffect, useRef, useCallback, useState } from 'react'

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
  targetDevice: _targetDevice = 'visualiser-capture',
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
          console.log('[OffscreenVisualiserCapture] Worker ready')
        } else if (e.data.type === 'captured') {
          // Log timing from worker occasionally
          if (Math.random() < 0.033) {
            console.log('[OffscreenVisualiserCapture] Worker timing:')
            console.log(`  - Draw bitmap: ${e.data.drawTime.toFixed(2)}ms`)
            console.log(`  - getImageData: ${e.data.extractTime.toFixed(2)}ms`)
            console.log(`  - Total: ${e.data.totalTime.toFixed(2)}ms (${e.data.pixelCount} bytes)`)
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

      console.log('[OffscreenVisualiserCapture] Canvases created:', {
        width,
        height
      })

      // Try to find the visualiser canvas
      const findVisualiserCanvas = () => {
        // ONLY search within the background visualizer container
        const bgContainer = document.querySelector('[data-background-visualizer="true"]')
        if (!bgContainer) {
          console.log('[OffscreenVisualiserCapture] Background visualizer container not found yet')
          return false
        }

        const canvases = bgContainer.querySelectorAll('canvas')
        console.log(
          '[OffscreenVisualiserCapture] Searching for visualiser canvas in background container, found',
          canvases.length,
          'canvases'
        )

        // Log all canvases for debugging
        Array.from(canvases).forEach((c, idx) => {
          console.log(`[OffscreenVisualiserCapture] Canvas ${idx}:`, {
            width: c.width,
            height: c.height,
            id: c.id,
            className: c.className,
            isOurs: c === canvasRef.current || c === offscreen
          })
        })

        for (const c of canvases) {
          // Skip our own canvases
          if (c === canvasRef.current || c === offscreen) continue
          // Look for a canvas that's reasonably large (likely the visualiser)
          // Also ensure it's not the tiny default canvas (300x150)
          if (c.width > 400 && c.height > 300) {
            sourceCanvasRef.current = c
            setSourceCanvasReady(true)
            console.log('[OffscreenVisualiserCapture] Found background visualiser canvas:', {
              width: c.width,
              height: c.height,
              id: c.id,
              className: c.className
            })
            return true
          }
        }
        console.log('[OffscreenVisualiserCapture] No suitable visualiser canvas found yet')
        return false
      }

      // Try to find it immediately, then keep trying
      if (!findVisualiserCanvas()) {
        console.log('[OffscreenVisualiserCapture] Will retry finding visualiser canvas every 500ms')
        findCanvasIntervalRef.current = setInterval(() => {
          if (findVisualiserCanvas()) {
            // Don't clear interval - keep monitoring in case canvas changes
            console.log('[OffscreenVisualiserCapture] Canvas found, will continue monitoring')
          }
        }, 500)
      } else {
        // Found immediately, but still monitor for changes
        console.log('[OffscreenVisualiserCapture] Starting canvas monitoring interval')
        findCanvasIntervalRef.current = setInterval(() => {
          // Check if current canvas is still valid
          if (sourceCanvasRef.current && !document.body.contains(sourceCanvasRef.current)) {
            console.log('[OffscreenVisualiserCapture] Canvas changed, searching for new one...')
            sourceCanvasRef.current = null
            setSourceCanvasReady(false)
            findVisualiserCanvas()
          } else if (!sourceCanvasRef.current) {
            // Try to find it again
            findVisualiserCanvas()
          }
        }, 500)
      }
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
    }
  }, [enabled, width, height, showPreview])

  // Capture frame - offload expensive work to worker
  const captureAndSend = useCallback(async () => {
    if (!sourceCanvasRef.current) return

    const source = sourceCanvasRef.current

    // Check if the source canvas is still in the DOM
    // If the user changes visualizations, a new canvas is created
    if (!document.body.contains(source)) {
      console.log('[OffscreenVisualiserCapture] Source canvas no longer in DOM, resetting...')
      sourceCanvasRef.current = null
      setSourceCanvasReady(false)
      return
    }

    const t0 = performance.now()

    try {
      // Draw to offscreen canvas first (do the expensive rescale once)
      if (!offscreenCtxRef.current || !offscreenCanvasRef.current) return

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

        // Log main thread timing occasionally
        if (Math.random() < 0.033) {
          console.log('[OffscreenVisualiserCapture] Main thread timing:')
          console.log(`  - Offscreen drawImage (rescale): ${(t1 - t0).toFixed(2)}ms`)
          console.log(`  - Preview copy: ${(t2 - t1).toFixed(2)}ms`)
          console.log(`  - createImageBitmap: ${(t3 - t2).toFixed(2)}ms`)
          console.log(`  - postMessage: ${(t4 - t3).toFixed(2)}ms`)
          console.log(`  - Main thread total: ${(t4 - t0).toFixed(2)}ms`)
        }
      }
    } catch (error) {
      console.error('[OffscreenVisualiserCapture] Error capturing frame:', error)
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

    console.log('[OffscreenVisualiserCapture] Starting capture loop at', fps, 'fps')

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
