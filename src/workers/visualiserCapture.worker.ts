/**
 * Web Worker for offscreen visualiser capture
 * Handles the expensive getImageData operation off the main thread
 */

/* eslint-disable no-restricted-globals */

interface WorkerMessage {
  type: 'init' | 'capture'
  bitmap?: ImageBitmap
  width?: number
  height?: number
}

let offscreenCanvas: OffscreenCanvas | null = null
let ctx: OffscreenCanvasRenderingContext2D | null = null
let width = 128
let height = 128

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, bitmap } = e.data

  switch (type) {
    case 'init':
      width = e.data.width || 128
      height = e.data.height || 128
      offscreenCanvas = new OffscreenCanvas(width, height)
      ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true })
      self.postMessage({ type: 'ready' })
      break

    case 'capture':
      if (ctx && offscreenCanvas && bitmap) {
        const t0 = performance.now()

        // Draw the bitmap to our canvas
        ctx.drawImage(bitmap, 0, 0, width, height)

        const t1 = performance.now()

        // Extract pixel data (expensive GPU→CPU transfer, but off main thread)
        const imageData = ctx.getImageData(0, 0, width, height)

        const t2 = performance.now()

        // Close the bitmap to free memory
        bitmap.close()

        // TODO: Encode for WebSocket here
        // For now, just send back timing info and pixel count
        self.postMessage({
          type: 'captured',
          pixelCount: imageData.data.length,
          drawTime: t1 - t0,
          extractTime: t2 - t1,
          totalTime: t2 - t0
        })
      }
      break
  }
}

export {}
