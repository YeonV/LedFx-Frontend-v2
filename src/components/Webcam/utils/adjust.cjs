import { processImages } from './processImages.cjs'

async function adjust(
  capture,
  initialImage,
  threshold = 128,
  ignoreTop = 0,
  ignoreLeft = 0,
  ignoreBottom = 0,
  ignoreRight = 0,
  pointsRef
) {
  const img = await capture()
  processImages(
    initialImage,
    img,
    threshold,
    ignoreTop,
    ignoreLeft,
    ignoreBottom,
    ignoreRight,
    pointsRef
  )
}

export default adjust
