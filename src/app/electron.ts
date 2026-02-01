import path from 'path'
import isDev from 'electron-is-dev'
import { app, nativeTheme, BrowserWindow, ipcMain, shell, session } from 'electron'
import Store from 'electron-store'
import { EventEmitter } from 'events'
import { fileURLToPath } from 'node:url'
import { handleProtocol, setupProtocol } from './app/protocol.mjs'
import { closeAllSubs } from './app/instances.mjs'
import { createTray } from './app/utils/tray.mjs'
import { handlers } from './app/handlers.mjs'
import isCC from './app/utils/isCC.mjs'
import createWindow from './app/utils/win.mjs'
import getReduxPath from './app/utils/getReduxPath.mjs'
import createLedfxFolder from './app/utils/createLedFxFolder.mjs'
import { executeCCStartup } from './app/utils/startupFlow.mjs'
import { disableAudio } from './app/utils/audioSetup.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

app.on('before-quit', () => wind && closeAllSubs(wind, subpy, subprocesses))

app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
