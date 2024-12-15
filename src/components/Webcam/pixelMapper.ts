import { iterativeOn } from './pixelUtils'
import { getLedCount } from './utils/getLedCount'
import iterativeOnOnlyOne from './utils/iterativeOnOnlyOne'
import wait from './utils/wait'
import wled from './utils/wled'

export async function calibrateOld(wledIp: string, waitTime: number) {
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
