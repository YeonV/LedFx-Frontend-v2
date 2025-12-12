import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import runCore from './runCore.mjs'
import corePath from './corePath.mjs'
import coreFile from './coreFile.mjs'
import coreParams from './coreParams.mjs'
import store from './store.mjs'
import { ChildProcessWithoutNullStreams } from 'child_process'

function startCore(
  wind: BrowserWindow,
  platform: 'darwin' | 'linux' | 'win32',
  instance = 'instance1',
  port = '8888'
) {
  let subpy: ChildProcessWithoutNullStreams | null = null

  if (fs.existsSync(corePath(coreFile[platform]))) {
    if (coreParams[platform] && instance && coreParams[platform][instance]) {
      if (instance !== 'instance1') {
        coreParams[platform][instance] = [
          '-p',
          port,
          '-c',
          path.join(app.getPath('userData'), '.ledfx-cc', instance)
        ]
      }
      console.log('Starting core with params', platform, instance, coreParams[platform][instance])
      subpy = runCore(coreFile[platform], coreParams[platform][instance])
    } else {
      coreParams[platform][`instance${Object.keys(coreParams[platform]).length + 1}`] = [
        '-p',
        port,
        '-c',
        path.join(app.getPath('userData'), '.ledfx-cc', instance)
      ]
      console.log(
        'Creating core with params',
        platform,
        Object.keys(coreParams[platform]).length,
        coreParams[platform][`instance${Object.keys(coreParams[platform]).length}`]
      )
      subpy = runCore(
        coreFile[platform],
        coreParams[platform][`instance${Object.keys(coreParams[platform]).length}`]
      )
    }
    store.set('coreParams', coreParams)
    if (!wind.isDestroyed()) {
      wind.webContents.send('fromMain', ['coreParams', coreParams[process.platform]])
    }
    if (subpy !== null) {
      subpy.on('stdout', (data) => {
        console.log(`stdout: ${data}`)
      })
      subpy.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })
      subpy.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`)
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
