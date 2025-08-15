import { produce } from 'immer'
import type { IStore } from '../useStore'
import { IMCell } from '../../pages/Devices/EditVirtuals/EditMatrix/M.utils'

const storeMatrix = (set: any) => ({
  isExternalEditorOpen: false,
  virtualEditorIsDirty: false,
  virtualEditorSnapshot: null as IMCell[][] | null,
  externalStudioRef: null as Window | null,
  setExternalEditorOpen: (isOpen: boolean) =>
    set(
      produce((state: IStore) => {
        state.isExternalEditorOpen = isOpen
      }),
      false,
      'setExternalEditorOpen'
    ),
  setVirtualEditorIsDirty: (isDirty: boolean) =>
    set(
      produce((state: IStore) => {
        state.virtualEditorIsDirty = isDirty
      }),
      false,
      'setVirtualEditorIsDirty'
    ),
  setVirtualEditorSnapshot: (snapshot: any) =>
    set(
      produce((state: IStore) => {
        state.virtualEditorSnapshot = snapshot
      }),
      false,
      'setVirtualEditorSnapshot'
    ),
  setExternalStudioRef: (win: Window | null) => set({ externalStudioRef: win })
})

export default storeMatrix
