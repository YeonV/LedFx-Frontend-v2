import fs from 'fs';
import path from 'path';
import isDev from 'electron-is-dev';
import { app, nativeTheme, BrowserWindow, ipcMain, shell, session } from 'electron';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'node:url';
import isCC from './app/utils/isCC.mjs';
import createWindow from './app/utils/win.mjs';
import { handleProtocol, setupProtocol } from './app/protocol.mjs';
import { closeAllSubs, startInstance } from './app/instances.mjs';
import { createTray } from './app/utils/tray.mjs'
import { handlers } from './app/handlers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

EventEmitter.defaultMaxListeners = 15;

const reduxDevtoolsPath = 'C:\\Users\\Blade\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\3.2.7_0';

const subpy: any = null;
const subprocesses: Record<string, any> = {};
let wind: BrowserWindow | null = null;
let win: BrowserWindow | null = null;

setupProtocol();
const gotTheLock = app.requestSingleInstanceLock();

if (!fs.existsSync(path.join(app.getPath('userData'), '.ledfx-cc'))) {
  console.log('Creating .ledfx-cc folder');
  fs.mkdirSync(path.join(app.getPath('userData'), '.ledfx-cc'));
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
    
    wind && remoteMain.enable(wind.webContents)

    wind && wind.webContents.setWindowOpenHandler(({ url }) => {
      if (url.includes(' https://accounts.spotify.com/authorize')
      // || url.includes(`${backendUrl}/connect/github?callback`)
      ) {
        shell.openExternal(url)
        // return { action: 'deny' }
      }
      return { action: 'allow' }
    })

    if (isCC && wind) startInstance(wind, 'instance1', subprocesses)      
   

      wind && createTray(isCC, wind, thePath, __dirname)

    ipcMain.on('toMain', async (event, parameters) =>
      wind && handlers(wind, subprocesses, event, parameters)
    )
    wind && wind.on('close', () => {
      wind && closeAllSubs(wind, subpy, subprocesses)
      wind = null;
    })
  })

handleProtocol(() => wind, gotTheLock, ready)

app.on('window-all-closed', () => {
  wind && closeAllSubs(wind, subpy, subprocesses)
  app.quit()
})

app.on('before-quit', () => wind && closeAllSubs(wind, subpy, subprocesses))

app.on(
  'activate',
  () => BrowserWindow.getAllWindows().length === 0 && createWindow()
)
