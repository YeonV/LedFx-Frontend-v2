// Helper function to zero-pad hex values
export const zeroPadHex = (value: number) => value.toString(16).toUpperCase().padStart(2, '0')

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

export const lpColors = {
    '#616161': 0x00,
    '#b3b3b3': 0x01,
    '#dddddd': 0x02,
    '#ffffff': 0x03,
    '#ffb3b3': 0x04,
    '#ff6161': 0x05,
    '#dd6161': 0x06,
    '#b36161': 0x07,
    '#fff3d5': 0x08,
    '#ffb361': 0x09,
    '#dd8c61': 0x0a,
    '#b37661': 0x0b,
    '#ffeea1': 0x0c,
    '#ffff61': 0x0d,
    '#dddd61': 0x0e,
    '#b3b361': 0x0f,
    '#ddffa1': 0x10,
    '#c2ff61': 0x11,
    '#a1dd61': 0x12,
    '#81b361': 0x13,
    '#c2ffb3': 0x14,
    '#61ff61': 0x15,
    '#61dd61': 0x16,
    '#61b361': 0x17,
    '#c2ffc2': 0x18,
    '#61ff8c': 0x19,
    '#61dd76': 0x1a,
    '#61b36b': 0x1b,
    '#c2ffcc': 0x1c,
    '#61ffcc': 0x1d,
    '#61dda1': 0x1e,
    '#61b381': 0x1f,
    '#c2fff3': 0x20,
    '#61ffe9': 0x21,
    '#61ddc2': 0x22,
    '#61b396': 0x23,
    '#c2f3ff': 0x24,
    '#61eeff': 0x25,
    '#61c7dd': 0x26,
    '#61a1b3': 0x27,
    '#c2ddff': 0x28,
    '#61c7ff': 0x29,
    '#61a1dd': 0x2a,
    '#6181b3': 0x2b,
    '#a18cff': 0x2c,
    '#6161ff': 0x2d,
    '#6161dd': 0x2e,
    '#6161b3': 0x2f,
    '#ccb3ff': 0x30,
    '#a161ff': 0x31,
    '#8161dd': 0x32,
    '#7661b3': 0x33,
    '#ffb3ff': 0x34,
    '#ff61ff': 0x35,
    '#dd61dd': 0x36,
    '#b361b3': 0x37,
    '#ffb3d5': 0x38,
    '#ff61c2': 0x39,
    '#dd61a1': 0x3a,
    '#b3618c': 0x3b,
    '#ff7661': 0x3c,
    '#e9b361': 0x3d,
    '#ddc261': 0x3e,
    '#a1a161': 0x3f,
    '#61b261': 0x40,
    '#61b38c': 0x41,
    '#618cd5': 0x42,
    '#6162ff': 0x43,
    '#61b3b3': 0x44,
    '#8c61f3': 0x45,
    '#ccb3c2': 0x46,
    '#8c7681': 0x47,
    '#ff6261': 0x48,
    '#f3ffa1': 0x49,
    '#eefc61': 0x4a,
    '#ccff61': 0x4b,
    '#76dd61': 0x4c,
    '#61ffcd': 0x4d,
    '#61e9ff': 0x4e,
    '#61a1ff': 0x4f,
    '#8c61ff': 0x50,
    '#cc61fc': 0x51,
    '#ee8cdd': 0x52,
    '#a17661': 0x53,
    '#ffa161': 0x54,
    '#cbe558': 0x55,
    '#d5ff8c': 0x56,
    '#61ff62': 0x57,
    '#b3ffa1': 0x58,
    '#ccfcd5': 0x59,
    '#b3fff6': 0x5a,
    '#cce4ff': 0x5b,
    '#a1c2f6': 0x5c,
    '#d5c2f9': 0x5d,
    '#f98cff': 0x5e,
    '#ff61cc': 0x5f,
    '#ffc261': 0x60,
    '#f3ee61': 0x61,
    '#e3fe60': 0x62,
    '#ddcc61': 0x63,
    '#b3a161': 0x64,
    '#61ba76': 0x65,
    '#76c28c': 0x66,
    '#8181a1': 0x67,
    '#818ccc': 0x68,
    '#ccaa81': 0x69,
    '#dd6261': 0x6a,
    '#f9b3a1': 0x6b,
    '#f9ba76': 0x6c,
    '#fff38c': 0x6d,
    '#e9f9a1': 0x6e,
    '#d5ee76': 0x6f,
    '#8181a2': 0x70,
    '#f9f9d5': 0x71,
    '#ddfce4': 0x72,
    '#e9e9ff': 0x73,
    '#e4d5ff': 0x74,
    '#b3b3b4': 0x75,
    '#d5d5d5': 0x76,
    '#f9ffff': 0x77,
    '#e96161': 0x78,
    '#aa6161': 0x79,
    '#81f661': 0x7a,
    '#61b461': 0x7b,
    '#f3ee62': 0x7c,
    '#b3a162': 0x7d,
    '#eec261': 0x7e,
    '#c27661': 0x7f,
}

export const getColorFromValue = (value: string) => {
  const numericValue = parseInt(value, 16);
  return Object.keys(lpColors).find(key => lpColors[key as IColor] === numericValue) || undefined;
}

export type IColor = keyof typeof lpColors