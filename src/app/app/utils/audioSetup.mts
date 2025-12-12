import store from './store.mjs'
import { installDriver, isDriverInstalled } from './audioDriver.mjs'
import { enableAudioDevice, disableAudioDevice } from './audioManager.mjs'
import { showDriverChoice, hideDriverChoice } from './splash.mjs'

/**
 * Perform audio driver installation based on user preference
 * @returns Promise<boolean> - success status
 */
export const setupAudioDriver = async (): Promise<boolean> => {
  // Only for macOS
  if (process.platform !== 'darwin') {
    console.log('Audio driver setup skipped - not macOS')
    return true
  }

  // Check if driver is actually installed
  const actuallyInstalled = await isDriverInstalled()

  if (!actuallyInstalled) {
    // Check if user previously chose "don't ask again"
    const dontAskAgain = store.get('driver-dont-ask-again', false)
    const autoInstall = store.get('driver-auto-install', false)

    if (dontAskAgain) {
      // User previously made a choice with "remember"
      if (autoInstall) {
        console.log('Auto-installing driver per user preference...')
        const result = await installDriver()
        if (result.success) {
          store.set('ledfx-driver-installed', true)
          console.log('Driver installed successfully')
          return true
        } else {
          console.error('Driver installation failed:', result.message)
          store.set('ledfx-driver-installed', false)
          return false
        }
      } else {
        console.log('Skipping driver installation per user preference')
        return true
      }
    }

    // Show choice dialog to user
    console.log('Driver not detected - asking user for choice...')
    const choice = await showDriverChoice()
    hideDriverChoice()

    // Save preference if user checked "remember"
    if (choice.remember) {
      store.set('driver-dont-ask-again', true)
      store.set('driver-auto-install', choice.install)
    }

    if (choice.install) {
      console.log('User chose to install driver')
      const result = await installDriver()
      if (result.success) {
        store.set('ledfx-driver-installed', true)
        console.log('Driver installed successfully')
        return true
      } else {
        console.error('Driver installation failed:', result.message)
        store.set('ledfx-driver-installed', false)
        return false
      }
    } else {
      console.log('User chose to continue without driver')
      store.set('ledfx-driver-installed', false)
      return true
    }
  }

  console.log('Driver already installed')
  store.set('ledfx-driver-installed', true)
  return true
}

/**
 * Enable LedFx audio device (called on every launch)
 * @returns Promise<boolean> - success status
 */
export const enableAudio = async (): Promise<boolean> => {
  // Only for macOS
  if (process.platform !== 'darwin') {
    console.log('Audio enable skipped - not macOS')
    return true
  }

  console.log('Enabling LedFx audio device...')
  const result = await enableAudioDevice()
  if (result.success) {
    console.log('Audio device enabled')
    return true
  } else {
    console.error('Failed to enable audio device:', result.message)
    return false
  }
}

/**
 * Disable audio device (called on close)
 * @returns Promise<boolean> - success status
 */
export const disableAudio = async (): Promise<boolean> => {
  // Only for macOS
  if (process.platform !== 'darwin') {
    console.log('Audio disable skipped - not macOS')
    return true
  }

  console.log('Disabling LedFx audio device...')
  const result = await disableAudioDevice()
  if (result.success) {
    console.log('Audio device disabled')
    return true
  } else {
    console.error('Failed to disable audio device:', result.message)
    return false
  }
}
