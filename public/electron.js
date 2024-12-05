/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import path from 'path'
import isCC from './app/utils/isCC.mjs'
import isDev from 'electron-is-dev'
import createWindow from './app/utils/win.mjs'
import { app, nativeTheme, BrowserWindow, ipcMain, shell, session } from 'electron'
import { createTray } from './app/utils/tray.mjs'
import { startInstance, closeAllSubs } from './app/instances.js'
import { handlers } from './app/handlers.js'
import { setupProtocol, handleProtocol } from './app/protocol.js'
import { EventEmitter } from 'events'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

EventEmitter.defaultMaxListeners = 15

const reduxDevtoolsPath = 'C:\\Users\\49152\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\3.2.7_0'

const subpy = null
const subprocesses = {}
let wind
let win

setupProtocol()
const gotTheLock = app.requestSingleInstanceLock()

if (!fs.existsSync(path.join(app.getPath('userData'), '.ledfx-cc'))) {
  console.log('Creating .ledfx-cc folder')
  fs.mkdirSync(path.join(app.getPath('userData'), '.ledfx-cc'))
}

const ready = () =>
  app.whenReady().then(async () => {
    if (isDev) {
      await session.defaultSession.loadExtension(reduxDevtoolsPath)
    }
    nativeTheme.themeSource = 'dark'
    const thePath = process.env.PORTABLE_EXECUTABLE_DIR || path.resolve('.')

    wind = isCC
      ? createWindow(win, { additionalArguments: ['integratedCore'] })
      : createWindow(win)

    const remoteMain = await import('@electron/remote/main/index.js')
    remoteMain.enable(wind.webContents)

    wind.webContents.setWindowOpenHandler(({ url }) => {
      if (url.includes(' https://accounts.spotify.com/authorize')
      // || url.includes(`${backendUrl}/connect/github?callback`)
      ) {
        shell.openExternal(url)
        // return { action: 'deny' }
      }
      return { action: 'allow' }
    })

    if (isCC) startInstance(wind, 'instance1', subprocesses)      
   

    createTray(isCC, wind, thePath, __dirname)

    ipcMain.on('toMain', async (event, parameters) =>
      handlers(wind, subprocesses, event, parameters)
    )
    wind.on('close', () => {
      closeAllSubs(wind, subpy, subprocesses)
      wind = null;
    })
  })

handleProtocol(() => wind, gotTheLock, ready)

app.on('window-all-closed', () => {
  closeAllSubs(wind, subpy, subprocesses)
  app.quit()
})

app.on('before-quit', () => closeAllSubs(wind, subpy, subprocesses))

app.on(
  'activate',
  () => BrowserWindow.getAllWindows().length === 0 && createWindow()
)
