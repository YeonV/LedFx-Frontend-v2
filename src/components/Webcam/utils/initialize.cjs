import wait from './wait.cjs'
import wled from './wled.cjs'

async function initialize(capture) {
  await wled({ seg: { on: false } })
  await wait(1000)
  const img = await capture()
  return img
}

export default initialize
