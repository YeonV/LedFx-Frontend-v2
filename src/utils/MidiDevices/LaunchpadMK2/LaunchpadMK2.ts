import { LaunchpadMK2Device } from '../LaunchPadDevice'
import { lpColors, lpCommonColors } from '../LaunchpadX/lpColors'

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
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    ],
    colors: lpColors,
    commonColors: lpCommonColors,
    command: {
      'programmer': [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0C, 0x0E, 0x01, 0xF7],
      'live': [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0C, 0x0E, 0x00, 0xF7],
      'standalone': [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0C, 0x10, 0x00, 0xF7],
      'daw': [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0C, 0x10, 0x01, 0xF7],
      'ledOn': [0x90, "buttonNumber", "color"],
      'ledFlash': [0x91, "buttonNumber", "color"],
      'ledPulse': [0x92, "buttonNumber", "color"],
      'rgb': [240, 0, 32, 41, 2, 12, 3, 3, "buttonNumber", "r", "g", "b", 247]
    },
    fn: {
      'ledOff': (buttonNumber: number) => [0x90, buttonNumber, 0x00],
      'ledOn': (buttonNumber: number, color: keyof typeof lpColors | number, mode: 'solid' | 'flash' | 'pulse' = 'solid') => [mode === 'pulse' ? 0x92 : mode === 'flash' ? 0x91 : 0x90, buttonNumber, typeof color === 'number' ? color : lpColors[color]],
      'ledSolid': (buttonNumber: number, color: keyof typeof lpColors | number ) => [0x90, buttonNumber, typeof color === 'number' ? color : lpColors[color]],
      'ledFlash': (buttonNumber: number, color: keyof typeof lpColors | number ) => [0x91, buttonNumber, typeof color === 'number' ? color : lpColors[color]],
      'ledPulse': (buttonNumber: number, color: keyof typeof lpColors | number ) => [0x92, buttonNumber, typeof color === 'number' ? color : lpColors[color]],
      'rgb': (buttonNumber: number, r: number, g: number, b: number) => [240, 0, 32, 41, 2, 12, 3, 3, buttonNumber, Math.floor(r/2), Math.floor(g/2), Math.floor(b/2), 247]
      
    }
  }