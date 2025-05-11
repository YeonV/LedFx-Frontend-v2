import path from 'path'
import { app, BrowserWindow, Menu, shell, Tray } from 'electron'
import isDev from 'electron-is-dev'
import startCore from './startCore.mjs'
import coreParams from './coreParams.mjs'
// import { download } from 'electron-dl'

export function createMenu(isCC: boolean, wind: BrowserWindow, thePath: string) {
  let contextMenu

  if (isCC) {
    contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          if (process.platform === 'darwin') app.dock?.show()
          wind.show()
        }
      },
      { label: 'Minimize', click: () => wind.minimize() },
      {
        label: 'Minimize to tray',
        click: () => {
          if (process.platform === 'darwin') app.dock?.hide()
          wind.hide()
        }
      },
      // { label: 'Test Notifiation', click: () => showNotification('Update Available', 'v2.0.62') },
      { label: 'seperator', type: 'separator' },
      { label: 'Dev', click: () => wind.webContents.openDevTools() },
      { label: 'seperator', type: 'separator' },
      {
        label: 'Start core',
        click: () =>
          startCore(wind, process.platform as 'darwin' | 'linux' | 'win32', coreParams.instance)
      },
      {
        label: 'Stop core',
        click: () => wind.webContents.send('fromMain', 'shutdown')
      },
      // { label: 'Download core', click: () =>  download(wind, `https://github.com/YeonV/LedFx-Frontend-v2/releases/latest/download/LedFx_core-${app.getVersion().split('-')[1]}--win-portable.exe`, { directory: thePath, overwrite: true }).then((f) => { app.relaunch(); app.exit() }) },
      {
        label: 'Restart Client',
        click: () => {
          app.relaunch()
          app.exit()
        }
      },
      { label: 'Open folder', click: () => shell.openPath(thePath) },
      { label: 'seperator', type: 'separator' },
      { label: 'Exit', click: () => app.quit() }
    ])
  } else {
    contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          if (process.platform === 'darwin') app.dock?.show()
          wind.show()
        }
      },
      { label: 'Minimize', click: () => wind.minimize() },
      {
        label: 'Minimize to tray',
        click: () => {
          if (process.platform === 'darwin') app.dock?.hide()
          wind.hide()
        }
      },
      // { label: 'Test Notifiation', click: () => showNotification('Update Available', 'v2.0.62') },
      { label: 'seperator', type: 'separator' },
      { label: 'Dev', click: () => wind.webContents.openDevTools() },
      { label: 'seperator', type: 'separator' },
      {
        label: 'Stop core',
        click: () => wind.webContents.send('fromMain', 'shutdown')
      },
      // { label: 'Download core', click: () => download(wind, `https://github.com/YeonV/LedFx-Frontend-v2/releases/latest/download/LedFx_core-${app.getVersion().split('-')[1]}--win-portable.exe`, { directory: thePath, overwrite: true, onProgress: (obj)=>{wind.webContents.send('fromMain', ['download-progress', obj])} }).then((f) => { wind.webContents.send('fromMain', 'clear-frontend'); app.relaunch(); app.exit() })},
      {
        label: 'Restart Client',
        click: () => {
          app.relaunch()
          app.exit()
        }
      },
      { label: 'Open folder', click: () => shell.openPath(thePath) },
      { label: 'seperator', type: 'separator' },
      { label: 'Exit', click: () => app.quit() }
    ])
  }

  return contextMenu
}

export function createTray(isCC: boolean, wind: BrowserWindow, thePath: string, dir: string) {
  const icon = path.join(dir, 'icon_16x16a.png')
  const tray = new Tray(icon)

  const contextMenu = createMenu(isCC, wind, thePath)

  tray.setToolTip(`LedFx Client${isDev ? ' DEV' : ''}`)
  tray.setContextMenu(contextMenu)
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', () => wind.show())

  return tray
}
