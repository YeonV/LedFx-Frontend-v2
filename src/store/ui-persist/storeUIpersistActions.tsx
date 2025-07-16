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
      | 'pixelMode'
      | 'groupMode',
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
    ),
  setPixelGraphSettings: (
    key: 'smoothing' | 'variants' | 'round' | 'space' | 'stretch',
    val: any
  ): void =>
    set(
      produce((state: IStore) => {
        ;(state.uiPersist.pixelGraphSettings as any)[key] = val
      }),
      false,
      'uiPersist/setPixelGraphSettings'
    ),
  setExpander: (key: string, val: boolean): void =>
    set(
      produce((state: IStore) => {
        state.uiPersist.expander[key] = val
      }),
      false,
      'uiPersist/setExpander'
    )
})

export default storeUIPersistActions
