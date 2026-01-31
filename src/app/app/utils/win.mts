import { BrowserWindow } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'
import { initialize } from '@electron/remote/main/index.js'
import { fileURLToPath } from 'node:url'
import store from './store.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createWindow(win?: any, args: any = {}) {
  initialize()
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 1024,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'default' : 'hidden',
    titleBarOverlay:
      process.platform === 'darwin' ? false : { color: '#333', symbolColor: '#ffffff' },
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

  return win
}

export default createWindow
