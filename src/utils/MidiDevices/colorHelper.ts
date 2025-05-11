import { MidiDevices } from './MidiDevices'

export type IColor = keyof (typeof MidiDevices)['Launchpad']['X']['colors']

// Helper function to zero-pad hex values
export const zeroPadHex = (value: number | string | undefined) => {
  if (value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  return value.toString(16).toUpperCase().padStart(2, '0')
}
// export const zeroPadHex = (value: number) => value.toString(16).toUpperCase().padStart(2, '0')

// Helper function to convert hex to HSL
export const hexToHSL = (hex: string) => {
  let r = 0
  let g = 0
  let b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return [h, s, l]
}

// Helper function to sort colors by HSL values, prioritizing hue and saturation, then lightness
export const sortColorsByHSL = (colors: IColor[]) => {
  return colors.sort((a, b) => {
    const [hA, sA, lA] = hexToHSL(a)
    const [hB, sB, lB] = hexToHSL(b)
    if (hA !== hB) return hA - hB
    if (sA !== sB) return sA - sB
    return lA - lB
  })
}

export const rgbValues = (rgbString: string) => rgbString.match(/\d+/g)?.map(Number)

export const sendMidiMessageHelper = (
  fn: (typeof MidiDevices)[keyof typeof MidiDevices][keyof (typeof MidiDevices)[keyof typeof MidiDevices]]['fn'],
  output: any,
  buttonNumber: number,
  color: string,
  typeCommand: string,
  isActive: boolean
) => {
  if (!output || buttonNumber === -1 || Number.isNaN(buttonNumber)) {
    console.error('No MIDI output devices found')
    return
  }
  // console.log(1,'rgb' in fn , color?.startsWith('rgb') , typeCommand === 'rgb')
  if ('rgb' in fn && fn.rgb && color?.startsWith('rgb') && typeCommand === 'rgb') {
    const [r, g, b] = rgbValues(color) || (isActive ? [0, 255, 0] : [255, 0, 0])
    output.send(fn.rgb(buttonNumber, r, g, b))
    // console.log('rgb', buttonNumber, r, g, b)
  } else {
    const colorValue = parseInt(color || (isActive ? '1E' : '3C'), 16)
    // console.log(2, colorValue, color)
    if (typeCommand === '91' && 'ledFlash' in fn) {
      output.send(fn.ledFlash(buttonNumber, colorValue))
    } else if (typeCommand === '92' && 'ledPulse' in fn) {
      output.send(fn.ledPulse(buttonNumber, colorValue))
    } else {
      output.send(fn.ledOn(buttonNumber, colorValue))
    }
  }
}
