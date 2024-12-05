function calculateImageDifference(
  img1,
  img2,
  threshold = 128,
  ignoreTop = 0,
  ignoreLeft = 0,
  ignoreBottom = 0,
  ignoreRight = 0
) {
  // console.log("BROOOOO", img1.width, img1.height, ignoreTop, ignoreLeft, ignoreBottom, ignoreRight)
  const width = img1.width - ignoreLeft - ignoreRight
  const height = img1.height - ignoreTop - ignoreBottom
  const canvas = document.createElement('canvas', { willReadFrequently: true })
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  // context.drawImage(img1, 0, 0, width, height)
  context.drawImage(
    img1,
    ignoreLeft,
    ignoreTop,
    width,
    height,
    0,
    0,
    width,
    height
  )
  const imageData1 = context.getImageData(0, 0, width, height).data
  context.clearRect(0, 0, width, height)
  // context.drawImage(img2, 0, 0, width, height)
  context.drawImage(
    img2,
    ignoreLeft,
    ignoreTop,
    width,
    height,
    0,
    0,
    width,
    height
  )
  const imageData2 = context.getImageData(0, 0, width, height).data
  const diffData = new Uint8ClampedArray(width * height * 4)

  const whitePixels = []

  for (let i = 0; i < width * height * 4; i += 4) {
    const diffRed = Math.abs(imageData1[i] - imageData2[i])
    const diffGreen = Math.abs(imageData1[i + 1] - imageData2[i + 1])
    const diffBlue = Math.abs(imageData1[i + 2] - imageData2[i + 2])
    const diffAlpha = 255
    const avgDiff = (diffRed + diffGreen + diffBlue) / 3 // Combine differences (simple average) Ignore the alpha channel
    const outputValue = avgDiff > threshold ? 255 : 0
    diffData[i] = outputValue
    diffData[i + 1] = outputValue
    diffData[i + 2] = outputValue
    diffData[i + 3] = diffAlpha // Keep alpha channel intact

    if (outputValue === 255) {
      const x = (i / 4) % width
      const y = Math.floor(i / 4 / width)
      whitePixels.push({ x, y })
    }
  }

  const whitePixelsCount = whitePixels.length
  const whitePixelsCenter = whitePixels.reduce(
    (acc, { x, y }) => ({ x: acc.x + x, y: acc.y + y }),
    { x: 0, y: 0 }
  )
  whitePixelsCenter.x /= whitePixelsCount
  whitePixelsCenter.y /= whitePixelsCount

  context.putImageData(new window.ImageData(diffData, width, height), 0, 0)

  // Draw a small red circle at the center of the white area
  context.beginPath()
  context.arc(
    whitePixelsCenter.x,
    whitePixelsCenter.y,
    5,
    0,
    2 * Math.PI,
    false
  )
  context.fillStyle = 'red'
  context.fill()

  return { diffImage: canvas.toDataURL('image/webp'), whitePixelsCenter }
}

export default calculateImageDifference
