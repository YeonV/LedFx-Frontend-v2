import { produce } from 'immer'
import { VariantType } from 'notistack'
import pkg from '../../../package.json'
import type { IStore } from '../useStore'

const storeUI = (set: any) => ({
  currentTheme: '',
  setCurrentTheme: (theme: string): void =>
    set(
      produce((state: IStore) => {
        state.ui.currentTheme = theme
      }),
      false,
      'ui/currentTheme'
    ),
  effectDescriptions: 'Hide' as 'Auto' | 'Show' | 'Hide',
  setEffectDescriptions: (mode: 'Auto' | 'Show' | 'Hide'): void =>
    set(
      produce((state: IStore) => {
        state.ui.effectDescriptions = mode
      }),
      false,
      'ui/effectDescriptions'
    ),
  virtual2dLimit: 100,
  setVirtual2dLimit: (limit: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.virtual2dLimit = limit
      }),
      false,
      'ui/virtual2dLimit'
    ),
  fpsViewer: false,
  setFpsViewer: (fps: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.fpsViewer = fps
      }),
      false,
      'ui/fpsViewer'
    ),
  mgX: 50,
  setMgX: (x: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.mgX = x
      }),
      false,
      'ui/mgX'
    ),
  mgY: 200,
  setMgY: (y: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.mgY = y
      }),
      false,
      'ui/mgY'
    ),
  mg: false,
  setMg: (mg: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.mg = mg
      }),
      false,
      'ui/mg'
    ),
  pgsX: 50,
  setPgsX: (x: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.pgsX = x
      }),
      false,
      'ui/mgX'
    ),
  pgsY: 200,
  setPgsY: (y: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.pgsY = y
      }),
      false,
      'ui/mgY'
    ),
  pgs: false,
  setPgs: (mg: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.pgs = mg
      }),
      false,
      'ui/mg'
    ),
  mp: false,
  setMp: (mp: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.mp = mp
      }),
      false,
      'ui/mp'
    ),
  keybindingX: 50,
  setKeybindingX: (x: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.keybindingX = x
      }),
      false,
      'ui/keybindingX'
    ),
  keybindingY: 200,
  setKeybindingY: (y: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.keybindingY = y
      }),
      false,
      'ui/keybindingY'
    ),
  keybinding: false,
  setKeybinding: (keybinding: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.keybinding = keybinding
      }),
      false,
      'ui/keybinding'
    ),
  sdX: 50,
  setSdX: (x: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.sdX = x
      }),
      false,
      'ui/sdX'
    ),
  sdY: 200,
  setSdY: (y: number): void =>
    set(
      produce((state: IStore) => {
        state.ui.sdY = y
      }),
      false,
      'ui/sdY'
    ),
  sd: false,
  setSd: (sd: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.sd = sd
      }),
      false,
      'ui/sd'
    ),
  changeTheme: false,
  reloadTheme: (): void =>
    set(
      produce((state: IStore) => {
        state.ui.changeTheme = !state.ui.changeTheme
      }),
      false,
      'ui/changeTheme'
    ),
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
  // infoAlerts: {
  //   scenes: true,
  //   devices: true,
  //   user: true,
  //   gamepad: true,
  //   matrix: true,
  //   camera: true,
  //   matrixGroups: true,
  //   pixelMode: true
  // },
  // setInfoAlerts: (
  //   key: 'scenes' | 'devices' | 'user' | 'gamepad' | 'matrix' | 'camera' | 'matrixGroups' | 'pixelMode',
  //   val: boolean
  // ): void =>
  //   set(
  //     produce((state: IStore) => {
  //       state.ui.infoAlerts[key] = val
  //     }),
  //     false,
  //     'ui/setInfoAlerts'
  //   ),
  snackbar: {
    isOpen: false,
    messageType: 'error' as VariantType,
    message: 'NO MESSAGE'
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
      open: false
    },
    smartBar: {
      open: false
    },
    smartBarPad: {
      open: false
    },
    bottomBar: [] as any
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
          state.ui.bars.bottomBar = state.ui.bars.bottomBar.filter((p: any) => p !== page)
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
      'ui/setSmartBarOpen'
    ),
  setSmartBarPadOpen: (open: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.bars.smartBarPad.open = open
      }),
      false,
      'ui/setSmartBarOpen'
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
    )
})

export default storeUI
