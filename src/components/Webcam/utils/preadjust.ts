import wled from './wled'

async function preadjust() {
  await wled({ on: true })
  await wled({
    seg: {
      on: true,
      col: [
        [255, 0, 0],
        [255, 0, 0],
        [255, 0, 0]
      ]
    }
  })
}

export default preadjust
