import { create } from 'zustand'
import { FireTvBarState } from './FireTv.props'
import { setAndroidCustomNavigation } from './android.bridge'

export const useFireTvStore = create<FireTvBarState>((set) => ({
  buttons: { menu: true },
  defaultButtons: { menu: true },
  barHeight: 0,
  isCustomMode: false,
  hasPageButtons: false, // ✅ Track if a page has set custom buttons

  setButtons: (config) =>
    set({
      buttons: config,
      hasPageButtons: true // ✅ Mark that a page is managing buttons
    }),

  setDefaultButtons: (config) =>
    set((state) => ({
      defaultButtons: config,
      // ✅ Only update active buttons if no page is managing them
      buttons: state.hasPageButtons ? state.buttons : config
    })),

  clearButtons: () =>
    set((state) => ({
      buttons: state.defaultButtons,
      hasPageButtons: false // ✅ Clear the flag
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
