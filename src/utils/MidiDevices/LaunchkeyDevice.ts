/* eslint-disable no-unused-vars */
import { lpColors } from './LaunchpadX/lpColors'

export interface LaunchkeyMK3Device {
  buttonNumbers: number[][]
  colors: Record<string, number>
  commonColors: Record<string, number>
  globalColors: {
    sceneActiveType: string
    sceneActiveColor: string
    sceneInactiveType: string
    sceneInactiveColor: string
    commandType: string
    commandColor: string
  }
  command: {
    standalone: number[]
    daw: number[]
    ledOn: (number | string)[]
    ledFlash: (number | string)[]
    ledPulse: (number | string)[]
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
    text: (text: string) => number[]
  }
}

export interface LaunchkeyMiniMK3Device {
  buttonNumbers: number[][]
  colors: Record<string, number>
  commonColors: Record<string, number>
  globalColors: {
    sceneActiveType: string
    sceneActiveColor: string
    sceneInactiveType: string
    sceneInactiveColor: string
    commandType: string
    commandColor: string
  }
  command: {
    standalone: number[]
    daw: number[]
    ledOn: (number | string)[]
    ledFlash: (number | string)[]
    ledPulse: (number | string)[]
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
  }
}

export type LaunchkeyDevice = LaunchkeyMK3Device | LaunchkeyMiniMK3Device
