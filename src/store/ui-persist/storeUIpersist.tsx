type PixelGraphVariant = 'original' | 'canvas'
const storeUIPersist = (set: any) => ({
  infoAlerts: {
    scenes: true,
    devices: true,
    user: true,
    gamepad: true,
    matrix: true,
    camera: true,
    matrixGroups: true,
    pixelMode: true
  },
  warnings: {
    lessPixels: true
  },
  blenderAutomagic: true,
  showHex: false,
  pixelGraphSettings: {
    smoothing: false,
    round: true,
    space: true,
    stretch: true,
    variants: ['original'] as PixelGraphVariant[]
  }
})

export default storeUIPersist
