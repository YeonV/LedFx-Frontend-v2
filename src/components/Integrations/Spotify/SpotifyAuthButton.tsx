import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
// import axios from 'axios'
import Cookies from 'universal-cookie'
import getPkce from 'oauth-pkce'
import { Login, Logout } from '@mui/icons-material'
import useStore from '../../../store/useStore'
import { logoutAuth } from '../../../utils/spotifyProxies'
import useIntegrationCardStyles from '../../../pages/Integrations/IntegrationCard/IntegrationCard.styles'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES
} from '../../../utils/spotifyConstants'

const apiCredentials = {
  CLIENT_ID: SPOTIFY_CLIENT_ID,
  // CLIENT_SECRET: '',
  REDIRECT_URL: SPOTIFY_REDIRECT_URI,
  SCOPES: SPOTIFY_SCOPES
}

const SpotifyAuthButton = ({ disabled = false }: any) => {
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
  const player = useStore((state) => state.spotify.player)
  const setspAuthenticated = useStore((state) => state.setSpAuthenticated)
  const setSpotifyAuthToken = useStore((state) => state.setSpAuthToken)
  const [codes, setCodes] = useState({})
  const cookies = new Cookies()
  const classes = useIntegrationCardStyles()
  useEffect(() => {
    getPkce(50, (_error: any, { verifier, challenge }: any) => {
      setCodes({ verifier, challenge })
    })
    if (cookies.get('access_token')) {
      setspAuthenticated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const beginAuth = () => {
    cookies.set('verifier', (codes as any).verifier)
    const authURL =
      'https://accounts.spotify.com/authorize/' +
      '?response_type=code' +
      `&client_id=${encodeURIComponent(
        apiCredentials.CLIENT_ID
      )}&scope=${encodeURIComponent(
        'user-library-read user-library-modify user-read-email user-top-read streaming user-read-private user-read-playback-state user-modify-playback-state'
      )}&redirect_uri=${encodeURIComponent(
        apiCredentials.REDIRECT_URL
      )}&code_challenge=${encodeURIComponent(
        (codes as any).challenge
      )}&code_challenge_method=S256`
    if (window.location.pathname.includes('hassio_ingress')) {
      window.location.href = authURL
    } else {
      window.open(authURL, '_self', 'noopener,noreferrer')
      // window.open(authURL, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    const token = cookies.get('access_token')
    if (token) {
      setspAuthenticated(true)
      setSpotifyAuthToken(token)
    } else {
      setspAuthenticated(false)
      // setSpotifyAuthToken(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies])

  return !spAuthenticated ? (
    <Button
      disabled={disabled}
      size="small"
      color="inherit"
      className={classes.editButton}
      onClick={() => {
        beginAuth()
      }}
    >
      <Login />
    </Button>
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
