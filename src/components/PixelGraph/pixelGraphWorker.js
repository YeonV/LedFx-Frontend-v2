/* eslint-disable no-restricted-globals */
self.onmessage = (event) => {
    if (event.data.canvas) {
      self.canvas = event.data.canvas
      self.ctx = self.canvas.getContext('2d')
      self.ctx.imageSmoothingEnabled = false
    } else if (event.data.pixels) {
      const { pixels, rows, cols } = event.data
      self.canvas.width = cols
      self.canvas.height = rows
  
      const imageData = self.ctx.createImageData(cols, rows)
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
      self.ctx.putImageData(imageData, 0, 0)
    }
  }