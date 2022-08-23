/* eslint-disable no-param-reassign */
import produce from 'immer';
import { VariantType } from 'notistack';

const storeUI = (set: any) => ({
  darkMode: true,
  setDarkMode: (dark: boolean): void =>
    set(
      produce((state: any) => {
        state.ui.darkMode = dark;
      }),
      false,
      'ui/darkmode'
    ),

  snackbar: {
    isOpen: false,
    messageType: 'error' as VariantType,
    message: 'NO MESSAGE',
  },
  showSnackbar: (messageType: string, message: string): void =>
    set(
      produce((state: any) => {
        state.ui.snackbar = { isOpen: true, message, messageType };
      }),
      false,
      'ui/showSnackbar'
    ),
  clearSnackbar: (): void =>
    set(
      produce((state: any) => {
        state.ui.snackbar.isOpen = false;
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
      produce((state: any) => {
        state.ui.bars.leftBar.open = open;
      }),
      false,
      'ui/setLeftBarOpen'
    ),
  setBottomBarOpen: (page: string): void =>
    set(
      produce((state: any) => {
        if (state.ui.bars.bottomBar.indexOf(page) === -1) {
          state.ui.bars.bottomBar = [...state.ui.bars.bottomBar, page];
        } else {
          state.ui.bars.bottomBar = state.ui.bars.bottomBar.filter(
            (p: any) => p !== page
          );
        }
      }),
      false,
      'ui/setBottomBarOpen'
    ),
  setSmartBarOpen: (open: boolean): void =>
    set(
      produce((state: any) => {
        state.ui.bars.smartBar.open = open;
      }),
      false,
      'ui/setLeftBarOpen'
    ),

  settingsExpanded: 'false',
  setSettingsExpanded: (setting: any): void =>
    set(
      produce((state: any) => {
        state.ui.settingsExpanded = setting;
      }),
      false,
      'ui/settingsExpanded'
    ),
});

export default storeUI;
