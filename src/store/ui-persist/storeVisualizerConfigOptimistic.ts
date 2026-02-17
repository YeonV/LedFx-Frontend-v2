import { produce } from 'immer'
import type { IStore } from '../useStore'

export interface VisualizerInstanceConfig {
  visualType: string
  isPlaying: boolean
  showOverlays: boolean
  autoChange: boolean
  fxEnabled: boolean
  showFxPanel: boolean
  configs: Record<string, any> // configs[visualType] = config
}

export type VisualizerConfigOptimisticState = Record<string, VisualizerInstanceConfig>

export const defaultVisualizerConfigOptimistic = (
  initialVisualType: string,
  initialName: string,
  initialConfig: any
): VisualizerConfigOptimisticState => ({
  [initialName]: {
    visualType: initialVisualType,
    isPlaying: false,
    showOverlays: true,
    autoChange: false,
    fxEnabled: false,
    showFxPanel: false,
    configs: { [initialVisualType]: initialConfig }
  }
})

// Rename an instance key in the optimistic state
const renameVisualizerInstance = (oldName: string, newName: string) => (set: any, get: any) => {
  set(
    produce((draft: IStore) => {
      if (!draft.visualizerConfigOptimistic) return
      if (draft.visualizerConfigOptimistic[oldName]) {
        draft.visualizerConfigOptimistic[newName] = {
          ...draft.visualizerConfigOptimistic[oldName]
        }
        delete draft.visualizerConfigOptimistic[oldName]
      }
    }),
    false,
    'visualizerConfigOptimistic/renameInstance'
  )
}

const storeVisualizerConfigOptimistic = (set: any) => ({
  visualizerConfigOptimistic: undefined as VisualizerConfigOptimisticState | undefined,
  setVisualizerConfigOptimistic: (state: VisualizerConfigOptimisticState) =>
    set(
      produce((draft: IStore) => {
        draft.visualizerConfigOptimistic = state
        // Clever logging: print full state after set
        if (typeof window !== 'undefined') {
          console.log(
            '[setVisualizerConfigOptimistic] New state:',
            JSON.parse(JSON.stringify(state))
          )
          if (state) {
            const keys = Object.keys(state)
            if (!keys.includes('SUB')) {
              console.warn('[setVisualizerConfigOptimistic] SUB key missing after set!', keys)
            }
          }
        }
      }),
      false,
      'visualizerConfigOptimistic/setAll'
    ),
  updateVisualizerConfigOptimistic: (name: string, partial: Partial<VisualizerInstanceConfig>) => {
    console.log('[updateVisualizerConfigOptimistic] Updating for', name, partial)
    return set(
      produce((draft: IStore) => {
        if (!draft.visualizerConfigOptimistic) return
        if (!draft.visualizerConfigOptimistic[name]) {
          // Auto-initialize with default values if missing
          draft.visualizerConfigOptimistic[name] = {
            visualType: partial.visualType || 'butterchurn',
            isPlaying: false,
            showOverlays: true,
            autoChange: false,
            fxEnabled: false,
            showFxPanel: false,
            configs: {}
          }
        }
        Object.assign(draft.visualizerConfigOptimistic[name], partial)
        // Clever logging: print full state after update
        if (typeof window !== 'undefined') {
          const state = draft.visualizerConfigOptimistic
          console.log(
            '[updateVisualizerConfigOptimistic] State after update:',
            JSON.parse(JSON.stringify(state))
          )
          const keys = Object.keys(state)
          if (!keys.includes('SUB')) {
            console.warn('[updateVisualizerConfigOptimistic] SUB key missing after update!', keys)
          }
        }
      }),
      false,
      'visualizerConfigOptimistic/updatePartial'
    )
  },
  // NOTE: To "bind the single-main to the global again" (i.e., have the main instance always reflect global state),
  // you would need to change the main card logic in VisualizerConfig.tsx to always use global state for the main instance,
  // and only use visualizerConfigOptimistic for subs. This would revert to the old pattern and lose per-instance optimistic updates for the main.
  // If you want this, update the main card's state selectors accordingly.
  resetVisualizerConfigOptimistic: (initial: VisualizerConfigOptimisticState) =>
    set(
      produce((draft: IStore) => {
        draft.visualizerConfigOptimistic = initial
      }),
      false,
      'visualizerConfigOptimistic/reset'
    ),
  renameVisualizerInstance: (oldName: string, newName: string) =>
    renameVisualizerInstance(oldName, newName)(set, null)
})

export default storeVisualizerConfigOptimistic
