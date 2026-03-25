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
        // Draw bitmap to worker-side canvas (GPU→CPU stall happens here, off main thread)
        ctx.drawImage(bitmap, 0, 0, width, height)
        const imageData = ctx.getImageData(0, 0, width, height)
        bitmap.close()

        // Convert RGBA to RGB (drop alpha to save bandwidth)
        const rgbaData = imageData.data
        const rgbData = new Uint8Array(width * height * 3)
        let rgbIndex = 0

        for (let i = 0; i < rgbaData.length; i += 4) {
          rgbData[rgbIndex++] = rgbaData[i] // R
          rgbData[rgbIndex++] = rgbaData[i + 1] // G
          rgbData[rgbIndex++] = rgbaData[i + 2] // B
          // Skip alpha (rgbaData[i + 3])
        }

        // Convert to base64 for JSON transmission
        // Chunked to avoid call stack overflow (spread is slow for 49k+ args)
        let binary = ''
        const chunkSize = 8192
        for (let i = 0; i < rgbData.length; i += chunkSize) {
          binary += String.fromCharCode(...rgbData.subarray(i, i + chunkSize))
        }
        const base64 = btoa(binary)

        self.postMessage({
          type: 'captured',
          pixelData: {
            width,
            height,
            encoding: 'base64-rgb',
            data: base64
          }
        })
      }
      break
  }
}

export {}
