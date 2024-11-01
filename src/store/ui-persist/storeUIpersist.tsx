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
    lessPixels: true,
  },
})

export default storeUIPersist
