import { BrowserWindow } from 'electron'
import coreParams from './utils/coreParams.mjs'
import startCore from './utils/startCore.mjs'
import { ChildProcessWithoutNullStreams, execSync } from 'child_process'
import { setShuttingDown } from './utils/songDetector.mjs'
import { setProtocolShuttingDown } from './protocol.mjs'
import Store from 'electron-store'

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
  // Stop polling if window is destroyed
  if (wind.isDestroyed()) {
    console.log('Window destroyed, stopping poll')
    return
  }

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
    // Check again before scheduling next poll
    if (!wind.isDestroyed()) {
      setTimeout(() => poll(wind, subprocesses, name, p), 1000)
    }
  }
}

export function stopInstance(wind: BrowserWindow, name: string, subprocesses: Subprocesses) {
  if (subprocesses[name]) {
    subprocesses[name].running = false
    sendStatus(wind, subprocesses, false, name)
    try {
      subprocesses[name].kill()
    } catch (error) {
      console.error(`Failed to kill subprocess ${name}:`, error)
    }
  }
}

export function startInstance(
  wind: BrowserWindow,
  name: string,
  subprocesses: Subprocesses,
  port: string = '8888'
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
        // Don't try to send status if window is destroyed
        if (wind && !wind.isDestroyed()) {
          try {
            sendStatus(wind, subprocesses, false, name)
          } catch {
            console.log('Window destroyed during exit handler')
          }
        }
      })
      subpy.on('error', () => {
        if (subprocesses[name]) {
          subprocesses[name].running = false
        }
        // Don't try to send status if window is destroyed
        if (wind && !wind.isDestroyed()) {
          try {
            sendStatus(wind, subprocesses, false, name)
          } catch {
            console.log('Window destroyed during error handler')
          }
        }
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

  // Check if window is destroyed
  if (wind.isDestroyed()) {
    console.log('Window destroyed, skipping sendStatus')
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
        status[name] = connected ? 'running' : subprocesses[name].running ? 'starting' : 'stopped'
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

export function closeAllSubs(wind: BrowserWindow, subpy: Subprocess, subprocesses: Subprocesses) {
  // Set shutdown flags FIRST to prevent any restarts or protocol processing
  setShuttingDown(true)
  setProtocolShuttingDown(true)
  console.log('[CloseAllSubs] Setting shutdown flags and cleaning up processes')

  // Clear song detector running state from store to prevent auto-restart
  try {
    const store = new Store()
    store.set('song-detector-running', false)
    store.set('song-detector-plus-running', false)
    console.log('Cleared song detector running state from store')
  } catch (error) {
    console.log('Failed to clear store:', error)
  }

  // FIRST: Kill all song-detector processes by name to catch any spawned children
  if (process.platform === 'win32') {
    try {
      execSync('taskkill /IM song-detector.exe /F /T', { stdio: 'ignore' })
      console.log('[CloseAllSubs] Killed all song-detector.exe by name')
    } catch {}
    try {
      execSync('taskkill /IM song-detector-plus.exe /F /T', { stdio: 'ignore' })
      console.log('[CloseAllSubs] Killed all song-detector-plus.exe by name')
    } catch {}
  }

  // Safely try to send shutdown message
  try {
    if (wind && wind.webContents && !wind.isDestroyed()) {
      wind.webContents.send('fromMain', 'shutdown')
    }
  } catch {
    console.log('Window already destroyed, skipping shutdown message')
  }

  if (subpy !== null) kills(subpy)
  if (subprocesses && Object.keys(subprocesses).length > 0) {
    Object.keys(subprocesses).forEach((key) => {
      const sub = subprocesses[key]
      if (sub && sub.pid) {
        // Use platform-specific kill for better reliability
        try {
          if (process.platform === 'win32') {
            // Windows: SYNCHRONOUSLY force kill process tree
            execSync(`taskkill /pid ${sub.pid} /T /F`, { stdio: 'ignore' })
            console.log(`Killed subprocess ${key} (PID: ${sub.pid}) with taskkill`)
          } else {
            // Unix/Mac: use SIGTERM for cleaner shutdown than SIGINT
            sub.kill('SIGTERM')
            console.log(`Killed subprocess ${key} (PID: ${sub.pid}) with SIGTERM`)
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Process may already be killed by name-based kill above, this is expected
          console.log(`Subprocess ${key} (PID: ${sub.pid}) already terminated`)
        }
      }
    })
  }
}
