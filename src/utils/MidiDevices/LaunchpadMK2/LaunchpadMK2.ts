import { LaunchpadMK2Device } from '../LaunchPadDevice'
import { lpColors, lpCommonColors } from '../LaunchpadX/lpColors'
import { createLedFunctions, rgbFunction } from '../fnFactory'

export const LaunchpadMK2: LaunchpadMK2Device = {
  buttonNumbers: [
    [11, 12, 13, 14, 15, 16, 17, 18, 19],
    [21, 22, 23, 24, 25, 26, 27, 28, 29],
    [31, 32, 33, 34, 35, 36, 37, 38, 39],
    [41, 42, 43, 44, 45, 46, 47, 48, 49],
    [51, 52, 53, 54, 55, 56, 57, 58, 59],
    [61, 62, 63, 64, 65, 66, 67, 68, 69],
    [71, 72, 73, 74, 75, 76, 77, 78, 79],
    [81, 82, 83, 84, 85, 86, 87, 88, 89],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1]
  ],
  colors: lpColors,
  commonColors: lpCommonColors,
  globalColors: {
    sceneActiveType: '90',
    sceneActiveColor: '1E',
    sceneInactiveType: '90',
    sceneInactiveColor: '3C',
    commandType: '90',
    commandColor: '63'
  },
  command: {
    programmer: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x0e, 0x01, 0xf7],
    live: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x0e, 0x00, 0xf7],
    standalone: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x10, 0x00, 0xf7],
    daw: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x10, 0x01, 0xf7],
    ledOn: [0x90, 'buttonNumber', 'color'],
    ledFlash: [0x91, 'buttonNumber', 'color'],
    ledPulse: [0x92, 'buttonNumber', 'color'],
    rgb: [240, 0, 32, 41, 2, 12, 3, 3, 'buttonNumber', 'r', 'g', 'b', 247]
  },
  fn: {
    ...createLedFunctions(0x90, 0x91, 0x92, lpColors),
    rgb: rgbFunction
  }
}
