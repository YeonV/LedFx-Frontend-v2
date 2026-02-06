/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow } from 'electron'
import { spawn, execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { Subprocess } from '../instances.mjs'

// ANSI color codes for logging
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  brightYellow: '\x1b[93m'
}

const logSD = (message: string) =>
  `${colors.brightYellow}[Detector] ${colors.reset}${colors.dim}${message}${colors.reset}`

// Shutdown flag to prevent restarts during app exit
let isShuttingDown = false

export const setShuttingDown = (value: boolean) => {
  isShuttingDown = value
  console.log(logSD(`Shutdown flag set to: ${value}`))
}

export const getShuttingDown = (): boolean => {
  return isShuttingDown
}

/**
 * Get the path to song-detector executable in extraResources
 */
export const getSongDetectorPath = (plus: boolean = false): string => {
  const isDev = !app.isPackaged
  const platform = process.platform

  let binaryName: string
  const baseName = plus ? 'song-detector-plus' : 'song-detector'

  if (platform === 'win32') {
    binaryName = `${baseName}.exe`
  } else if (platform === 'darwin') {
    binaryName = `${baseName}-macos`
  } else {
    binaryName = `${baseName}-linux`
  }

  if (isDev) {
    return path.join(process.cwd(), 'extraResources', binaryName)
  }

  // On macOS, store outside the .app bundle in userData
  if (platform === 'darwin') {
    return path.join(app.getPath('userData'), 'extraResources', binaryName)
  }

  return path.join(process.resourcesPath, 'extraResources', binaryName)
}

/**
 * Check if song-detector binary exists
 */
export const isSongDetectorInstalled = async (plus: boolean = false): Promise<boolean> => {
  const detectorPath = getSongDetectorPath(plus)
  return fs.promises
    .access(detectorPath, fs.constants.X_OK)
    .then(() => true)
    .catch(() => false)
}

/**
 * Get song-detector status information
 */
export const getSongDetectorStatus = async (
  plus: boolean = false
): Promise<{
  installed: boolean
  path: string
  platform: string
}> => {
  const installed = await isSongDetectorInstalled(plus)
  const detectorPath = getSongDetectorPath(plus)

  return {
    installed,
    path: detectorPath,
    platform: process.platform
  }
}

/**
 * Start the song detector subprocess
 */
export const startSongDetector = (
  wind: BrowserWindow,
  deviceName: string = 'ledfxcc',
  plus: boolean = false
): Subprocess | null => {
  // Don't start if shutting down
  if (isShuttingDown) {
    console.log(logSD('Skipping start, app is shutting down'))
    return null
  }

  const detectorPath = getSongDetectorPath(plus)

  // Check if file exists
  if (!fs.existsSync(detectorPath)) {
    console.error('Song detector not found at:', detectorPath)
    const errorMsg = plus ? 'Song detector Plus binary not found' : 'Song detector binary not found'
    wind.webContents.send('fromMain', ['song-detector-error', { message: errorMsg, plus }])
    return null
  }

  console.log('Starting song detector:', detectorPath, 'with device:', deviceName)

  const songDetectorProcess = spawn(detectorPath, ['--device_name', deviceName], {
    stdio: ['ignore', 'pipe', 'pipe']
  })

  const subprocess = songDetectorProcess as unknown as Subprocess
  subprocess.running = true

  songDetectorProcess.stdout?.on('data', (data) => {
    console.log(logSD(data))
  })

  songDetectorProcess.stderr?.on('data', (data) => {
    console.error(`[Song Detector Error] ${data}`)
  })

  songDetectorProcess.on('exit', (code, signal) => {
    console.log(`Song detector exited with code ${code} and signal ${signal}`)
    if (!wind.isDestroyed()) {
      wind.webContents.send('fromMain', ['song-detector-stopped', { code, signal, plus }])
    }
  })

  songDetectorProcess.on('error', (err) => {
    console.error('Failed to start song detector:', err)
    if (!wind.isDestroyed()) {
      wind.webContents.send('fromMain', ['song-detector-error', { message: err.message, plus }])
    }
  })

  if (!wind.isDestroyed()) {
    wind.webContents.send('fromMain', ['song-detector-started', { deviceName, plus }])
  }

  return subprocess
}

