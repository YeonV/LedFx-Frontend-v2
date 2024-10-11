import { MidiDevices } from './MidiDevices'

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
  let r = 0, g = 0, b = 0
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
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
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

export type IColor = keyof typeof MidiDevices['Launchpad']['X']['colors']

export const rgbValues = (rgbString: string) => rgbString.match(/\d+/g)?.map(Number);
