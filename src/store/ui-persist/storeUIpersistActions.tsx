import { produce } from 'immer'
import type { IStore } from '../useStore'

const storeUIPersistActions = (set: any) => ({
  setInfoAlerts: (
    key:
      | 'scenes'
      | 'devices'
      | 'user'
      | 'gamepad'
      | 'matrix'
      | 'camera'
      | 'matrixGroups'
      | 'pixelMode',
    val: boolean
  ): void =>
    set(
      produce((state: IStore) => {
        state.uiPersist.infoAlerts[key] = val
      }),
      false,
      'uiPersist/setInfoAlerts'
    ),
  setWarnings: (key: 'lessPixels', val: boolean): void =>
    set(
      produce((state: IStore) => {
        state.uiPersist.warnings[key] = val
      }),
      false,
      'uiPersist/setWarnings'
    )
})

export default storeUIPersistActions