/**
 * Stop the song detector subprocess
 */
export const stopSongDetector = (
  subprocess: Subprocess | null,
  wind: BrowserWindow,
  plus: boolean = false
): boolean => {
  if (!subprocess) {
    return false
  }

  try {
    // On Windows, SIGINT doesn't work reliably with PyInstaller executables
    // Use SIGTERM or force kill
    if (process.platform === 'win32') {
      // Windows: spawn taskkill to force terminate the process tree
      spawn('taskkill', ['/pid', subprocess.pid!.toString(), '/T', '/F'], {
        stdio: 'ignore'
      })
    } else {
      // Unix: SIGTERM is more reliable than SIGINT
      subprocess.kill('SIGTERM')
    }

    subprocess.running = false
    if (!wind.isDestroyed()) {
      wind.webContents.send('fromMain', ['song-detector-stopped', { manual: true, plus }])
    }
    return true
  } catch (error) {
    console.error('Failed to stop song detector:', error)
    return false
  }
}

/**
 * Auto-start song detector if it was running before
 */
export const autoStartSongDetector = async (
  wind: BrowserWindow,
  store: any,
  subprocesses: any
): Promise<void> => {
  // Don't auto-start if shutting down
  if (isShuttingDown) {
    console.log(logSD('Skipping auto-start, app is shutting down'))
    return
  }

  const wasRunning = store.get('song-detector-running', false)
  const wasRunningPlus = store.get('song-detector-plus-running', false)
  const deviceName = store.get('song-detector-device-name', 'ledfxcc')

  // Auto-start standard version
  if (wasRunning) {
    const installed = await isSongDetectorInstalled(false)
    if (installed) {
      console.log(logSD(`Auto-starting standard detector with device: ${deviceName}`))
      const songDetectorProcess = startSongDetector(wind, deviceName, false)
      if (songDetectorProcess) {
        subprocesses.songDetector = songDetectorProcess
        console.log(logSD('Auto-start successful'))
      } else {
        console.log(logSD('Auto-start failed'))
        store.set('song-detector-running', false)
      }
    } else {
      console.log(logSD('Binary not found, cannot auto-start'))
      store.set('song-detector-running', false)
    }
  }

  // Auto-start plus version
  if (wasRunningPlus) {
    const installed = await isSongDetectorInstalled(true)
    if (installed) {
      console.log(logSD(`Auto-starting Plus detector with device: ${deviceName}`))
      const songDetectorProcess = startSongDetector(wind, deviceName, true)
      if (songDetectorProcess) {
        subprocesses.songDetectorPlus = songDetectorProcess
        console.log(logSD('Auto-start successful (Plus)'))
      } else {
        console.log(logSD('Auto-start failed (Plus)'))
        store.set('song-detector-plus-running', false)
      }
    } else {
      console.log(logSD('Binary not found, cannot auto-start (Plus)'))
      store.set('song-detector-plus-running', false)
    }
  }
}

/**
 * Delete the song-detector binary
 */
export const deleteSongDetector = async (
  wind: BrowserWindow,
  plus: boolean = false
): Promise<boolean> => {
  const detectorPath = getSongDetectorPath(plus)

  try {
    if (fs.existsSync(detectorPath)) {
      fs.unlinkSync(detectorPath)
      console.log('Song detector deleted:', detectorPath)
      wind.webContents.send('fromMain', ['song-detector-deleted', { path: detectorPath, plus }])
      return true
    } else {
      console.log('Song detector not found, nothing to delete')
      return false
    }
  } catch (error) {
    console.error('Failed to delete song detector:', error)
    wind.webContents.send('fromMain', [
      'song-detector-delete-error',
      { message: (error as Error).message, plus }
    ])
    return false
  }
}

