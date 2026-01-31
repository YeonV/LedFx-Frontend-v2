import store from './store.mjs'
import { enableSsl, isSslInstalled, isHostsFileConfigured } from './sslManager.mjs'
import { showSslChoice, hideSslChoice, updateSplashStatus } from './splash.mjs'

/**
 * Perform SSL setup based on user preference
 * @returns Promise<boolean> - success status
 */
export const setupSsl = async (): Promise<boolean> => {
  // Only for Windows
  if (process.platform !== 'win32') {
    console.log('SSL setup skipped - not Windows')
    return true
  }

  // Check if SSL is actually installed
  console.log('Checking if SSL is already installed...')
  const actuallyInstalled = await isSslInstalled()
  const hostsConfigured = await isHostsFileConfigured()
  console.log('SSL check results - installed:', actuallyInstalled, 'hosts:', hostsConfigured)

  if (actuallyInstalled && hostsConfigured) {
    console.log('SSL already configured, skipping installation')
    store.set('ledfx-ssl-enabled', true)
    return true
  }

  // Check if user previously chose "don't ask again"
  const dontAskAgain = store.get('ssl-dont-ask-again', false)
  const autoEnable = store.get('ssl-auto-enable', false)

  if (dontAskAgain) {
    // User previously made a choice with "remember"
    if (autoEnable) {
      console.log('Auto-enabling SSL per user preference...')
      // Set the flag IMMEDIATELY (optimistically) so core.js can read it
      store.set('ledfx-ssl-enabled', true)

      updateSplashStatus('Installing SSL certificates...')
      const result = await enableSsl()
      if (result.success) {
        console.log('SSL enabled successfully')
        return true
      } else {
        console.error('SSL setup failed:', result.message)
        // Revert on failure
        store.set('ledfx-ssl-enabled', false)
        return false
      }
    } else {
      console.log('Skipping SSL setup per user preference')
      store.set('ledfx-ssl-enabled', false)
      return true
    }
  }

  // Show choice dialog to user
  console.log('SSL not detected - asking user for choice...')
  const choice = await showSslChoice()
  hideSslChoice()

  // Save preference if user checked "remember"
  if (choice.remember) {
    store.set('ssl-dont-ask-again', true)
    store.set('ssl-auto-enable', choice.enable)
  }

  if (choice.enable) {
    console.log('User chose to enable SSL')
    // Set the flag IMMEDIATELY (optimistically) so core.js can read it
    store.set('ledfx-ssl-enabled', true)

    updateSplashStatus('Installing SSL certificates...')
    const result = await enableSsl()
    if (result.success) {
      console.log('SSL enabled successfully')
      return true
    } else {
      console.error('SSL setup failed:', result.message)
      // Revert on failure
      store.set('ledfx-ssl-enabled', false)
      return false
    }
  } else {
    console.log('User chose to continue without SSL')
    store.set('ledfx-ssl-enabled', false)
    return true
  }
}

/**
 * Check if SSL should be used for LedFx URL
 */
export const shouldUseSsl = (): boolean => {
  return store.get('ledfx-ssl-enabled', false) as boolean
}

/**
 * Get the appropriate LedFx URL based on SSL status
 */
export const getLedfxUrl = (): string => {
  const useSsl = shouldUseSsl()
  if (useSsl && process.platform === 'win32') {
    return 'https://ledfx.local:8889'
  }
  return 'http://localhost:8888'
}
