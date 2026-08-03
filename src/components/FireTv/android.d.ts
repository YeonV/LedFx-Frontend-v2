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
    }
  }
}

export {}
