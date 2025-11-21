declare global {
  interface Window {
    AndroidRemoteControl?: {
      setCustomNavigation: (enabled: boolean) => void
      exitApp: () => void
      getCpuAbi?: () => string
      getAllSupportedAbis?: () => string
      downloadAndInstallApk: (url: string) => void
      getAppVersion: () => string
    }
  }
}

export {}
