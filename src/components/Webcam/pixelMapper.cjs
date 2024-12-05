import {
  wled,
  wait,
  iterativeOnOnlyOne,
  iterativeOn,
  getLedCount
} from './pixelUtils.cjs'

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
