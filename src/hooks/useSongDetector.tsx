import { useEffect, useState } from 'react'

interface SongDetectorStatus {
  installed: boolean
  path: string
  platform: string
}

export const useSongDetector = () => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [status, setStatus] = useState<SongDetectorStatus | null>(null)

  useEffect(() => {
    // Check if song detector is available on mount
    if (window.api) {
      console.log('[SongDetector Hook] Checking for song detector binary...')
      window.api.send('toMain', { command: 'check-song-detector' })
    } else {
      console.log('[SongDetector Hook] window.api not available (not in Electron)')
    }

    // Listen for status updates
    const handleFromMain = (args: any) => {
      // Args is the array sent from main: ['event-name', data]
      if (!Array.isArray(args) || args.length < 1) return

      const [event, data] = args
      console.log('[SongDetector Hook] Received event:', event, 'data:', data)
      switch (event) {
        case 'song-detector-available':
          // Handle both old boolean format and new object format
          if (typeof data === 'boolean') {
            setIsAvailable(data)
          } else if (data && typeof data === 'object') {
            setIsAvailable(data.installed)
            setIsRunning(data.isRunning)
          }
          break
        case 'song-detector-status':
          setStatus(data)
          setIsAvailable(data.installed)
          break
        case 'song-detector-started':
        case 'song-detector-already-running':
          setIsRunning(true)
          break
        case 'song-detector-stopped':
          setIsRunning(false)
          break
        case 'song-detector-download-progress':
          setIsDownloading(true)
          setDownloadProgress(data.progress || 0)
          break
        case 'song-detector-download-complete':
          setIsDownloading(false)
          setDownloadProgress(0)
          setIsAvailable(true)
          console.log('Song detector downloaded to:', data.path)
          break
        case 'song-detector-download-error':
          setIsDownloading(false)
          setDownloadProgress(0)
          console.error('Song detector download error:', data)
          break
        case 'song-detector-deleted':
          setIsAvailable(false)
          setIsRunning(false)
          console.log('Song detector deleted:', data.path)
          break
        case 'song-detector-delete-error':
          console.error('Song detector delete error:', data)
          break
        case 'song-detector-error':
          console.error('Song detector error:', data)
          setIsRunning(false)
          break
      }
    }

    if (window.api) {
      window.api.receive('fromMain', handleFromMain)
    }

    // Note: No cleanup needed as ipcRenderer.on is handled by preload
  }, [])

  const startDetector = (deviceName: string = 'ledfxcc') => {
    if (window.api) {
      console.log('[SongDetector Hook] Starting detector with device:', deviceName)
      window.api.send('toMain', {
        command: 'start-song-detector',
        deviceName
      })
    }
  }

  const stopDetector = () => {
    if (window.api) {
      console.log('[SongDetector Hook] Stopping detector...')
      window.api.send('toMain', { command: 'stop-song-detector' })
    }
  }

  const getStatus = () => {
    if (window.api) {
      console.log('[SongDetector Hook] Requesting status...')
      window.api.send('toMain', { command: 'get-song-detector-status' })
    }
  }

  const downloadDetector = () => {
    if (window.api) {
      console.log('[SongDetector Hook] Downloading detector...')
      window.api.send('toMain', { command: 'download-song-detector' })
    }
  }

  const deleteDetector = () => {
    if (window.api) {
      console.log('[SongDetector Hook] Deleting detector...')
      window.api.send('toMain', { command: 'delete-song-detector' })
    }
  }

  return {
    isAvailable,
    isRunning,
    isDownloading,
    downloadProgress,
    status,
    startDetector,
    stopDetector,
    getStatus,
    downloadDetector,
    deleteDetector
  }
}

export default useSongDetector
