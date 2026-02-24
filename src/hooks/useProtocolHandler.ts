import { useEffect } from 'react'
import Cookies from 'universal-cookie'
import useStore from '../store/useStore'
import login from '../utils/login'

const useProtocolHandler = () => {
  const protoCall = useStore((state) => state.protoCall)
  const setProtoCall = useStore((state) => state.setProtoCall)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const setCurrentTrack = useStore((state) => state.setCurrentTrack)
  const virtuals = useStore((state) => state.virtuals)
  const setEffect = useStore((state) => state.setEffect)
  const reloadTheme = useStore((state) => state.ui.reloadTheme)
  const toggleScenePLplay = useStore((state) => state.toggleScenePLplay)
  const toggleScenePLrepeat = useStore((state) => state.toggleScenePLrepeat)
  const scenePL = useStore((state) => state.scenePL)
  const scenePLactiveIndex = useStore((state) => state.scenePLactiveIndex)
  const setScenePLactiveIndex = useStore((state) => state.setScenePLactiveIndex)
  const activateScene = useStore((state) => state.activateScene)

  const handleNext = () => {
    const nextIndex = (scenePLactiveIndex + 1) % scenePL.length
    setScenePLactiveIndex(nextIndex)
    activateScene(scenePL[nextIndex])
  }

  const handlePrev = () => {
    const prevIndex = (scenePLactiveIndex - 1 + scenePL.length) % scenePL.length
    setScenePLactiveIndex(prevIndex)
    activateScene(scenePL[prevIndex])
  }

  useEffect(() => {
    if (protoCall !== '') {
      // Early exit for song protocol to avoid any side effects
      if (protoCall.startsWith('ledfx://song/')) {
        // Parse protocol URL more carefully to preserve paths with slashes
        const urlWithoutProtocol = protoCall.replace('ledfx://', '')

        // Split query string if present
        const [pathPart, queryString] = urlWithoutProtocol.split('?')
        const parts = pathPart.split('/')
        const domain = parts[0]

        if (domain === 'song' && parts.length >= 3) {
          const device = parts[1]
          // Decode song title only if it contains URL-encoded characters (macOS encodes, Windows doesn't)
          const songTitle = parts[2].includes('%') ? decodeURIComponent(parts[2]) : parts[2]
          const thumbnailPath = parts.slice(3).join('/') // Rejoin remaining parts for full path

          // Parse query parameters for position tracking (song-detector-plus)
          const queryParams = new URLSearchParams(queryString || '')
          const position = queryParams.has('position')
            ? parseFloat(queryParams.get('position')!)
            : null
          const duration = queryParams.has('duration')
            ? parseFloat(queryParams.get('duration')!)
            : null
          const playing = queryParams.get('playing') === 'true'
          const timestamp = queryParams.has('timestamp')
            ? parseFloat(queryParams.get('timestamp')!)
            : null

          console.table({
            Domain: domain,
            Action: device,
            Payload: songTitle,
            Extra: thumbnailPath || 'none',
            Position: position !== null ? `${position.toFixed(1)}s` : 'N/A',
            Duration: duration !== null ? `${duration.toFixed(1)}s` : 'N/A',
            Playing: playing,
            Timestamp: timestamp !== null ? new Date(timestamp * 1000).toLocaleTimeString() : 'N/A'
          })

          // Backend serves thumbnails from ~/.ledfx/assets/ at /assets/ endpoint
          const thumbnail = thumbnailPath ? `/assets/${decodeURIComponent(thumbnailPath)}` : null

          // Ignore "Unknown" payloads
          if (
            songTitle === 'Unknown - Unknown' ||
            songTitle === 'Unknown - No media is currently playing'
          ) {
            setProtoCall('')
            return
          }

          if (device === 'ledfxcc' && songTitle.length > 3) {
            setCurrentTrack(songTitle)
            // Store thumbnail path for album art form
            if (thumbnail) {
              useStore.getState().setThumbnailPath(thumbnail)
            }
            // Store position data if available (from song-detector-plus)
            if (position !== null || duration !== null) {
              useStore.getState().setPositionData({
                position,
                duration,
                playing,
                timestamp
              })
            }
          } else {
            const virtual = Object.keys(virtuals).find((virt) => virtuals[virt].id === device)
            if (virtual && songTitle.length > 3) {
              setEffect(
                device,
                'texter2d',
                {
                  gradient:
                    'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)',
                  option_2: false,
                  flip: false,
                  blur: 0,
                  flip_horizontal: false,
                  speed_option_1: 3,
                  resize_method: 'Fast',
                  gradient_roll: 0,
                  alpha: false,
                  value_option_1: 0.5,
                  font: 'Blade-5x8',
                  use_gradient: false,
                  diag: false,
                  test: false,
                  impulse_decay: 0.1,
                  mirror: false,
                  flip_vertical: false,
                  text_effect: 'Side Scroll',
                  multiplier: 1,
                  brightness: 1,
                  text_color: '#ff0000',
                  background_brightness: 1,
                  rotate: 0,
                  dump: false,
                  option_1: false,
                  height_percent: 50,
                  background_color: '#000000',
                  text: songTitle
                },
                true,
                true
              )
            }
          }
          setProtoCall('')
          return // Exit early for song protocol
        }
      }

      // Parse protocol URL more carefully to preserve paths with slashes
      const urlWithoutProtocol = protoCall.replace('ledfx://', '')

      // For other protocols, use the old parsing method
      const proto = urlWithoutProtocol.split('/').filter((n) => n)

      console.table({
        Domain: proto[0],
        Action: proto[1],
        Payload: proto[2],
        Extra: proto[3]
      })
      if (proto[0] === 'callback') {
        const cookies = new Cookies()
        const expDate = new Date()
        expDate.setHours(expDate.getHours() + 1)
        cookies.remove('access_token', { path: '/integrations' })
        cookies.set(
          'access_token',
          proto[1].replace('?code=', '').replace('#%2FIntegrations%3F', ''),
          {
            expires: expDate
          }
        )
      } else if (proto[0] === 'auth') {
        login(proto.join().split('redirect?')[1]).then(() => {
          window.location.reload()
        })
      } else if (proto[0] === 'command') {
        if (proto[1] === 'theme') {
          if (proto[2] === 'light') {
            window.localStorage.setItem('ledfx-theme', 'LightBw')
            reloadTheme()
          }
          if (proto[2] === 'dark') {
            window.localStorage.setItem('ledfx-theme', 'DarkBw')
            reloadTheme()
          }
          if (proto[2] === 'reset') {
            window.localStorage.setItem('ledfx-theme', 'DarkOrange')
            reloadTheme()
          }
        } else if (proto[1] === 'playlist') {
          if (proto[2] === 'next') {
            handleNext()
            showSnackbar('info', 'Next playlist')
          } else if (proto[2] === 'previous' || proto[2] === 'prev') {
            handlePrev()
            showSnackbar('info', 'Previous playlist')
          } else if (proto[2] === 'play' || proto[2] === 'stop' || proto[2] === 'pause') {
            toggleScenePLplay()
            showSnackbar('info', 'Toggle playlist')
          } else if (proto[2] === 'repeat') {
            toggleScenePLrepeat()
            showSnackbar('info', 'Pause playlist')
          }
        }
      } else if (proto[0] === 'song') {
        // This block should not be reached as song is handled above
        console.warn('Song protocol reached fallback handler - this should not happen')
      } else {
        showSnackbar('info', `External call: ${protoCall.replace('ledfx://', '')}`)
      }
      setProtoCall('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protoCall, showSnackbar, setProtoCall])
}

export default useProtocolHandler
