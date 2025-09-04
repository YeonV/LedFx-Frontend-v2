export interface BaseDevice {
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
  command: Record<string, (number | string)[] | number[]>
  fn: Record<string, (...args: any[]) => any>
}
