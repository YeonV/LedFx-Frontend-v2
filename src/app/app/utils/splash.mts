import { BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

let splashInstance: BrowserWindow | null = null

export const createSplashWindow = (): BrowserWindow => {
  const splashWindow = new BrowserWindow({
    width: 400,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const splashPath = isDev
    ? `file://${path.join(process.cwd(), 'public', 'splash.html')}`
    : `file://${path.join(process.resourcesPath, 'splash.html')}`

  splashWindow.loadURL(splashPath)
  splashWindow.center()

  // Handle close button click
  ipcMain.on('close-splash', () => {
    closeSplash()
  })

  splashInstance = splashWindow
  return splashWindow
}

export const updateSplashStatus = (message: string) => {
  if (splashInstance && !splashInstance.isDestroyed()) {
    splashInstance.webContents.send('splash-status', message)
  }
}

export const showDriverChoice = (): Promise<{ install: boolean; remember: boolean }> => {
  return new Promise((resolve) => {
    if (splashInstance && !splashInstance.isDestroyed()) {
      // Resize splash window for dialog
      splashInstance.setSize(400, 450)
      splashInstance.center()

      // Show the choice dialog
      splashInstance.webContents.send('show-driver-choice')

      // Listen for user's choice
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleChoice = (_event: any, data: { install: boolean; remember: boolean }) => {
        ipcMain.removeListener('driver-choice-response', handleChoice)
        resolve(data)
      }

      ipcMain.on('driver-choice-response', handleChoice)
    } else {
      // Fallback if splash is not available
      resolve({ install: false, remember: false })
    }
  })
}

export const hideDriverChoice = () => {
  if (splashInstance && !splashInstance.isDestroyed()) {
    // Reset splash window size
    splashInstance.setSize(400, 350)
    splashInstance.center()
    splashInstance.webContents.send('hide-driver-choice')
  }
}

export const showSslChoice = (): Promise<{ enable: boolean; remember: boolean }> => {
  return new Promise((resolve) => {
    if (splashInstance && !splashInstance.isDestroyed()) {
      // Resize splash window for dialog
      splashInstance.setSize(400, 480)
      splashInstance.center()

      // Show the choice dialog with platform info
      splashInstance.webContents.send('show-ssl-choice', { platform: process.platform })

      // Listen for user's choice
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleChoice = (_event: any, data: { enable: boolean; remember: boolean }) => {
        ipcMain.removeListener('ssl-choice-response', handleChoice)
        resolve(data)
      }

      ipcMain.on('ssl-choice-response', handleChoice)
    } else {
      // Fallback if splash is not available
      resolve({ enable: false, remember: false })
    }
  })
}

export const hideSslChoice = () => {
  if (splashInstance && !splashInstance.isDestroyed()) {
    // Reset splash window size
    splashInstance.setSize(400, 350)
    splashInstance.center()
    splashInstance.webContents.send('hide-ssl-choice')
  }
}

export const closeSplash = () => {
  if (splashInstance && !splashInstance.isDestroyed()) {
    splashInstance.close()
    splashInstance = null
  }
}