/**
 * Download song-detector binary from GitHub releases
 */
export const downloadSongDetector = async (
  wind: BrowserWindow,
  plus: boolean = false
): Promise<boolean> => {
  const platform = process.platform
  let binaryName: string
  const baseName = plus ? 'song-detector-plus' : 'song-detector'

  if (platform === 'win32') {
    binaryName = `${baseName}.exe`
  } else if (platform === 'darwin') {
    binaryName = `${baseName}-macos`
  } else {
    binaryName = `${baseName}-linux`
  }

  const downloadUrl = `https://github.com/YeonV/LedFx-Builds/releases/latest/download/${binaryName}`
  const detectorPath = getSongDetectorPath(plus)
  const detectorDir = path.dirname(detectorPath)

  console.log('Downloading song detector from:', downloadUrl)
  console.log('Saving to:', detectorPath)

  // Ensure extraResources directory exists
  if (!fs.existsSync(detectorDir)) {
    fs.mkdirSync(detectorDir, { recursive: true })
  }

  return new Promise((resolve, reject) => {
    const downloadFromUrl = (url: string) => {
      const file = fs.createWriteStream(detectorPath)

      https
        .get(url, (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            // Follow redirect
            file.close()
            if (fs.existsSync(detectorPath)) {
              fs.unlinkSync(detectorPath)
            }
            const redirectUrl = response.headers.location
            if (redirectUrl) {
              console.log('Following redirect to:', redirectUrl)
              downloadFromUrl(redirectUrl)
            } else {
              reject(new Error('Redirect without location header'))
            }
            return
          }

          if (response.statusCode !== 200) {
            file.close()
            fs.unlink(detectorPath, () => {})
            const error = `Download failed with status: ${response.statusCode}`
            console.error(error)
            wind.webContents.send('fromMain', [
              'song-detector-download-error',
              { message: error, plus }
            ])
            reject(new Error(error))
            return
          }

          const totalSize = parseInt(response.headers['content-length'] || '0', 10)
          let downloadedSize = 0
          console.log(`Downloading ${totalSize} bytes...`)

          response.on('data', (chunk) => {
            downloadedSize += chunk.length
            const progress = totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0
            wind.webContents.send('fromMain', [
              'song-detector-download-progress',
              { progress, plus }
            ])
          })

          response.pipe(file)

          file.on('finish', () => {
            file.close(() => {
              const stats = fs.statSync(detectorPath)
              console.log(`Song detector downloaded successfully: ${stats.size} bytes`)

              // Make executable on Unix
              if (platform !== 'win32') {
                fs.chmodSync(detectorPath, 0o755)
              }

              // Remove quarantine attribute on macOS to avoid Gatekeeper issues
              if (platform === 'darwin') {
                try {
                  execSync(`xattr -d com.apple.quarantine "${detectorPath}"`, { stdio: 'ignore' })
                  console.log('Removed quarantine attribute from song detector')
                } catch (err) {
                  console.log('Could not remove quarantine attribute (may not exist):', err)
                }
              }

              wind.webContents.send('fromMain', [
                'song-detector-download-complete',
                { path: detectorPath, plus }
              ])
              resolve(true)
            })
          })

          file.on('error', (err) => {
            console.error('File write error:', err)
            fs.unlink(detectorPath, () => {})
            wind.webContents.send('fromMain', [
              'song-detector-download-error',
              { message: err.message, plus }
            ])
            reject(err)
          })
        })
        .on('error', (err) => {
          console.error('Download error:', err)
          fs.unlink(detectorPath, () => {})
          wind.webContents.send('fromMain', [
            'song-detector-download-error',
            { message: err.message, plus }
          ])
          reject(err)
        })
    }

    downloadFromUrl(downloadUrl)
  })
}
