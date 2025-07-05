import { LaunchpadSDevice } from '../LaunchPadDevice'
import { lpsColors, lpsCommonColors } from './lpsColors'

export const LaunchpadS: LaunchpadSDevice = {
  buttonNumbers: [
    [112, 113, 114, 115, 116, 117, 118, 119, 120],
    [96, 97, 98, 99, 100, 101, 102, 103, 104],
    [80, 81, 82, 83, 84, 85, 86, 87, 88],
    [64, 65, 66, 67, 68, 69, 70, 71, 72],
    [48, 49, 50, 51, 52, 53, 54, 55, 56],
    [32, 33, 34, 35, 36, 37, 38, 39, 40],
    [16, 17, 18, 19, 20, 21, 22, 23, 24],
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1]
  ],
  colors: lpsColors,
  commonColors: lpsCommonColors,
  globalColors: {
    sceneActiveType: '90',
    sceneActiveColor: '3C',
    sceneInactiveType: '90',
    sceneInactiveColor: '0F',
    commandType: '90',
    commandColor: '3E'
  },
  command: {
    ledOn: [0x90, 'buttonNumber', 'color']
  },
  fn: {
    ledOff: (buttonNumber: number) => [0x90, buttonNumber, 0x0c],
    ledOn: (buttonNumber: number, color: keyof typeof lpsColors | number) => [
      0x90,
      buttonNumber,
      typeof color === 'number' ? color : lpsColors[color]
    ]
  }
}
