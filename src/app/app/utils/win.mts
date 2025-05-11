import { BrowserWindow } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'
import { initialize } from '@electron/remote/main/index.js'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createWindow(win?: any, args = {}) {
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
      ...args
    }
  })

  win.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../../index.html')}`
  )

  return win
}

export default createWindow
