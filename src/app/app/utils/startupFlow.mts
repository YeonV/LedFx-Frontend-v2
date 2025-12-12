import { BrowserWindow } from 'electron'
import { createSplashWindow, updateSplashStatus, closeSplash } from './splash.mjs'
import { setupAudioDriver, enableAudio } from './audioSetup.mjs'
import { startInstance, Subprocesses } from '../instances.mjs'
import { waitForServer } from './serverPolling.mjs'

/**
 * Execute the complete CC startup flow:
 * 1. Show splash screen
 * 2. Install driver (first time only)
 * 3. Enable audio device
 * 4. Start LedFx core
 * 5. Wait for server
 * 6. Close splash
 *
 * @param subprocesses - Subprocess tracking object
 * @returns Promise<void>
 */
export const executeCCStartup = async (subprocesses: Subprocesses): Promise<void> => {
  // Step 1: Show splash screen
  if (process.platform === 'darwin') {
    createSplashWindow()
    updateSplashStatus('Initializing...')

    // Step 2: Install driver if first time
    updateSplashStatus('Installing audio driver...')
    await setupAudioDriver()

    // Step 3: Enable audio device
    updateSplashStatus('Configuring audio device...')
    await enableAudio()
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
