export const PixelGraphVariants = [
  'original',
  'canvas',
  'canvasOffscreen',
  'canvasOffscreenWebGL',
  'canvasOffscreenWebGLSync'
]
type PixelGraphVariant = (typeof PixelGraphVariants)[number]

const storeUIPersist = () => ({
  infoAlerts: {
    scenes: true,
    devices: true,
    user: true,
    gamepad: true,
    matrix: true,
    camera: true,
    matrixGroups: true,
    pixelMode: true,
    groupMode: true
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
    variants: 'canvas' as PixelGraphVariant
  },
  layout: {
    separate2DDevices: false,
    sectionDirection: 'column' as 'column' | 'row',
    itemDirection: 'row' as 'column' | 'row',
    sectionWidth: '100%' as '420px' | '870px' | '1320px' | '100%'
  },
  offscreenCapture: {
    enabled: false,
    width: 128,
    height: 128,
    fps: 15,
    targetDevice: 'visualiser-capture',
    showPreview: false
  }
})

export default storeUIPersist
