import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import runCore from './runCore.mjs'
import corePath from './corePath.mjs'
import coreFile from './coreFile.mjs'
import coreParams from './coreParams.mjs'
import store from './store.mjs'
import { ChildProcessWithoutNullStreams } from 'child_process'

// ANSI color codes for consistent logging
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  blue: '\x1b[34m'
}

function getNextAvailablePorts(platform: 'darwin' | 'linux' | 'win32') {
  const existingPorts = (Object.values(coreParams[platform]) as string[][])
    .map((params: string[]) => {
      const pIndex = params.indexOf('-p')
      return pIndex !== -1 ? parseInt(params[pIndex + 1]) : 0
    })
    .filter((port) => port > 0)

  const highestPort = existingPorts.length > 0 ? Math.max(...existingPorts) : 8888
  const nextHttpPort = highestPort + 2
  const nextHttpsPort = nextHttpPort + 1

  return { httpPort: nextHttpPort, httpsPort: nextHttpsPort }
}

function startCore(
  wind: BrowserWindow,
  platform: 'darwin' | 'linux' | 'win32',
  instance = 'instance1',
  port?: string
) {
  let subpy: ChildProcessWithoutNullStreams | null = null
  const sslEnabled = store.get('ledfx-ssl-enabled', false) as boolean

  if (fs.existsSync(corePath(coreFile[platform]))) {
    if (coreParams[platform] && instance && coreParams[platform][instance]) {
      // Instance exists - use existing config
      if (instance !== 'instance1') {
        const httpPort =
          port || coreParams[platform][instance][coreParams[platform][instance].indexOf('-p') + 1]
        const httpsPort = (parseInt(httpPort) + 1).toString()
        const configPath = path.join(app.getPath('userData'), '.ledfx-cc', instance)

        // Rebuild params with current SSL state
        const baseParams = ['-p', httpPort, '-c', configPath]
        if (platform !== 'darwin') baseParams.push('--no-tray')

        if (sslEnabled) {
          baseParams.splice(2, 0, '-p_s', httpsPort)
        }

        coreParams[platform][instance] = baseParams
      } else {
        // instance1 - update SSL flag only
        const existingParams = [...coreParams[platform][instance]]
        const psIndex = existingParams.indexOf('-p_s')

        if (sslEnabled && psIndex === -1) {
          // Add SSL port
          existingParams.splice(2, 0, '-p_s', '8889')
        } else if (!sslEnabled && psIndex !== -1) {
          // Remove SSL port
          existingParams.splice(psIndex, 2)
        }

        coreParams[platform][instance] = existingParams
      }
      console.log('Starting core with params', platform, instance, coreParams[platform][instance])
      subpy = runCore(coreFile[platform], coreParams[platform][instance])
    } else {
      // New instance - calculate next available ports
      const { httpPort } = getNextAvailablePorts(platform)
      const usePort = port || httpPort.toString()
      const useHttpsPort = (parseInt(usePort) + 1).toString()
      const configPath = path.join(app.getPath('userData'), '.ledfx-cc', instance)

      const baseParams = ['-p', usePort, '-c', configPath]
      if (platform !== 'darwin') baseParams.push('--no-tray')

      if (sslEnabled) {
        baseParams.splice(2, 0, '-p_s', useHttpsPort)
      }

      const instanceKey = instance || `instance${Object.keys(coreParams[platform]).length + 1}`
      coreParams[platform][instanceKey] = baseParams

      console.log(
        'Creating core with params',
        platform,
        instanceKey,
        coreParams[platform][instanceKey]
      )
      subpy = runCore(coreFile[platform], coreParams[platform][instanceKey])
    }
    store.set('coreParams', coreParams)
    if (!wind.isDestroyed()) {
      wind.webContents.send('fromMain', ['coreParams', coreParams[process.platform]])
    }
    if (subpy !== null) {
      subpy.on('stdout', (data) => {
        const message = data.toString().trim()
        if (message) {
          console.log(
            `${colors.blue}[Core]     ${colors.reset}${colors.dim}${message}${colors.reset}`
          )
        }
      })
      subpy.stdout.on('data', (data) => {
        const message = data.toString().trim()
        if (message) {
          console.log(
            `${colors.blue}[Core]     ${colors.reset}${colors.dim}${message}${colors.reset}`
          )
        }
      })
      subpy.stderr.on('data', (data) => {
        const message = data.toString().trim()
        if (message) {
          console.log(
            `${colors.blue}[Core]     ${colors.reset}${colors.dim}${message}${colors.reset}`
          )
        }
        if (!wind.isDestroyed()) {
          wind.webContents.send('fromMain', ['snackbar', data.toString()])
        }
      })
      subpy.on('exit', (code, signal) => {
        console.log(`Child process exited with code ${code} and signal ${signal}`)
      })
      subpy.on('error', (err) => {
        console.error(`Failed to start subprocess. ${err}`)
      })
    }
  }
  return subpy
}

export default startCore
