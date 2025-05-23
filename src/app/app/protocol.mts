import { app } from 'electron'
import path from 'path'

export const setupProtocol = () => {
  ;(async () => {
    const isSquirrelStartup = await import('electron-squirrel-startup')
    if (isSquirrelStartup.default) {
      app.quit()
    }
  })()

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('ledfx', process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient('ledfx')
  }
}

export const handleProtocol = (
  getWind: () => Electron.BrowserWindow | null,
  gotTheLock: boolean,
  ready: () => void
) => {
  if (process.platform === 'win32') {
    if (!gotTheLock) {
      app.quit()
    } else {
      app.on(
        'second-instance',
        (event: Electron.Event, commandLine: string[], workingDirectory: string) => {
          const wind = getWind()
          console.log(commandLine, wind)
          if (wind) {
            if (wind.isMinimized()) wind.restore()
            wind.webContents.send('fromMain', [
              'protocol',
              JSON.stringify({ event, commandLine, workingDirectory })
            ])
            wind.focus()
          }
        }
      )
      ready()
      app.on('open-url', (event: Electron.Event, url: string) => console.log(event, url))
    }
  } else {
    ready()
    app.on('open-url', (event: Electron.Event, url: string) => console.log(event, url))
  }
}
