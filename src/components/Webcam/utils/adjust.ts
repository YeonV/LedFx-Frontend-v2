import { processImages } from "./processImages"

async function adjust(
  capture: () => Promise<any>,
  initialImage: any,
  threshold = 128,
  ignoreTop = 0,
  ignoreLeft = 0,
  ignoreBottom = 0,
  ignoreRight = 0,
  pointsRef: any
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
