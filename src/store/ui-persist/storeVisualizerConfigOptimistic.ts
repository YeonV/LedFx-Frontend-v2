import { produce } from 'immer'
import type { IStore } from '../useStore'

export interface VisualizerConfigOptimisticState {
  visualType: string
  isPlaying: Record<string, boolean>
  showOverlays: Record<string, boolean>
  autoChange: Record<string, boolean>
  fxEnabled: Record<string, boolean>
  showFxPanel: Record<string, boolean>
  configs: Record<string, any>
}

export const defaultVisualizerConfigOptimistic = (
  initialVisualType: string,
  initialConfig: any
): VisualizerConfigOptimisticState => ({
  visualType: initialVisualType,
  isPlaying: { [initialVisualType]: false },
  showOverlays: { [initialVisualType]: true },
  autoChange: { [initialVisualType]: false },
  fxEnabled: { [initialVisualType]: false },
  showFxPanel: { [initialVisualType]: false },
  configs: { [initialVisualType]: initialConfig }
})

const storeVisualizerConfigOptimistic = (set: any) => ({
  visualizerConfigOptimistic: undefined as VisualizerConfigOptimisticState | undefined,
  setVisualizerConfigOptimistic: (state: VisualizerConfigOptimisticState) =>
    set(
      produce((draft: IStore) => {
        draft.visualizerConfigOptimistic = state
      }),
      false,
      'visualizerConfigOptimistic/setAll'
    ),
  updateVisualizerConfigOptimistic: (partial: Partial<VisualizerConfigOptimisticState>) =>
    set(
      produce((draft: IStore) => {
        if (draft.visualizerConfigOptimistic) {
          Object.assign(draft.visualizerConfigOptimistic, partial)
        }
      }),
      false,
      'visualizerConfigOptimistic/updatePartial'
    ),
  resetVisualizerConfigOptimistic: (initial: VisualizerConfigOptimisticState) =>
    set(
      produce((draft: IStore) => {
        draft.visualizerConfigOptimistic = initial
      }),
      false,
      'visualizerConfigOptimistic/reset'
    )
})

export default storeVisualizerConfigOptimistic
