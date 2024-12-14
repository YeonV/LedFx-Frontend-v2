import { BrowserWindow } from 'electron'
import coreParams from './utils/coreParams.mjs'
import startCore from './utils/startCore.mjs'
import { ChildProcessWithoutNullStreams } from 'child_process'

export interface Subprocess extends ChildProcessWithoutNullStreams {
  running?: boolean
}

export interface Subprocesses {
  [key: string]: Subprocess
}

export type IPlatform = 'darwin' | 'win32' | 'linux'

export function kills(subprocess: Subprocess | null): void {
  if (subprocess !== null) {
    subprocess.kill('SIGINT')
  }
}

export const poll = async (
  wind: BrowserWindow,
  subprocesses: Subprocesses,
  name: string,
  p: string
) => {
  console.log('Polling core', name, 'on port', p)
  if (!p) return
  try {
    const response = await fetch(`http://127.0.0.1:${p}/api/info`)
    await response.json()
    sendStatus(wind, subprocesses, true, name)
    console.log('Polling core succeeded')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.log('Polling core ...')
    setTimeout(() => poll(wind, subprocesses, name, p), 1000)
  }
}

export function stopInstance(
  wind: BrowserWindow,
  name: string,
  subprocesses: Subprocesses
) {
  if (subprocesses[name]) {
    subprocesses[name].running = false
    sendStatus(wind, subprocesses, false, name)
    subprocesses[name].kill()
  }
}

export function startInstance(
  wind: BrowserWindow,
  name: string,
  subprocesses: Subprocesses,
  port: string = '8889'
) {
  try {
    const subpy = startCore(wind, process.platform as IPlatform, name, port)
    if (subpy !== null) {
      subprocesses[name] = subpy
      subprocesses[name].running = true
      sendStatus(wind, subprocesses, false, name)
      poll(wind, subprocesses, name, port)
      if (!subpy) {
        console.error('Error starting subprocess')
        return
      }
      subpy.on('exit', () => {
        if (subprocesses[name]) {
          subprocesses[name].running = false
        }
        if (wind && wind.webContents && !wind.isDestroyed() && subprocesses) {
          // `subprocesses` is defined, proceed with calling `sendStatus`
          try {
            sendStatus(wind, subprocesses, false, name)
          } catch (error) {
            console.error(error)
          }
        } else {
          // `subprocesses` is not defined, handle this case as needed
          console.error('subprocesses is not defined')
        }
      })
      subpy.on('error', () => {
        if (subprocesses[name]) {
          subprocesses[name].running = false
        }
        sendStatus(wind, subprocesses, false, name)
      })
    }
  } catch (error) {
    console.error(`Error starting instance "${name}": ${error}`)
  }
}

export function sendStatus(
  wind: BrowserWindow,
  subprocesses: Subprocesses,
  connected = false,
  n: string
) {
  const status: { [key: string]: string } = {}
  const platformParams = coreParams[process.platform]
  // Check if `wind` is an instance of `BrowserWindow`
  if (!(wind instanceof BrowserWindow)) {
    console.error('wind is not an instance of BrowserWindow')
    return
  }

  // Check if `subprocesses` is defined
  if (!subprocesses) {
    console.error('subprocesses is not defined')
    return
  }

  // Check if `n` is defined
  if (!n) {
    console.error('n is not defined')
    return
  }

  for (const name in platformParams) {
    if (subprocesses && subprocesses[name]) {
      if (name === n) {
        status[name] = connected
          ? 'running'
          : subprocesses[name].running
            ? 'starting'
            : 'stopped'
      } else {
        status[name] = subprocesses[name].running ? 'running' : 'stopped'
      }
    } else {
      status[name] = 'stopped'
    }
  }
  if (wind && wind.webContents && !wind.isDestroyed() && status)
    wind.webContents.send('fromMain', ['status', status])
}

export function closeAllSubs(
  wind: BrowserWindow,
  subpy: Subprocess,
  subprocesses: Subprocesses
) {
  if (wind && wind.webContents && !wind.isDestroyed())
    wind.webContents.send('fromMain', 'shutdown')
  if (subpy !== null) kills(subpy)
  if (subprocesses && Object.keys(subprocesses).length > 0) {
    Object.values(subprocesses).forEach((sub) => {
      if (sub) kills(sub)
    })
  }
}
