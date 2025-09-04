/* eslint-disable no-unused-vars */
import { lpsColors } from './LaunchpadS/lpsColors'
import { lpColors } from './LaunchpadX/lpColors'
import { BaseDevice } from './BaseDevice'

export interface LaunchpadXDevice extends BaseDevice {
  command: {
    programmer: number[]
    live: number[]
    standalone: number[]
    daw: number[]
    ledOn: (number | string)[]
    ledFlash: (number | string)[]
    ledPulse: (number | string)[]
    rgb: (number | string)[]
    text: (number | string)[]
    stopText: number[]
  }
  fn: {
    ledOff: (buttonNumber: number) => number[]
    ledOn: (
      buttonNumber: number,
      color: keyof typeof lpColors | number,
      mode?: 'solid' | 'flash' | 'pulse'
    ) => number[]
    ledSolid: (buttonNumber: number, color: keyof typeof lpColors | number) => number[]
    ledFlash: (buttonNumber: number, color: keyof typeof lpColors | number) => number[]
    ledPulse: (buttonNumber: number, color: keyof typeof lpColors | number) => number[]
    rgb: (buttonNumber: number, r: number, g: number, b: number) => number[]
    text: (
      text: string,
      r: number,
      g: number,
      b: number,
      loop?: boolean,
      speed?: number
    ) => number[]
  }
}

export interface LaunchpadSDevice extends BaseDevice {
  command: {
    ledOn: (number | string)[]
  }
  fn: {
    ledOff: (buttonNumber: number) => number[]
    ledOn: (buttonNumber: number, color: keyof typeof lpsColors | number) => number[]
  }
}

export interface LaunchpadMK2Device extends BaseDevice {
  command: {
    programmer: number[]
    live: number[]
    standalone: number[]
    daw: number[]
    ledOn: (number | string)[]
    ledFlash: (number | string)[]
    ledPulse: (number | string)[]
    rgb: (number | string)[]
  }
  fn: {
    ledOff: (buttonNumber: number) => number[]
    ledOn: (
      buttonNumber: number,
      color: keyof typeof lpColors | number,
      mode?: 'solid' | 'flash' | 'pulse'
    ) => number[]
    ledSolid: (buttonNumber: number, color: keyof typeof lpColors | number) => number[]
    ledFlash: (buttonNumber: number, color: keyof typeof lpColors | number) => number[]
    ledPulse: (buttonNumber: number, color: keyof typeof lpColors | number) => number[]
    rgb: (buttonNumber: number, r: number, g: number, b: number) => number[]
  }
}

export type LaunchpadDevice = LaunchpadXDevice | LaunchpadSDevice | LaunchpadMK2Device
