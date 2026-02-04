import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import isDev from 'electron-is-dev'
import store from './utils/store.mjs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

            // Check if this is a protocol callback (e.g., ledfx://callback)
            const protocolUrl = commandLine.find((arg) => arg.startsWith('ledfx://'))
            if (protocolUrl) {
              // Store the callback URL in electron-store for the renderer to pick up
              console.log('Received protocol callback:', protocolUrl)
              store.set('protocol-callback', protocolUrl)

              // Skip page reload for song detector calls - just store and send the message
              if (!protocolUrl.startsWith('ledfx://song/')) {
                if (isDev) {
                  // In dev mode, navigate to the app's main page
                  let sslEnabled = false
                  try {
                    const envPath = path.join(__dirname, '../../.env')
                    if (fs.existsSync(envPath)) {
                      const envContent = fs.readFileSync(envPath, 'utf-8')
                      sslEnabled = envContent.includes('HTTPS=true')
                    }
                  } catch (e) {
                    console.log(e)
                  }
                  const protocol = sslEnabled ? 'https' : 'http'
                  wind.loadURL(`${protocol}://localhost:3000`)
                } else {
                  // In production, load the app's main page from build folder
                  const appPath = app.getAppPath()
                  const indexPath = path.join(appPath, 'build', 'index.html')
                  wind.loadURL(`file://${indexPath}`)
                }
              }
            }

            wind.webContents.send('fromMain', [
              'protocol',
              JSON.stringify({ event, commandLine, workingDirectory })
            ])
            wind.focus()
          }
        }
      )
      ready()
      app.on('open-url', (event: Electron.Event, url: string) => {
        console.log(event, url)
        const wind = getWind()
        if (wind && url.startsWith('ledfx://')) {
          // Store the callback URL in electron-store for the renderer to pick up
          console.log('Received protocol callback:', url)
          store.set('protocol-callback', url)

          // Skip page reload for song detector calls - just store and focus the window
          if (!url.startsWith('ledfx://song/')) {
            if (isDev) {
              // In dev mode, load the app's main page
              let sslEnabled = false
              try {
                const envPath = path.join(__dirname, '../../.env')
                if (fs.existsSync(envPath)) {
                  const envContent = fs.readFileSync(envPath, 'utf-8')
                  sslEnabled = envContent.includes('HTTPS=true')
                }
              } catch (e) {
                console.log('Error reading .env file for SSL check:', e)
              }
              const protocol = sslEnabled ? 'https' : 'http'
              wind.loadURL(`${protocol}://localhost:3000`)
            } else {
              // In production, load the app's main page from build folder
              const appPath = app.getAppPath()
              const indexPath = path.join(appPath, 'build', 'index.html')
              wind.loadURL(`file://${indexPath}`)
            }
          }
          wind.focus()
        }
      })
    }
  } else {
    ready()
    app.on('open-url', (event: Electron.Event, url: string) => console.log(event, url))
  }
}
