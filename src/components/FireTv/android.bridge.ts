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

/**
 * Whether LedFx may read the phone's media session.
 *
 * Now Playing on Android goes through MediaSessionManager, which Android only
 * opens up to an app the user has granted notification access. Older APKs have
 * no such bridge method; report false there so the UI offers the step rather
 * than promising a feature that cannot work.
 */
export const hasNotificationAccess = (): boolean => {
  if (!window.AndroidRemoteControl?.hasNotificationAccess) return false
  return window.AndroidRemoteControl.hasNotificationAccess()
}

/** Sends the user to the notification-access settings screen. */
export const requestNotificationAccess = () => {
  window.AndroidRemoteControl?.requestNotificationAccess?.()
}

/**
 * Whether this build can capture the audio other apps are playing.
 *
 * AudioPlaybackCapture arrived in Android 10, and older APKs have no bridge
 * method at all - report false in both cases so the UI hides the option rather
 * than offering an input that can never open.
 */
export const supportsPlaybackCapture = (): boolean => {
  if (!window.AndroidRemoteControl?.supportsPlaybackCapture) return false
  return window.AndroidRemoteControl.supportsPlaybackCapture()
}

/**
 * True once the user has approved a capture.
 *
 * Consent is a MediaProjection, which only an Activity can obtain; the approval
 * is handed to the service process where the audio actually runs. Selecting the
 * Playback Capture input before this returns true opens nothing.
 */
export const hasPlaybackCapture = (): boolean => {
  if (!window.AndroidRemoteControl?.hasPlaybackCapture) return false
  return window.AndroidRemoteControl.hasPlaybackCapture()
}

/**
 * Shows the system capture-consent dialog.
 *
 * Returns immediately - the answer arrives asynchronously, so poll
 * hasPlaybackCapture() rather than treating this as a promise.
 */
export const requestPlaybackCapture = () => {
  window.AndroidRemoteControl?.requestPlaybackCapture?.()
}

/**
 * The frame rate LedFx should use so its audio blocks land on the HAL quantum.
 *
 * LedFx derives its block size from samplerate / sample_rate, and only blocks
 * that are a whole multiple of the HAL quantum can take the fast capture path.
 * A Pixel 8 reports 48000 Hz / 480 frames, so 100 divides exactly - blocks of
 * 480 frames, 10ms each, aligned. Returns null when the device cannot tell us,
 * or when the answer is not a sane frame rate to run at.
 */
export const alignedFrameRate = (): number | null => {
  const quantum = window.AndroidRemoteControl?.getAudioFramesPerBuffer?.() ?? 0
  const rate = window.AndroidRemoteControl?.getAudioSampleRate?.() ?? 0
  if (!quantum || !rate) return null
  const fps = Math.round(rate / quantum)
  // Below ~30 the visuals stutter; above ~120 the Python callback overhead
  // costs more than the latency it saves.
  if (fps < 30 || fps > 120) return null
  return fps
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
