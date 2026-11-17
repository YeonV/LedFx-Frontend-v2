import isElectron from 'is-electron'
import { getSpotifyRedirectUri } from './spotifyAuthConfig'

export const getBaseURL = () => {
  if (isElectron()) {
    // In Electron, check if we're running on HTTPS (SSL enabled)
    if (typeof window !== 'undefined') {
      try {
        const ledfxHost = window.localStorage.getItem('ledfx-host')
        if (ledfxHost?.startsWith('https') || window.location.href.startsWith('https')) {
          return 'https://127.0.0.1:8889'
        }
      } catch (e) {
        // localStorage access denied, fall back to checking URL only
        if (window.location.href.startsWith('https')) {
          return 'https://127.0.0.1:8889'
        }
        if (e) {
          return 'http://localhost:8888'
        }
      }
    }
    return 'http://localhost:8888'
  }
  return window.location.origin
}

export const SPOTIFY_CLIENT_ID =
  process.env.REACT_APP_SPOTIFY_CLIENT_ID?.trim() || '7658827aea6f47f98c8de593f1491da5'
export const SPOTIFY_REDIRECT_URI = getSpotifyRedirectUri(window.location.origin, isElectron())
export const SPOTIFY_SCOPES = [
  'user-top-read',
  'user-read-email',
  'user-read-private',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-library-read',
  'user-library-modify'
]
