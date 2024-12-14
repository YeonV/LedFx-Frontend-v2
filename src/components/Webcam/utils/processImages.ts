import calculateImageDifference from "./calculateImageDifference"
import createImageFromData from "./createImageFromData"
import decodeBase64ToImageData from "./decodeBase64ToImageData"

export async function processImages(
  img1b64: string,
  img2b64: string,
  threshold = 128,
  ignoreTop = 0,
  ignoreLeft = 0,
  ignoreBottom = 0,
  ignoreRight = 0,
  pointsRef: any
) {
  try {
    const imageData1 = decodeBase64ToImageData(img1b64)
    const image1 = await createImageFromData(imageData1)
    const imageData2 = decodeBase64ToImageData(img2b64)
    const image2 = await createImageFromData(imageData2)
    const diffData = calculateImageDifference(
      image1,
      image2,
      threshold,
      ignoreTop,
      ignoreLeft,
      ignoreBottom,
      ignoreRight
    )
    const diffImageBase64 = diffData.diffImage
    // console.log("BROOOOO", diffData.whitePixelsCenter)
    if (pointsRef) pointsRef.current = diffData.whitePixelsCenter
    const diffImageElement = document.getElementById('diffImage')
    if (diffImageElement && diffImageElement instanceof HTMLImageElement) diffImageElement.src = diffImageBase64
  } catch (error) {
    console.error('Error processing images:', error)
  }
}
