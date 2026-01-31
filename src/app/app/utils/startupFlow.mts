import { BrowserWindow } from 'electron'
import { createSplashWindow, updateSplashStatus, closeSplash } from './splash.mjs'
import { setupAudioDriver, enableAudio } from './audioSetup.mjs'
import { setupSsl } from './sslSetup.mjs'
import { startInstance, Subprocesses } from '../instances.mjs'
import { waitForServer } from './serverPolling.mjs'

/**
 * Execute the complete CC startup flow:
 * 1. Show splash screen
 * 2. Install driver (first time only) - macOS
 * 3. Enable audio device - macOS
 * 4. Setup SSL (optional) - Windows
 * 5. Start LedFx core
 * 6. Wait for server
 * 7. Close splash
 *
 * @param subprocesses - Subprocess tracking object
 * @returns Promise<void>
 */
export const executeCCStartup = async (subprocesses: Subprocesses): Promise<void> => {
  // Step 1: Show splash screen on all platforms
  createSplashWindow()
  updateSplashStatus('Initializing...')

  // Step 2: Audio setup (macOS only)
  if (process.platform === 'darwin') {
    // Install driver if first time
    updateSplashStatus('Installing audio driver...')
    await setupAudioDriver()

    // Enable audio device
    updateSplashStatus('Configuring audio device...')
    await enableAudio()
  }

  // Step 3: SSL setup (Windows only)
  if (process.platform === 'win32') {
    updateSplashStatus('Checking SSL configuration...')
    const sslResult = await setupSsl()
    if (sslResult) {
      updateSplashStatus('SSL configuration complete')
    }
  }

  // Step 4: Start LedFx core
  updateSplashStatus('Starting LedFx core...')
  const tempWin = new BrowserWindow({ show: false, width: 1, height: 1 })
  startInstance(tempWin, 'instance1', subprocesses)

  // Step 5: Wait for server to be ready
  updateSplashStatus('Waiting for LedFx core...')
  const serverReady = await waitForServer('http://localhost:8888')

  if (serverReady) {
    updateSplashStatus('Ready!')
    console.log('LedFx server is ready')
  } else {
    console.warn('Server did not start within timeout, creating window anyway')
  }

  // Close the temporary window
  tempWin.close()

  // Give a brief moment to show the final status
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Step 6: Close splash before creating main window
  closeSplash()
}
