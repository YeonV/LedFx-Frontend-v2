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

export const getAndroidAbi = (): string => {
  if (window.AndroidRemoteControl?.getCpuAbi) {
    return window.AndroidRemoteControl.getCpuAbi()
  }

  // Fallback: try to detect from user agent
  const userAgent = navigator.userAgent.toLowerCase()
  if (
    userAgent.includes('arm64') ||
    userAgent.includes('aarch64') ||
    navigator.platform.includes('arm64') ||
    navigator.platform.includes('aarch64')
  ) {
    return 'arm64-v8a'
  }
  if (
    userAgent.includes('armv') ||
    userAgent.includes('armeabi') ||
    navigator.platform.includes('armv') ||
    navigator.platform.includes('armeabi')
  ) {
    return 'armeabi-v7a'
  }

  console.warn('Could not determine Android ABI')
  return 'unknown'
}

export const getAndroidAppVersion = (): string => {
  if (window.AndroidRemoteControl?.getAppVersion) {
    return window.AndroidRemoteControl.getAppVersion()
  }
  return 'unknown'
}

/**
 * Whether the app is allowed to install APKs.
 *
 * From Android 8 the REQUEST_INSTALL_PACKAGES manifest permission is not
 * enough - the user has to allow "Install unknown apps" for LedFx specifically.
 * Older APKs have no such bridge method, so assume true and let the native side
 * handle it rather than blocking the update.
 */
export const canInstallPackages = (): boolean => {
  if (!window.AndroidRemoteControl?.canInstallPackages) return true
  return window.AndroidRemoteControl.canInstallPackages()
}

/** Sends the user to the per-app "Install unknown apps" settings screen. */
export const requestInstallPermission = () => {
  window.AndroidRemoteControl?.requestInstallPermission?.()
}

export const downloadAndInstallApk = (url: string) => {
  if (window.AndroidRemoteControl?.downloadAndInstallApk) {
    console.log(`Requesting APK download: ${url}`)
    window.AndroidRemoteControl.downloadAndInstallApk(url)
  } else {
    console.error(
      'downloadAndInstallApk not available - not running on Android or method not implemented'
    )
    // Fallback: open URL in browser (user can manually download)
    window.open(url, '_blank')
  }
}
