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
  // eslint-disable-next-line no-unused-vars
  fn: Record<string, (...args: any[]) => any>
}
