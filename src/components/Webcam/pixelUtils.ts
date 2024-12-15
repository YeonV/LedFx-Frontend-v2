import wait from './utils/wait'
import wled from './utils/wled'
import wledGet from './utils/wledGet'

export const iterativeOn = async (waitingTime: number) => {
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
