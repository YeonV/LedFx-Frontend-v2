import { produce } from 'immer'
import type { IStore } from '../useStore'

export interface IPoints {
  x: number
  y: number
  device: string
  led: number
  segment: string
}

const storeVideo = (set: any) => ({
  videoMapper: {
    wledIp: '',
    calibrating: false
  },
  points: [] as IPoints[],
  setPoints: (points: IPoints[]): void =>
    set(
      produce((state: IStore) => {
        state.points = points
      }),
      false,
      'setPoints'
    ),
  addPoint: (point: IPoints): void =>
    set(
      produce((state: IStore) => {
        state.points.push(point)
      }),
      false,
      'addPoint'
    ),
  setWledIp: (wledIp: string): void =>
    set(
      produce((state: IStore) => {
        state.videoMapper.wledIp = wledIp
      }),
      false,
      'setWledIp'
    ),
  setCalibrating: (calibrating: boolean): void =>
    set(
      produce((state: IStore) => {
        state.videoMapper.calibrating = calibrating
      }),
      false,
      'setCalibrating'
    )
})

export default storeVideo
