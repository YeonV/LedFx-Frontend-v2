import wait from "./wait"
import wled from "./wled"

async function initialize(capture: () => Promise<any>) {
  await wled({ seg: { on: false } })
  await wait(1000)
  const img = await capture()
  return img
}

export default initialize
