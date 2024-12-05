import { Image } from 'canvas'

async function createImageFromData(imageData) {
  const blob = new Blob([imageData], { type: 'image/webp' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.src = url
  await new Promise((resolve) => {
    img.onload = resolve
  })
  return img
}

export default createImageFromData
