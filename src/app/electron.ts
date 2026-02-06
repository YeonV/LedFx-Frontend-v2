import path from 'path'
import isDev from 'electron-is-dev'
import { app, nativeTheme, BrowserWindow, ipcMain, shell, session } from 'electron'
import Store from 'electron-store'
import { EventEmitter } from 'events'
import { fileURLToPath } from 'node:url'
import { execSync } from 'child_process'
import { handleProtocol, setupProtocol, setProtocolShuttingDown } from './app/protocol.mjs'
import { closeAllSubs } from './app/instances.mjs'
import { createTray } from './app/utils/tray.mjs'
import { handlers } from './app/handlers.mjs'
import isCC from './app/utils/isCC.mjs'
import createWindow from './app/utils/win.mjs'
import getReduxPath from './app/utils/getReduxPath.mjs'
import createLedfxFolder from './app/utils/createLedFxFolder.mjs'
import { executeCCStartup } from './app/utils/startupFlow.mjs'
import { disableAudio } from './app/utils/audioSetup.mjs'
import { autoStartSongDetector, setShuttingDown } from './app/utils/songDetector.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ANSI color codes for logging
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  brightCyan: '\x1b[96m'
}

const logStartup = (message: string) =>
  `${colors.brightCyan}[Startup]  ${colors.reset}${colors.dim}${message}${colors.reset}`

EventEmitter.defaultMaxListeners = 15

const subpy: any = null
const subprocesses: Record<string, any> = {}
const win: BrowserWindow | null = null
let wind: BrowserWindow | null = null

setupProtocol()
const gotTheLock = app.requestSingleInstanceLock()

createLedfxFolder()
const reduxDevtoolsPath = getReduxPath()

const ready = () =>
  app.whenReady().then(async () => {
    // Reset shutdown flags on app start
    setShuttingDown(false)
    setProtocolShuttingDown(false)

    // Kill any orphaned song-detector processes from previous session
    console.log(logStartup('Cleaning up any orphaned song detector processes...'))
    try {
      if (process.platform === 'win32') {
        try {
          execSync('taskkill /IM song-detector.exe /F /T', { stdio: 'ignore' })
          console.log(logStartup('Killed orphaned song-detector.exe'))
        } catch {}
        try {
          execSync('taskkill /IM song-detector-plus.exe /F /T', { stdio: 'ignore' })
          console.log(logStartup('Killed orphaned song-detector-plus.exe'))
        } catch {}
      } else {
        try {
          execSync('pkill -9 song-detector', { stdio: 'ignore' })
        } catch {}
        try {
          execSync('pkill -9 song-detector-plus', { stdio: 'ignore' })
        } catch {}
      }
    } catch {
      console.log(logStartup('No orphaned detectors found'))
    }

    // Load Redux DevTools in dev mode
    if (isDev && reduxDevtoolsPath) {
      await session.defaultSession.loadExtension(reduxDevtoolsPath)
    }
    // Use Electron Store to persist theme
    const store = new Store()
    nativeTheme.themeSource = store.get('mode') === 'light' ? 'light' : 'dark'
    const thePath = process.env.PORTABLE_EXECUTABLE_DIR || path.resolve('.')

    // Disable certificate validation for self-signed SSL certificates
    // This allows ledfx.local and localhost with self-signed certs to work
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      // Allow self-signed certificates for ledfx.local and localhost
      const isTrusted = url.includes('ledfx.local') || url.includes('localhost')
      if (isTrusted) {
        event.preventDefault()
      }
      callback(isTrusted)
    })

    // Execute CC-specific startup flow (splash, audio, server startup)
    if (isCC()) {
      await executeCCStartup(subprocesses)
    }

    // Create main window (after server is ready for CC builds)
    wind = isCC()
      ? createWindow(win, { additionalArguments: ['integratedCore'] })
      : createWindow(win)

    const remoteMain = await import('@electron/remote/main/index.js')

    if (wind) {
      remoteMain.enable(wind.webContents)

      // Auto-start song detector if it was running before
      setTimeout(() => {
        autoStartSongDetector(wind!, store, subprocesses)
      }, 2000) // Wait 2 seconds for app to be fully initialized

      wind.webContents.setWindowOpenHandler(({ url }) => {
        if (
          url.includes(' https://accounts.spotify.com/authorize')
          // || url.includes(`${backendUrl}/connect/github?callback`)
        ) {
          shell.openExternal(url)
          // return { action: 'deny' }
        }
        return { action: 'allow' }
      })

      createTray(isCC(), wind, thePath, __dirname)
    }

    ipcMain.on(
      'toMain',
      async (event, parameters) => wind && handlers(wind, subprocesses, event, parameters)
    )
    if (wind) {
      wind.on('close', async () => {
        // Disable audio device on close for macOS CC builds
        if (isCC() && process.platform === 'darwin') {
          await disableAudio()
        }

        if (wind) {
          closeAllSubs(wind, subpy, subprocesses)
          wind = null
        }
      })
    }
  })

handleProtocol(() => wind, gotTheLock, ready)

app.on('window-all-closed', () => {
  if (wind) closeAllSubs(wind, subpy, subprocesses)
  app.quit()
})

app.on('before-quit', () => {
  if (wind) {
    closeAllSubs(wind, subpy, subprocesses)
  }
})

// Last resort cleanup - kills ALL song-detector processes by name
app.on('will-quit', () => {
  console.log('[will-quit] Final cleanup, killing all song detectors by name...')
  try {
    if (process.platform === 'win32') {
      try {
        execSync('taskkill /IM song-detector.exe /F /T', { stdio: 'ignore' })
        console.log('[will-quit] Killed song-detector.exe')
      } catch {}
      try {
        execSync('taskkill /IM song-detector-plus.exe /F /T', { stdio: 'ignore' })
        console.log('[will-quit] Killed song-detector-plus.exe')
      } catch {}
    } else {
      try {
        execSync('pkill -9 song-detector', { stdio: 'ignore' })
      } catch {}
      try {
        execSync('pkill -9 song-detector-plus', { stdio: 'ignore' })
      } catch {}
    }
  } catch (e) {
    console.error('[will-quit] Failed to kill detectors:', e)
  }
})

app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
