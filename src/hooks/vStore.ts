import type { IStore } from '../types/yz-audio-visualiser'

export type VState = IStore
export type { IStore } from '../types/yz-audio-visualiser'

let storeInstance: any = null
let isInitialized = false

const initializeStore = () => {
  if (isInitialized) return storeInstance

  const YzModule = (window as any).YzAudioVisualiser
  if (YzModule?.useStore) {
    storeInstance = YzModule.useStore
    isInitialized = true
  }

  return storeInstance
}

export function useVStore<T = IStore>(selector?: (state: IStore) => T): T {
  const store = initializeStore()
  if (!store) return undefined as unknown as T
  return selector ? store(selector) : store()
}
