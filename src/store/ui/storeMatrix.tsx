import { produce } from 'immer'
import type { IStore } from '../useStore'

const storeMatrix = (set: any) => ({
  isExternalEditorOpen: false,
  virtualEditorIsDirty: false,
  externalStudioRef: null as Window | null,
  // Per-virtual grid of cell group ids, parallel to the matrix itself.
  // A segment is a 4-tuple with nowhere to carry a group, so this is the only
  // place group assignments (from the editor or from Matrix Studio) survive a
  // reload until the backend can store them alongside the segments.
  matrixGroups: {} as Record<string, string[][]>,
  setMatrixGroups: (virtualId: string, groups: string[][]) =>
    set(
      produce((state: IStore) => {
        state.matrixGroups[virtualId] = groups
      }),
      false,
      'setMatrixGroups'
    ),
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
  setExternalStudioRef: (win: Window | null) => set({ externalStudioRef: win })
})

export default storeMatrix
