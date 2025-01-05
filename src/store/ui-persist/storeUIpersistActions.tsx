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
    ),
  setBlenderAutomagic: (val: boolean): void =>
    set(
      produce((state: IStore) => {
        state.uiPersist.blenderAutomagic = val
      }),
      false,
      'ui/blenderAutomagic'
    ),

  setShowHex: (show: boolean): void =>
    set(
      produce((state: IStore) => {
        state.uiPersist.showHex = show
      }),
      false,
      'ui/showHex'
    )
})

export default storeUIPersistActions
