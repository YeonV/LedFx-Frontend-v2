import * as path from 'path'
import * as fs from 'fs'
import { app } from 'electron'

export function getReduxPath(): string | false {
  const appDataPath = app.getPath('appData')
  const localAppDataPath = path.join(appDataPath, '..', 'Local')
  const chromeExtensionsPath = path.join(
    localAppDataPath,
    'Google',
    'Chrome',
    'User Data',
    'Default',
    'Extensions'
  )
  const reduxDevtoolsId = 'lmhkpmbekcpmknklioeibfkpmmfibljd'

  if (fs.existsSync(chromeExtensionsPath)) {
    const reduxDevtoolsDir = path.join(chromeExtensionsPath, reduxDevtoolsId)
    if (fs.existsSync(reduxDevtoolsDir)) {
      const versions = fs.readdirSync(reduxDevtoolsDir)
      if (versions.length > 0) {
        const latestVersion = versions.sort().pop() // Get the latest version
        if (latestVersion !== undefined) {
          const reduxDevtoolsPath = path.join(reduxDevtoolsDir, latestVersion)
          if (fs.existsSync(reduxDevtoolsPath)) {
            return reduxDevtoolsPath
          }
        }
      }
    }
  } else {
    console.info('Chrome extensions path does not exist:', chromeExtensionsPath)
  }

  return false
}

export default getReduxPath
