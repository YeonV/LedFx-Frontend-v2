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

        // Encode pixel data for WebSocket transmission
        // Convert RGBA to RGB (drop alpha channel to save bandwidth)
        const rgbaData = imageData.data
        const rgbData = new Uint8Array(width * height * 3)
        let rgbIndex = 0

        for (let i = 0; i < rgbaData.length; i += 4) {
          rgbData[rgbIndex++] = rgbaData[i] // R
          rgbData[rgbIndex++] = rgbaData[i + 1] // G
          rgbData[rgbIndex++] = rgbaData[i + 2] // B
          // Skip alpha (rgbaData[i + 3])
        }

        const t3 = performance.now()

        // Convert to base64 for JSON transmission
        // Alternative: could use binary WebSocket frames
        const base64 = btoa(String.fromCharCode(...rgbData))

        const t4 = performance.now()

        // Send back the encoded data and timing
        self.postMessage({
          type: 'captured',
          pixelData: {
            width,
            height,
            encoding: 'base64-rgb',
            data: base64
          },
          timing: {
            drawTime: t1 - t0,
            extractTime: t2 - t1,
            rgbConvertTime: t3 - t2,
            base64EncodeTime: t4 - t3,
            totalTime: t4 - t0
          },
          bytesSaved: rgbaData.length - rgbData.length
        })
      }
      break
  }
}

export {}
