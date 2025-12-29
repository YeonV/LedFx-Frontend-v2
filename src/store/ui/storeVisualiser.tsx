import { produce } from 'immer'
import type { IStore } from '../useStore'

export interface VisualiserState {
  type: string
  config: Record<string, any>
  audioSource: 'backend' | 'mic'
}

export interface VisualiserSceneSettings {
  type: string
  config: Record<string, any>
  audioSource?: 'backend' | 'mic'
}

const storeVisualiser = (set: any) => ({
  visualiser: {
    type: 'gif',
    config: {
      rotate: 0,
      gif_fps: 30,
      brightness: 1.0,
      bounce: false,
      developer_mode: false,
      image_location: ''
    },
    audioSource: 'backend' as 'backend' | 'mic'
  } as VisualiserState,

  setVisualiserType: (type: string): void =>
    set(
      produce((state: IStore) => {
        state.visualiser.type = type
      }),
      false,
      'visualiser/setType'
    ),

  setVisualiserConfig: (config: Record<string, any>): void =>
    set(
      produce((state: IStore) => {
        state.visualiser.config = { ...state.visualiser.config, ...config }
      }),
      false,
      'visualiser/setConfig'
    ),

  setVisualiserAudioSource: (audioSource: 'backend' | 'mic'): void =>
    set(
      produce((state: IStore) => {
        state.visualiser.audioSource = audioSource
      }),
      false,
      'visualiser/setAudioSource'
    ),

  setVisualiserState: (visualiserState: VisualiserState): void =>
    set(
      produce((state: IStore) => {
        state.visualiser = visualiserState
      }),
      false,
      'visualiser/setState'
    ),

  getVisualiserState: (): VisualiserState => {
    // This is accessed via useStore.getState().visualiser
    // The function is just for convenience/documentation
    return {
      type: 'gif',
      config: {},
      audioSource: 'backend'
    }
  }
})

export default storeVisualiser
