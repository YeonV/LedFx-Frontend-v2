import {
  wled,
  wait,
  processImages,
  iterativeOnOnlyOne,
  iterativeOn,
  getLedCount
} from './pixelUtils'

export async function initialize(capture) {
  await wled({ seg: { on: false } })
  await wait(1000)
  let img = await capture()
  return img
}

export async function preadjust() {
  await wled({ on: true })
  await wled({ seg: { on: true, col: [[255, 0, 0],[255, 0, 0],[255, 0, 0]]}})
}
export async function adjust(
  capture,
  initialImage,
  threshold = 128,
  ignoreTop = 0,
  ignoreLeft = 0,
  ignoreBottom = 0,
  ignoreRight = 0,
  pointsRef
) {
  let img = await capture()
  processImages(initialImage, img, threshold, ignoreTop, ignoreLeft, ignoreBottom, ignoreRight, pointsRef)
}

export async function calibrate(wledIp, waitTime, pointsRef, inputWidth = 400, inputHeight = 300, outputWidth = 50, outputHeight = 50, setPoints,addPoint, device) {
  const flush = async () => {
    await wled({ seg: { on: true, col: [0, 0, 0] } })
  }
  const flushAll = async (pixels = 69) => {
    await wled({ seg: { i: [0, pixels, '000000'] } })
  }
  const leds = await getLedCount(wledIp)
  await flushAll(leds)
  setPoints([])
  await iterativeOnOnlyOne(waitTime / 7, pointsRef, inputWidth, inputHeight, outputWidth, outputHeight, addPoint, device)
  await flush()
  setPoints([])
}

export async function calibrateOld(wledIp, waitTime) {
  const flush = async () => {
    await wled({ seg: { on: true, col: [0, 0, 0] } })
  }
  const flushAll = async (pixels = 69) => {
    await wled({ seg: { i: [0, pixels, '000000'] } })
  }

  await iterativeOn(waitTime / 25)
  await wait(waitTime)
  const leds = await getLedCount(wledIp)
  await flushAll(leds)

  await iterativeOnOnlyOne(waitTime / 7)
  await flush()
}
