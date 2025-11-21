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
  if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
    return 'arm64-v8a'
  }
  if (userAgent.includes('armv7') || userAgent.includes('armeabi')) {
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
