import path from 'path'
import isDev from 'electron-is-dev'
import {
  app,
  nativeTheme,
  BrowserWindow,
  ipcMain,
  shell,
  session
} from 'electron'
import { EventEmitter } from 'events'
import { fileURLToPath } from 'node:url'
import isCC from './app/utils/isCC.mjs'
import createWindow from './app/utils/win.mjs'
import { handleProtocol, setupProtocol } from './app/protocol.mjs'
import { closeAllSubs, startInstance } from './app/instances.mjs'
import { createTray } from './app/utils/tray.mjs'
import { handlers } from './app/handlers.mjs'
import getReduxPath from './app/utils/getReduxPath.mjs'
import createLedfxFolder from './app/utils/createLedFxFolder.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

EventEmitter.defaultMaxListeners = 15

const subpy: any = null
const subprocesses: Record<string, any> = {}
let wind: BrowserWindow | null = null
const win: BrowserWindow | null = null

setupProtocol()
const gotTheLock = app.requestSingleInstanceLock()

const reduxDevtoolsPath = getReduxPath()
createLedfxFolder()

const ready = () =>
  app.whenReady().then(async () => {
    if (isDev && reduxDevtoolsPath) {
      await session.defaultSession.loadExtension(reduxDevtoolsPath)
    }
    nativeTheme.themeSource = 'dark'
    const thePath = process.env.PORTABLE_EXECUTABLE_DIR || path.resolve('.')
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
      if (isCC()) startInstance(wind, 'instance1', subprocesses)
      createTray(isCC(), wind, thePath, __dirname)
    }

    ipcMain.on(
      'toMain',
      async (event, parameters) =>
        wind && handlers(wind, subprocesses, event, parameters)
    )
    if (wind) {
      wind.on('close', () => {
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

app.on(
  'activate',
  () => BrowserWindow.getAllWindows().length === 0 && createWindow()
)
