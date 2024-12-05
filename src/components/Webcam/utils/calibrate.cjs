import { wled } from '../pixelUtils.cjs'
import getLedCount from './getLedCount.js'
import iterativeOnOnlyOne from './iterativeOnOnlyOne.cjs'

async function calibrate(
  wledIp,
  waitTime,
  pointsRef,
  inputWidth = 400,
  inputHeight = 300,
  outputWidth = 50,
  outputHeight = 50,
  setPoints,
  addPoint,
  device
) {
  const flush = async () => {
    await wled({ seg: { on: true, col: [0, 0, 0] } })
  }
  const flushAll = async (pixels = 69) => {
    await wled({ seg: { i: [0, pixels, '000000'] } })
  }
  const leds = await getLedCount(wledIp)
  await flushAll(leds)
  setPoints([])
  await iterativeOnOnlyOne(
    waitTime / 7,
    pointsRef,
    inputWidth,
    inputHeight,
    outputWidth,
    outputHeight,
    addPoint,
    device
  )
  await flush()
  setPoints([])
}

export default calibrate
