import { create } from 'zustand'
import { FireTvBarState } from './FireTv.props'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useFireTvStore = create<FireTvBarState>((set, get) => ({
  buttons: { menu: true },
  defaultButtons: { menu: true },
  barHeight: 0,
  isCustomMode: false,

  setButtons: (config) =>
    set({
      buttons: config
    }),

  setDefaultButtons: (config) =>
    set({
      defaultButtons: config
    }),

  clearButtons: () =>
    set((state) => ({
      buttons: state.defaultButtons // Reset to defaults instead of just menu
    })),

  setBarHeight: (height) => set({ barHeight: height }),

  setCustomMode: (enabled) => set({ isCustomMode: enabled }),

  toggleCustomMode: () =>
    set((state) => {
      const newMode = !state.isCustomMode

      if (window.AndroidRemoteControl) {
        window.AndroidRemoteControl.setCustomNavigation(newMode)
        console.log(`Navigation mode: ${newMode ? 'CUSTOM (cursor)' : 'NATIVE (focus)'}`)
      }

      return { isCustomMode: newMode }
    })
}))
