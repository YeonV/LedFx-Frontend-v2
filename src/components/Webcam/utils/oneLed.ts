import wled from "./wled"
import wledGet from "./wledGet"


const oneLed = async (led: number) => {
  const state = await wledGet('state')
  const segments = state.seg
  let totalLedCount = 0

  // First, turn all LEDs off
  for (const segment of segments) {
    const allLedsOff = {
      seg: {
        id: segment.id,
        i: [0, segment.len, '000000']
      }
    }
    await wled(allLedsOff)
  }

  // Then, turn on the specified LED
  for (const segment of segments) {
    totalLedCount += segment.len
    if (totalLedCount >= led) {
      const ledInSegment = led - (totalLedCount - segment.len)
      const singleLedOn = {
        seg: {
          id: segment.id,
          i: [ledInSegment, ledInSegment + 1, 'FFFFFF']
        }
      }
      await wled(singleLedOn)
      break
    }
  }
}

export default oneLed
