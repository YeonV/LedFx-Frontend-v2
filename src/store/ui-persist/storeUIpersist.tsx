export const PixelGraphVariants = [
  'original',
  'canvas',
  'canvasOffscreen',
  'canvasOffscreenWebGL',
  'canvasOffscreenWebGLSync'
]
type PixelGraphVariant = (typeof PixelGraphVariants)[number]

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
  expander: {
    scenesRecent: false,
    scenesMostUsed: false
  } as Record<string, boolean>,
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
    variants: ['canvas'] as PixelGraphVariant[]
  }
})

export default storeUIPersist
