import { useEffect, useState } from 'react'

interface SongDetectorStatus {
  installed: boolean
  path: string
  platform: string
}

interface DetectorState {
  isAvailable: boolean
  isRunning: boolean
  isDownloading: boolean
  downloadProgress: number
  status: SongDetectorStatus | null
  updateAvailable: boolean
}

export const useSongDetector = () => {
  // Separate state for standard and plus versions
  const [standard, setStandard] = useState<DetectorState>({
    isAvailable: false,
    isRunning: false,
    isDownloading: false,
    downloadProgress: 0,
    status: null,
    updateAvailable: false
  })

  const [plus, setPlus] = useState<DetectorState>({
    isAvailable: false,
    isRunning: false,
    isDownloading: false,
    downloadProgress: 0,
    status: null,
    updateAvailable: false
  })

  useEffect(() => {
    // Check if both song detectors are available on mount
    if (window.api) {
      window.api.send('toMain', { command: 'check-song-detector', plus: false })
      window.api.send('toMain', { command: 'check-song-detector', plus: true })
      // Also check for updates on mount
      window.api.send('toMain', { command: 'check-song-detector-update', plus: false })
      window.api.send('toMain', { command: 'check-song-detector-update', plus: true })
    }

    // Listen for status updates
    const handleFromMain = (args: any) => {
      if (!Array.isArray(args) || args.length < 1) return

      const [event, data] = args
      const isPlus = data?.plus || false

      const updateState = (setter: React.Dispatch<React.SetStateAction<DetectorState>>) => {
        switch (event) {
          case 'song-detector-available':
            if (typeof data === 'boolean') {
              setter((prev) => ({ ...prev, isAvailable: data }))
            } else if (data && typeof data === 'object') {
              setter((prev) => ({
                ...prev,
                isAvailable: data.installed,
                isRunning: data.isRunning
              }))
            }
            break
          case 'song-detector-status':
            setter((prev) => ({
              ...prev,
              status: data,
              isAvailable: data.installed
            }))
            break
          case 'song-detector-started':
          case 'song-detector-already-running':
            setter((prev) => ({ ...prev, isRunning: true }))
            break
          case 'song-detector-stopped':
            setter((prev) => ({ ...prev, isRunning: false }))
            break
          case 'song-detector-download-progress':
            setter((prev) => ({
              ...prev,
              isDownloading: true,
              downloadProgress: data.progress || 0
            }))
            break
          case 'song-detector-download-complete':
            setter((prev) => ({
              ...prev,
              isDownloading: false,
              downloadProgress: 0,
              isAvailable: true
            }))
            // Re-check for updates after download to verify the new version
            if (window.api) {
              window.api.send('toMain', { command: 'check-song-detector-update', plus: isPlus })
            }
            break
          case 'song-detector-download-error':
            setter((prev) => ({
              ...prev,
              isDownloading: false,
              downloadProgress: 0
            }))
            break
          case 'song-detector-deleted':
            setter((prev) => ({
              ...prev,
              isAvailable: false,
              isRunning: false
            }))
            break
          case 'song-detector-delete-error':
            break
          case 'song-detector-error':
            setter((prev) => ({ ...prev, isRunning: false }))
            break
          case 'song-detector-update-check':
            setter((prev) => ({
              ...prev,
              updateAvailable: data.updateAvailable || false
            }))
            break
        }
      }

      // Route to correct state based on plus flag
      if (isPlus) {
        updateState(setPlus)
      } else {
        updateState(setStandard)
      }
    }

    if (window.api) {
      window.api.receive('fromMain', handleFromMain)
    }

    // Note: No cleanup needed as ipcRenderer.on is handled by preload
  }, [])

  const startDetector = (deviceName: string = 'ledfxcc', withPosition: boolean = false) => {
    if (window.api) {
      window.api.send('toMain', {
        command: 'start-song-detector',
        deviceName,
        plus: withPosition
      })
    }
  }

  const stopDetector = (isPlus: boolean = false) => {
    if (window.api) {
      window.api.send('toMain', { command: 'stop-song-detector', plus: isPlus })
    }
  }

  const getStatus = (isPlus: boolean = false) => {
    if (window.api) {
      window.api.send('toMain', { command: 'get-song-detector-status', plus: isPlus })
    }
  }

  const downloadDetector = (isPlus: boolean = false) => {
    if (window.api) {
      window.api.send('toMain', { command: 'download-song-detector', plus: isPlus })
    }
  }

  const deleteDetector = (isPlus: boolean = false) => {
    if (window.api) {
      window.api.send('toMain', { command: 'delete-song-detector', plus: isPlus })
    }
  }

  const checkForUpdate = (isPlus: boolean = false) => {
    if (window.api) {
      window.api.send('toMain', { command: 'check-song-detector-update', plus: isPlus })
    }
  }

  return {
    standard,
    plus,
    startDetector,
    stopDetector,
    getStatus,
    downloadDetector,
    deleteDetector,
    checkForUpdate
  }
}

export default useSongDetector
