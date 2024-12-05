import wled from './wled.cjs'

const setWledBrightness = async (brightness = 255) => {
  await wled({ bri: brightness })
}

export default setWledBrightness
