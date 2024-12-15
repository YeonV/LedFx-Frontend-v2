import { LaunchpadXDevice } from '../LaunchPadDevice'
import { lpColors, lpCommonColors } from './lpColors'

export const LaunchpadX: LaunchpadXDevice = {
  buttonNumbers: [
    [11, 12, 13, 14, 15, 16, 17, 18, 19],
    [21, 22, 23, 24, 25, 26, 27, 28, 29],
    [31, 32, 33, 34, 35, 36, 37, 38, 39],
    [41, 42, 43, 44, 45, 46, 47, 48, 49],
    [51, 52, 53, 54, 55, 56, 57, 58, 59],
    [61, 62, 63, 64, 65, 66, 67, 68, 69],
    [71, 72, 73, 74, 75, 76, 77, 78, 79],
    [81, 82, 83, 84, 85, 86, 87, 88, 89],
    [91, 92, 93, 94, 95, 96, 97, 98, 99]
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
    programmer: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x0e, 0x01, 0xf7],
    live: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x0e, 0x00, 0xf7],
    standalone: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x10, 0x00, 0xf7],
    daw: [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0c, 0x10, 0x01, 0xf7],
    ledOn: [0x90, 'buttonNumber', 'color'],
    ledFlash: [0x91, 'buttonNumber', 'color'],
    ledPulse: [0x92, 'buttonNumber', 'color'],
    rgb: [240, 0, 32, 41, 2, 12, 3, 3, 'buttonNumber', 'r', 'g', 'b', 247],
    text: [
      240, 0, 32, 41, 2, 12, 7, 1, 7, 0, 37, 72, 97, 99, 107, 101, 100, 32, 98,
      121, 32, 66, 108, 97, 100, 101, 33, 247
    ],
    stopText: [240, 0, 32, 41, 2, 12, 7, 247]
  },
  fn: {
    ledOff: (buttonNumber: number) => [0x90, buttonNumber, 0x00],
    ledOn: (
      buttonNumber: number,
      color: keyof typeof lpColors | number,
      mode: 'solid' | 'flash' | 'pulse' = 'solid'
    ) => [
      mode === 'pulse' ? 0x92 : mode === 'flash' ? 0x91 : 0x90,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    ledSolid: (buttonNumber: number, color: keyof typeof lpColors | number) => [
      0x90,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    ledFlash: (buttonNumber: number, color: keyof typeof lpColors | number) => [
      0x91,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    ledPulse: (buttonNumber: number, color: keyof typeof lpColors | number) => [
      0x92,
      buttonNumber,
      typeof color === 'number' ? color : lpColors[color]
    ],
    rgb: (buttonNumber: number, r: number, g: number, b: number) => [
      240,
      0,
      32,
      41,
      2,
      12,
      3,
      3,
      buttonNumber,
      Math.floor(r / 2),
      Math.floor(g / 2),
      Math.floor(b / 2),
      247
    ],
    text: (
      text: string,
      r: number,
      g: number,
      b: number,
      loop?: boolean,
      speed: number = 7
    ) => [
      240,
      0,
      32,
      41,
      2,
      12,
      7,
      loop ? 1 : 0,
      speed,
      1,
      Math.floor(r / 2),
      Math.floor(g / 2),
      Math.floor(b / 2),
      ...text.split('').map((char) => char.charCodeAt(0)),
      247
    ]
  }
}
