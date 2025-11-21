import { create } from 'zustand'
import { FireTvBarState } from './FireTv.props'
import { setAndroidCustomNavigation } from './android.bridge'

export const useFireTvStore = create<FireTvBarState>((set) => ({
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
      buttons: state.defaultButtons
    })),

  setBarHeight: (height) => set({ barHeight: height }),

  setCustomMode: (enabled) => set({ isCustomMode: enabled }),

  toggleCustomMode: () =>
    set((state) => {
      const newMode = !state.isCustomMode

      setAndroidCustomNavigation(newMode)
      console.log(`Navigation mode: ${newMode ? 'CUSTOM (cursor)' : 'NATIVE (focus)'}`)

      return { isCustomMode: newMode }
    })
}))
