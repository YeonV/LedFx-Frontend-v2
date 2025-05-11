interface Pixel {
  r: number
  g: number
  b: number
}

interface InitCanvasMessage {
  canvas: OffscreenCanvas
}

interface UpdatePixelsMessage {
  pixels: Pixel[]
  rows: number
  cols: number
}

type WorkerMessage = InitCanvasMessage | UpdatePixelsMessage

let canvas: OffscreenCanvas
let ctx: OffscreenCanvasRenderingContext2D

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  if ('canvas' in event.data) {
    canvas = event.data.canvas
    ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    ctx.imageSmoothingEnabled = false
  } else if ('pixels' in event.data) {
    const { pixels, rows, cols } = event.data
    canvas.width = cols
    canvas.height = rows

    const imageData = ctx.createImageData(cols, rows)
    for (let i = 0; i < pixels.length; i++) {
      const x = i % cols
      const y = Math.floor(i / cols)
      const index = (y * cols + x) * 4
      const color = pixels[i]
      imageData.data[index] = color.r
      imageData.data[index + 1] = color.g
      imageData.data[index + 2] = color.b
      imageData.data[index + 3] = 255 // Alpha channel
    }
    ctx.putImageData(imageData, 0, 0)
  }
}
