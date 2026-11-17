import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
// import axios from 'axios'
import Cookies from 'universal-cookie'
import getPkce from 'oauth-pkce'
import { Login, Logout } from '@mui/icons-material'
import isElectron from 'is-electron'
import useStore from '../../../store/useStore'
import { logoutAuth } from '../../../utils/spotifyProxies'
import useIntegrationCardStyles from '../../../pages/Integrations/IntegrationCard/IntegrationCard.styles'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES
} from '../../../utils/spotifyConstants'
import { getSpotifyAuthorizationUrl } from '../../../utils/spotifyAuthConfig'

const apiCredentials = {
  CLIENT_ID: SPOTIFY_CLIENT_ID,
  // CLIENT_SECRET: '',
  REDIRECT_URL: SPOTIFY_REDIRECT_URI,
  SCOPES: SPOTIFY_SCOPES
}

const SpotifyAuthButton = ({ disabled = false }: { disabled?: boolean }) => {
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
  const player = useStore((state) => state.spotify.player)
  const setspAuthenticated = useStore((state) => state.setSpAuthenticated)
  const setSpotifyAuthToken = useStore((state) => state.setSpAuthToken)
  const [codes, setCodes] = useState<{ verifier: string; challenge: string } | null>(null)
  const [authError, setAuthError] = useState('')
  const cookies = new Cookies(null, { path: '/' })
  const classes = useIntegrationCardStyles()
  useEffect(() => {
    getPkce(50, (error: Error | null, result?: { verifier: string; challenge: string }) => {
      if (error || !result) {
        setAuthError(
          error?.message || 'Could not prepare Spotify login. Please reload and try again.'
        )
        return
      }
      setCodes(result)
    })
    if (cookies.get('access_token')) {
      setspAuthenticated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const beginAuth = () => {
    if (!codes) return
    cookies.set('verifier', codes.verifier)
    // For Electron, also store in electron-store since cookies won't persist across protocol redirect
    if (isElectron()) {
      window.api.send('toMain', {
        command: 'set-store-value',
        key: 'pkce-verifier',
        value: codes.verifier
      })
    }
    const authURL = getSpotifyAuthorizationUrl(
      apiCredentials.CLIENT_ID,
      apiCredentials.REDIRECT_URL,
      codes.challenge,
      apiCredentials.SCOPES
    )
    if (window.location.pathname.includes('hassio_ingress')) {
      window.location.href = authURL
    } else {
      window.open(authURL, '_self', 'noopener,noreferrer')
      // window.open(authURL, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    // Priority: 1) Zustand state, 2) electron-store (if Electron), 3) cookies

    // First check if Zustand already has the token (from SpotifyProvider)
    const storeToken = useStore.getState().spotify.spotifyAuthToken
    if (storeToken) {
      // Already have token in Zustand, no need to check elsewhere
      setspAuthenticated(true)
      return
    }

    // If Electron, check electron-store before cookies
    if (isElectron() && (window as any).api) {
      // SpotifyProvider handles electron-store loading, don't interfere
      // Just check current Zustand state
      const authState = useStore.getState().spotify.spAuthenticated
      if (authState) {
        setspAuthenticated(true)
        return
      }
    }

    // Fallback to cookies (for web builds)
    const token = cookies.get('access_token')
    if (token) {
      setspAuthenticated(true)
      setSpotifyAuthToken(token)
    } else {
      // Only set to false if we're sure there's no token anywhere
      const zustandAuth = useStore.getState().spotify.spAuthenticated
      if (!zustandAuth) {
        setspAuthenticated(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies])

  return !spAuthenticated ? (
    <>
      {authError && <Alert severity="error">{authError}</Alert>}
      <Button
        disabled={disabled || !codes}
        size="small"
        color="inherit"
        className={classes.editButton}
        onClick={() => {
          beginAuth()
        }}
      >
        <Login />
      </Button>
    </>
  ) : (
    <Button
      disabled={disabled}
      size="small"
      color="inherit"
      className={classes.editButton}
      onClick={() => {
        logoutAuth()
        if (player) player.disconnect()
        setspAuthenticated(false)
        setSpotifyAuthToken(false)
      }}
    >
      <Logout />
    </Button>
  )
}

export default SpotifyAuthButton
