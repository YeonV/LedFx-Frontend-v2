declare global {
  interface Window {
    AndroidRemoteControl?: {
      setCustomNavigation: (enabled: boolean) => void
      exitApp: () => void
    }
  }
}

export {}
