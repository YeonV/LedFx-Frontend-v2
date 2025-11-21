export const exitAndroidApp = () => {
  if (window.AndroidRemoteControl) {
    window.AndroidRemoteControl.exitApp()
  } else {
    console.warn('AndroidRemoteControl not available (not running on Android)')
  }
}

export const setAndroidCustomNavigation = (enabled: boolean) => {
  window.AndroidRemoteControl?.setCustomNavigation(enabled)
}

export const isAndroidApp = () => !!window.AndroidRemoteControl
