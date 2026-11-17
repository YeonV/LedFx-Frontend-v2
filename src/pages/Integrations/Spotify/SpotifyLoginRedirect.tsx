import { useState, useEffect } from 'react'
import { Avatar, Dialog, Stack, CircularProgress } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
// Pass the code to finishAuth, expect success/failure boolean
import { finishAuth } from '../../../utils/spotifyProxies'
import logoAsset from '../../../assets/logo.png'
import BladeIcon from '../../../components/Icons/BladeIcon/BladeIcon'
import { useNavigate } from 'react-router-dom'
import useStore from '../../../store/useStore' // Import useStore
import isElectron from 'is-electron'

const Circle = () => (
  <div
    style={{
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
      border: '3px solid #fff',
      borderRadius: '50%'
    }}
  />
)

const SpotifyLoginRedirect = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const setSpAuthenticated = useStore((state) => state.setSpAuthenticated) // Get Zustand setter
  const setSpotifyAuthToken = useStore((state) => state.setSpAuthToken) // Get Zustand setter

  useEffect(() => {
    const returnToIntegrations = () => {
      if (isElectron()) {
        navigate('/integrations', { replace: true })
      } else {
        window.location.replace(`${window.location.origin}/#/integrations`)
      }
    }
    const processAuth = async () => {
      let code: string | null = null

      // Check if we're in Electron and have a stored protocol callback
      if (isElectron()) {
        try {
          // Request the stored callback from electron-store via IPC
          const storeValueReceived = new Promise<string | null>((resolve) => {
            let resolved = false
            const handler = (...args: any[]) => {
              const [message] = args
              const [messageType, data] = message
              if (messageType === 'store-value' && data?.key === 'protocol-callback' && !resolved) {
                resolved = true
                resolve(data.value)
              }
            }
            window.api.receive('fromMain', handler)

            // Set a timeout in case no response
            setTimeout(() => {
              if (!resolved) {
                resolved = true
                resolve(null)
              }
            }, 1000)
          })

          window.api.send('toMain', {
            command: 'get-store-value',
            key: 'protocol-callback',
            defaultValue: null
          })

          const storedCallback = await storeValueReceived

          if (storedCallback && typeof storedCallback === 'string') {
            // If it's a song detector call, just clear it and ignore
            if (storedCallback.startsWith('ledfx://song/')) {
              console.log('Ignoring song detector callback:', storedCallback)
              window.api.send('toMain', {
                command: 'set-store-value',
                key: 'protocol-callback',
                value: null
              })
            } else if (storedCallback.startsWith('ledfx://')) {
              // Process legitimate auth callbacks
              console.log('Found stored protocol callback:', storedCallback)
              // Extract code from the stored URL
              const url = new URL(storedCallback.replace('ledfx://', 'https://dummy/'))
              code = url.searchParams.get('code')
              // Clear the stored callback
              window.api.send('toMain', {
                command: 'set-store-value',
                key: 'protocol-callback',
                value: null
              })
            }
          }
        } catch (e) {
          console.log('Error reading protocol callback from store:', e)
        }
      }

      // If no code from electron store, extract from URL search params
      if (!code) {
        const params = new URLSearchParams(window.location.search)
        const error = params.get('error')
        if (error) {
          setStatus('error')
          setErrorMessage(params.get('error_description') || error)
          return
        }
        code = params.get('code')
      }

      if (!code) {
        setStatus('error')
        setErrorMessage('Authorization code not found in URL.')
        return
      }

      try {
        // console.log('Attempting finishAuth with code:', code)
        // Pass code to finishAuth, expect { success: boolean, accessToken?: string }
        const authResult = await finishAuth(code)

        if (authResult.success && authResult.accessToken) {
          console.log('finishAuth successful.')
          setStatus('success')

          // Update Zustand state immediately (optional but good practice)
          setSpAuthenticated(true)
          setSpotifyAuthToken(authResult.accessToken)

          returnToIntegrations()
        } else {
          console.error('finishAuth failed or did not return tokens.')
          setStatus('error')
          setErrorMessage(authResult.error || 'Failed to exchange code for tokens.')
        }
      } catch (err: any) {
        console.error('Error during finishAuth:', err)
        setStatus('error')
        setErrorMessage(`Authentication error: ${err.message || 'Unknown error'}`)
      }
    }

    // Slight delay before starting auth processing, allows UI to render spinner
    const timer = setTimeout(processAuth, 500)

    return () => clearTimeout(timer) // Cleanup timer on unmount

    // Add dependencies carefully - navigate and setters should be stable
  }, [navigate, setSpAuthenticated, setSpotifyAuthToken])

  return (
    <Dialog open fullScreen>
      <div
        style={{
          margin: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <Stack direction="row" spacing={2} marginBottom={5} alignItems="center">
          {/* Keep your visual elements */}
          <Avatar
            sx={{
              width: 120,
              height: 120,
              backgroundColor: 'transparent',
              border: '6px solid #fff',
              padding: '1rem'
            }}
            src={logoAsset}
          />
          <Circle />
          <Circle />
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'transparent',
              border: '6px solid #fff'
            }}
          >
            {status === 'loading' && <CircularProgress color="success" />}
            {status === 'success' && <CheckCircle color="success" sx={{ fontSize: '3rem' }} />}
            {status === 'error' && (
              <BladeIcon
                name="mdi:alert-circle-outline"
                style={{ color: 'red', fontSize: '3rem' }}
              />
            )}
          </Avatar>
          <Circle />
          <Circle />
          <Avatar
            sx={{
              width: 120,
              height: 120,
              backgroundColor: 'transparent',
              border: '6px solid #fff'
            }}
          >
            <BladeIcon
              name="mdi:spotify"
              style={{ color: 'white', fontSize: '5rem', display: 'flex' }}
            />
          </Avatar>
        </Stack>
        {status === 'loading' && 'Logging in with Spotify...'}
        {status === 'success' && 'Successfully logged in with Spotify. Preparing your session...'}
        {status === 'error' && `Login Failed: ${errorMessage}`}
      </div>
    </Dialog>
  )
}

export default SpotifyLoginRedirect
