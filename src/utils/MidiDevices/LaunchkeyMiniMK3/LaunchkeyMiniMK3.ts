import { LaunchkeyMiniMK3Device } from '../LaunchkeyDevice'
import { lpColors, lpCommonColors } from '../LaunchpadX/lpColors'

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
    ledOff: (buttonNumber: number) => [0x99, buttonNumber, 0x00],
    ledOn: (
      buttonNumber: number,
      color: keyof typeof lpColors | number,
      mode: 'solid' | 'flash' | 'pulse' = 'solid'
    ) => [
      mode === 'pulse' ? 0x9b : mode === 'flash' ? 0x9a : 0x99,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    ledSolid: (buttonNumber: number, color: keyof typeof lpColors | number) => [
      0x99,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    ledFlash: (buttonNumber: number, color: keyof typeof lpColors | number) => [
      0x9a,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    ledPulse: (buttonNumber: number, color: keyof typeof lpColors | number) => [
      0x9b,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ]
  }
}
