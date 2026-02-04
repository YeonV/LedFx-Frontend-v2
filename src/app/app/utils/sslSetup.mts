import store from './store.mjs'
import { isSslInstalled, isHostsFileConfigured } from './sslManager.mjs'

/**
 * Perform SSL setup based on user preference
 * @returns Promise<boolean> - success status
 */
export const setupSsl = async (): Promise<boolean> => {
  // Check if SSL is actually installed
  console.log('Checking if SSL is already installed...')
  const actuallyInstalled = await isSslInstalled()
  const hostsConfigured = await isHostsFileConfigured()
  console.log('SSL check results - installed:', actuallyInstalled, 'hosts:', hostsConfigured)

  if (actuallyInstalled && hostsConfigured) {
    console.log('SSL already configured, enabling HTTPS')
    store.set('ledfx-ssl-enabled', true)
    return true
  }

  // SSL not installed - continue without SSL
  console.log('SSL not installed - continuing with HTTP')
  store.set('ledfx-ssl-enabled', false)
  return true
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
  if (useSsl) {
    return 'https://ledfx.local:8889'
  }
  return 'http://localhost:8888'
}
