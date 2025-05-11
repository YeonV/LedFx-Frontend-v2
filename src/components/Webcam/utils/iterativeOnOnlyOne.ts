import { transpose } from '../matrixUtils'
import wait from './wait'
import wled from './wled'
import wledGet from './wledGet'

const iterativeOnOnlyOne = async (
  waitingTime: number,
  pointsRef?: any,
  inputWidth = 400,
  inputHeight = 300,
  outputWidth = 50,
  outputHeight = 50,
  addPoint?: any,
  device?: any
) => {
  const state = await wledGet()
  const segments = state.seg
  let totalPreviousLength = 0 // Initialize total length of previous segments
  for (const segment of segments) {
    for (let i = 0; i < segment.len + 1; i++) {
      const singleLedOn = {
        seg: {
          id: segment.id,
          i:
            i === 0
              ? [i, i + 1, 'FFFFFF', i + 1, segment.len, '000000']
              : [0, i, '000000', i, i + 1, 'FFFFFF', i + 1, segment.len, '000000']
        }
      }
      await wled(singleLedOn)
      const transposed = transpose(
        pointsRef?.current?.x,
        pointsRef?.current?.y,
        inputWidth,
        inputHeight,
        outputWidth,
        outputHeight
      )
      if (!isNaN(transposed.x) && !isNaN(transposed.y)) {
        // console.log("transposed", {...transposed, segment: segment.id, led: i, device})
        addPoint({
          ...transposed,
          segment: segment.id,
          led: totalPreviousLength + i,
          device
        }) // Add totalPreviousLength to i
        await wait(waitingTime)
      }
    }
    totalPreviousLength += segment.len // Update total length of previous segments
  }
}

export default iterativeOnOnlyOne
