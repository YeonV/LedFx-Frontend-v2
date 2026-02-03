import { BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import fs from 'fs'
import isDev from 'electron-is-dev'
import { initialize } from '@electron/remote/main/index.js'
import { fileURLToPath } from 'node:url'
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

  // Check if SSL is enabled for dev server by checking if .env file exists with HTTPS=true
  let sslEnabled = false
  if (isDev) {
    try {
      const envPath = path.join(__dirname, '../../../.env')
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8')
        sslEnabled = envContent.includes('HTTPS=true')
      }
    } catch (e) {
      // If we can't read .env, default to false
      console.log('Error reading .env file for SSL check:', e)
    }
  }
  const devUrl = sslEnabled ? 'https://localhost:3000' : 'http://localhost:3000'

  win.loadURL(isDev ? devUrl : `file://${path.join(__dirname, '../../index.html')}`)

  // Set SSL preference in localStorage for renderer process
  win.webContents.on('did-finish-load', () => {
    win.webContents
      .executeJavaScript(
        `try { window.localStorage.setItem('ledfx-ssl-enabled', '${sslEnabled}'); } catch(e) { /* localStorage not accessible, silently ignore */ }`
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        console.log('Failed to set SSL preference in localStorage:', err)
      })
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
