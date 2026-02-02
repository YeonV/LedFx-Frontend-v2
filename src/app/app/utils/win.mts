import { BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'
import { initialize } from '@electron/remote/main/index.js'
import { fileURLToPath } from 'node:url'
import store from './store.mjs'
import Store from 'electron-store'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createWindow(win?: any, args: any = {}) {
  initialize()
  const electronStore = new Store()
  // Restore window position and size if available
  const defaultBounds = { width: 1024, height: 1024 }
  const windowBounds = electronStore.get('windowBounds', defaultBounds) as {
    width: number
    height: number
    x?: number
    y?: number
  }
  win = new BrowserWindow({
    width: windowBounds.width || defaultBounds.width,
    height: windowBounds.height || defaultBounds.height,
    x: typeof windowBounds.x === 'number' ? windowBounds.x : undefined,
    y: typeof windowBounds.y === 'number' ? windowBounds.y : undefined,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    // titleBarStyle: process.platform === 'darwin' ? 'default' : 'hidden',
    titleBarOverlay:
      process.platform === 'darwin'
        ? false
        : {
            color: nativeTheme.themeSource === 'dark' ? '#333' : '#f0f0f0',
            symbolColor: nativeTheme.themeSource === 'dark' ? '#ffffff' : '#000000',
            height: 32
          },
    frame: process.platform === 'darwin',
    show: args.show !== undefined ? args.show : true, // Default to true, but respect explicit false
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true,
      plugins: true,
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: true,
      preload: isDev
        ? path.join(__dirname, '../../preload.cjs')
        : path.join(__dirname, '../../preload.cjs'),
      additionalArguments: args.additionalArguments || []
    }
  })

  win.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../../index.html')}`
  )

  // Set SSL preference in localStorage for renderer process
  win.webContents.on('did-finish-load', () => {
    const sslEnabled = store.get('ledfx-ssl-enabled', false)
    win.webContents.executeJavaScript(
      `window.localStorage.setItem('ledfx-ssl-enabled', '${sslEnabled}')`
    )
  })

  // Persist window position and size on move/resize/close
  const saveWindowBounds = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      const bounds = win.getBounds()
      electronStore.set('windowBounds', bounds)
    }
  }
  win.on('resize', saveWindowBounds)
  win.on('move', saveWindowBounds)
  win.on('close', saveWindowBounds)

  return win
}

export default createWindow
