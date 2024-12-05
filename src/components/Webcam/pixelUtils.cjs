import wait from './utils/wait.cjs'
import wled from './utils/wled.cjs'
import wledGet from './utils/wledGet.cjs'

export const iterativeOn = async (waitingTime) => {
  const state = await wledGet()
  const segments = state.seg
  for (const segment of segments) {
    for (let i = 0; i < segment.len; i++) {
      const singleLedOn = {
        seg: {
          id: segment.id,
          i: [i, i + 1, 'FFFFFF', i + 1, segment.len, '000000']
        }
      }
      await wled(singleLedOn)
      await wait(waitingTime)
    }
  }
}
