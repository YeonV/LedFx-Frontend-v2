declare global {
  interface Window {
    AndroidRemoteControl?: {
      setCustomNavigation: (enabled: boolean) => void
      exitApp: () => void
      getCpuAbi?: () => string
      getAllSupportedAbis?: () => string
      downloadAndInstallApk: (url: string) => void
      getAppVersion: () => string
      /** False until the user allows "Install unknown apps" for LedFx (Android 8+). */
      canInstallPackages?: () => boolean
      /** Opens the per-app "Install unknown apps" settings screen. */
      requestInstallPermission?: () => void
      /** False until the user grants notification access, which Now Playing needs. */
      hasNotificationAccess?: () => boolean
      /** Opens the notification-access settings screen. */
      requestNotificationAccess?: () => void
      /** False on Android 9 and below, where AudioPlaybackCapture does not exist. */
      supportsPlaybackCapture?: () => boolean
      /** True once a capture consent has been approved and not revoked. */
      hasPlaybackCapture?: () => boolean
      /** Shows the system capture-consent dialog. Resolves asynchronously. */
      requestPlaybackCapture?: () => void
      /** Audio HAL buffer quantum in frames, 0 if unknown. */
      getAudioFramesPerBuffer?: () => number
      /** Audio HAL native output sample rate in Hz, 0 if unknown. */
      getAudioSampleRate?: () => number
    }
  }
}

export {}
