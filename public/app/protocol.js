const { app } = require('electron')
const path = require('path')

const setupProtocol = () => {
if (require('electron-squirrel-startup')) {
    app.quit()
    }
if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('ledfx', process.execPath, [
        path.resolve(process.argv[1])
      ])
    }
  } else {
    app.setAsDefaultProtocolClient('ledfx')
  }
}

const handleProtocol = (wind, gotTheLock, ready) => {
    if (process.platform === 'win32') {
        if (!gotTheLock) {
          app.quit()
        } else {
          app.on('second-instance', (event, commandLine, workingDirectory) => {
            if (wind) {
              if (wind.isMinimized()) wind.restore()
              wind.focus()
              wind.webContents.send('fromMain', [
                'protocol',
                JSON.stringify({ event, commandLine, workingDirectory })
              ])
            }
          })
          ready()
          app.on('open-url', (event, url) => console.log(event, url))
        }
      } else {
        ready()
        app.on('open-url', (event, url) => console.log(event, url))
      }
}

module.exports = { setupProtocol, handleProtocol }