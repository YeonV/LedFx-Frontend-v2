import isElectron from 'is-electron'

export const getBaseURL = () =>
  isElectron() ? 'http://localhost:8888' : window.location.origin

const calculateRedirectUrl = () => {
  const productionBase = getBaseURL()
  const developmentBase = isElectron()
    ? productionBase
    : 'http://localhost:3000'

  const finalBase =
    process.env.NODE_ENV === 'production' ? productionBase : developmentBase

  return `${finalBase}/callback/#/Integrations?`
}

export const SPOTIFY_CLIENT_ID = '7658827aea6f47f98c8de593f1491da5'
export const SPOTIFY_REDIRECT_URI = calculateRedirectUrl()
export const SPOTIFY_SCOPES = [
  'user-top-read',
  'user-read-email',
  'user-read-private',
  'streaming',
  'user-read-playback-position',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-library-read',
  'user-library-modify'
]
