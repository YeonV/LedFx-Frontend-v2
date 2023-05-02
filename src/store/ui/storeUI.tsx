/* eslint-disable no-param-reassign */
import produce from 'immer'
import { VariantType } from 'notistack'
import pkg from '../../../package.json'
import type { IStore } from '../useStore'

const storeUI = (set: any) => ({
  latestTag: pkg.version as string,
  setLatestTag: (tag: string): void =>
    set(
      produce((state: IStore) => {
        state.ui.latestTag = tag
      }),
      false,
      'setLatestTag'
    ),

  darkMode: true,
  setDarkMode: (dark: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.darkMode = dark
      }),
      false,
      'ui/darkmode'
    ),

  snackbar: {
    isOpen: false,
    messageType: 'error' as VariantType,
    message: 'NO MESSAGE',
  },
  showSnackbar: (messageType: VariantType, message: string): void =>
    set(
      produce((state: IStore) => {
        state.ui.snackbar = { isOpen: true, message, messageType }
      }),
      false,
      'ui/showSnackbar'
    ),
  clearSnackbar: (): void =>
    set(
      produce((state: IStore) => {
        state.ui.snackbar.isOpen = false
      }),
      false,
      'ui/clearSnackbar'
    ),
  bars: {
    leftBar: {
      open: false,
    },
    smartBar: {
      open: false,
    },
    bottomBar: [] as any,
  },
  setLeftBarOpen: (open: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.bars.leftBar.open = open
      }),
      false,
      'ui/setLeftBarOpen'
    ),
  setBottomBarOpen: (page: string): void =>
    set(
      produce((state: IStore) => {
        if (state.ui.bars.bottomBar.indexOf(page) === -1) {
          state.ui.bars.bottomBar = [...state.ui.bars.bottomBar, page]
        } else {
          state.ui.bars.bottomBar = state.ui.bars.bottomBar.filter(
            (p: any) => p !== page
          )
        }
      }),
      false,
      'ui/setBottomBarOpen'
    ),
  setSmartBarOpen: (open: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.bars.smartBar.open = open
      }),
      false,
      'ui/setLeftBarOpen'
    ),

  settingsExpanded: 'false',
  setSettingsExpanded: (setting: any): void =>
    set(
      produce((state: IStore) => {
        state.ui.settingsExpanded = setting
      }),
      false,
      'ui/settingsExpanded'
    ),
  sceneActiveTags: [] as string[],
  toggletSceneActiveTag: (tag: string): void =>
    set(
      produce((state: IStore) => {
        state.ui.sceneActiveTags = state.ui.sceneActiveTags.includes(tag)
          ? state.ui.sceneActiveTags.filter((t: string) => t !== tag)
          : [...state.ui.sceneActiveTags, tag]
      }),
      false,
      'ui/settingsExpanded'
    ),
})

export default storeUI
