import { LaunchkeyMiniMK3Device } from '../LaunchkeyDevice'
import { lpColors, lpCommonColors } from '../LaunchpadX/lpColors'
import { createLedFunctions } from '../fnFactory'

export const LaunchkeyMiniMK3: LaunchkeyMiniMK3Device = {
  buttonNumbers: [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [36, 37, 38, 39, 44, 45, 46, 47, -1],
    [40, 41, 42, 43, 48, 49, 50, 51, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1]
  ],
  colors: lpColors,
  commonColors: lpCommonColors,
  globalColors: {
    sceneActiveType: 'rgb',
    sceneActiveColor: 'rgb(0, 255, 0)',
    sceneInactiveType: 'rgb',
    sceneInactiveColor: 'rgb(255, 0, 0)',
    commandType: 'rgb',
    commandColor: 'rgb(255, 255, 0)'
  },
  command: {
    standalone: [0x9f, 0x0c, 0x00],
    daw: [0x9f, 0x0c, 0x7f],
    ledOn: [0x99, 'buttonNumber', 'color'],
    ledFlash: [0x9a, 'buttonNumber', 'color'],
    ledPulse: [0x9b, 'buttonNumber', 'color']
  },
  fn: {
    ...createLedFunctions(0x99, 0x9a, 0x9b, lpColors)
  }
}
