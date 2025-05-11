import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback, // Import useCallback
  type JSX
} from 'react'

// Assuming SpotifyState is the type from the Web Playback SDK's player_state_changed event
import { SpotifyState } from '../../../store/ui/SpotifyState'
import useStore from '../../../store/useStore'
import {
  logoutAuth,
  refreshAuth,
  spotifyCurrentTime,
  spotifyGetDevices
} from '../../../utils/spotifyProxies'
import { getTime } from '../../../utils/helpers'
import { SpState, spDevice } from '../../../store/ui/SpState'
import { log } from '../../../utils/log'

// --- Interfaces & Contexts ---

export interface ControlSpotify {
  togglePlay: () => void
  stop: () => void
  setPos: (_pos: number) => void
  next: () => void
  prev: () => void
  setVol: (_vol: number) => void
}

interface SpotifyTrigger {
  id: number
  trigger_id: string
  songId: string
  songName: string
  position: string
  position_ms: number
  sceneId: string
  sceneName: string
}

export const SpotifyStateContext = createContext<SpotifyState | undefined>(undefined)
export const SpStateContext = createContext<SpState | undefined>(undefined)
export const SpotifyVolumeContext = createContext<number>(1)
export const SpotifyTriggersContext = createContext<SpotifyTrigger[]>([])
export const SpotifyControlContext = createContext<ControlSpotify>({
  togglePlay: () => undefined,
  stop: () => undefined,
  setPos: () => undefined,
  next: () => undefined,
  prev: () => undefined,
  setVol: () => undefined
})

interface ISpotifyProviderProps {
  children: JSX.Element[] | JSX.Element
}

// --- Component Implementation ---

const SpotifyProvider = ({ children }: ISpotifyProviderProps) => {
  // --- State ---
  const [spotifyState, setSpotifyState] = useState<SpotifyState | undefined>(undefined)
  const [spState, setSpState] = useState<SpState | undefined>(undefined)
  const [volume, setVolume] = useState<number>(1)
  const [currentSceneTriggers, setCurrentTriggers] = useState<SpotifyTrigger[]>([])
  const [lastTriggerId, setLastTriggerId] = useState('')
  const [isPollingActive, setIsPollingActive] = useState(false)

  // --- Refs ---
  const isRefreshingToken = useRef(false)
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

  // --- Zustand Store ---
  const integrations = useStore((state) => state.integrations)
  const setSpotifyDevice = useStore((state) => state.setSpDevice)
  const setSpDevices = useStore((state) => state.setSpDevices)
  const setPlayer = useStore((state) => state.setPlayer)
  const player = useStore((state) => state.spotify.player)
  const activateScene = useStore((state) => state.activateScene)
  const activateSceneIn = useStore((state) => state.activateSceneIn)
  const sceneTriggers = useStore((state) => state.spotify.spTriggersList)
  const spotifyAuthToken = useStore((state) => state.spotify.spotifyAuthToken)
  const setSpotifyAuthToken = useStore((state) => state.setSpAuthToken)
  const setSpAuthenticated = useStore((state) => state.setSpAuthenticated)

  // --- Memoized Controls ---
  const controlSp: ControlSpotify = useMemo(
    () => ({
      togglePlay: () => {
        if (spotifyState)
          setSpotifyState((prev) => (prev ? { ...prev, paused: !prev.paused } : undefined))
        player?.togglePlay()
      },
      stop: () => player?.stop(),
      setPos: (pos) => player?.seek(pos),
      next: () => player?.nextTrack(),
      prev: () => player?.previousTrack(),
      setVol: (vol) => {
        setVolume(vol)
        player?.setVolume(vol)
      }
    }),
    [player, spotifyState]
  )

  // --- Effect for Triggers ---
  useEffect(() => {
    if (!integrations.spotify?.active || !integrations.spotify?.data) {
      setCurrentTriggers([])
      return
    }
    const triggersNew: SpotifyTrigger[] = []
    let id = 1
    const temp = integrations.spotify.data
    const currentTrackId = spotifyState?.track_window?.current_track?.id || spState?.item?.id
    if (temp && currentTrackId) {
      Object.keys(temp).forEach((sceneId) => {
        const sceneData = temp[sceneId]
        const sceneName = sceneData?.name
        Object.keys(sceneData).forEach((key) => {
          const triggerData = sceneData[key]
          if (
            Array.isArray(triggerData) &&
            triggerData.length >= 3 &&
            triggerData[0] === currentTrackId
          ) {
            triggersNew.push({
              id: id++,
              trigger_id: `${triggerData[0]}-${triggerData[2]}`,
              songId: triggerData[0],
              songName: triggerData[1] || 'Unknown Song',
              position: getTime(triggerData[2]),
              position_ms: triggerData[2],
              sceneId,
              sceneName: sceneName || 'Unknown Scene'
            })
          }
        })
      })
    }
    triggersNew.sort((a, b) => a.position_ms - b.position_ms)
    setCurrentTriggers(triggersNew)
  }, [
    integrations.spotify?.active,
    integrations.spotify?.data,
    spotifyState?.track_window?.current_track?.id,
    spState?.item?.id,
    sceneTriggers
  ])

  // --- Memoized Refresh Function ---
  const attemptTokenRefresh = useCallback(async (): Promise<boolean> => {
    if (isRefreshingToken.current) {
      log.info('Spotify', 'Token refresh already in progress.')
      log.purple('Spotify', 'Token refresh already in progress.')
      return false
    }
    isRefreshingToken.current = true

    log.purple('Spotify', 'Attempting token refresh...')
    const result = await refreshAuth()
    if (result.success && result.newAccessToken) {
      log.purple('successSpotify', 'Token refresh successful.')
      setSpotifyAuthToken(result.newAccessToken)
      setSpAuthenticated(true)
      isRefreshingToken.current = false
      return true
    } else {
      log.error.purple('Spotify', 'Token refresh failed:', result.error)
      if (intervalIdRef.current) {
        log.purple('Spotify', 'Clearing polling interval due to refresh failure.')
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      setIsPollingActive(false)
      if (player) {
        player.disconnect()
        setPlayer(undefined)
      }
      logoutAuth()
      setSpotifyAuthToken(null)
      setSpAuthenticated(false)
      isRefreshingToken.current = false
      return false
    }
  }, [player, setPlayer, setSpAuthenticated, setSpotifyAuthToken, setIsPollingActive]) // Dependencies for useCallback

  // --- Effect for Polling ---
  useEffect(() => {
    const shouldPoll = !!(
      integrations.spotify?.active &&
      integrations.spotify.status === 1 &&
      spotifyAuthToken &&
      true
    )
    if (shouldPoll !== isPollingActive) {
      log.purple('Spotify', `Setting polling active state to: ${shouldPoll}`)
      setIsPollingActive(shouldPoll)
    }
    if (!shouldPoll) {
      if (intervalIdRef.current) {
        log.purple('Spotify', 'Polling useEffect: Conditions no longer met, clearing interval.')
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      return
    }
    log.purple('Spotify', 'Polling useEffect: Starting polling interval...')
    const updateState = async () => {
      if (!isPollingActive || isRefreshingToken.current) return
      let refreshAttemptedThisCycle = false
      const devicesResult = await spotifyGetDevices()
      if (typeof devicesResult === 'string') {
        if (
          devicesResult.includes('Unauthorized') ||
          devicesResult.includes('Missing Access Token')
        ) {
          if (!refreshAttemptedThisCycle) {
            refreshAttemptedThisCycle = true
            await attemptTokenRefresh()
            return
          }
        }
      } else {
        setSpDevices(devicesResult.devices as spDevice[])
      }
      if (
        (!spotifyState?.track_window?.current_track?.id || spotifyState?.paused) &&
        !refreshAttemptedThisCycle
      ) {
        const timeResult = await spotifyCurrentTime()
        if (typeof timeResult === 'string') {
          if (timeResult.includes('Unauthorized') || timeResult.includes('Missing Access Token')) {
            if (!refreshAttemptedThisCycle) {
              refreshAttemptedThisCycle = true
              await attemptTokenRefresh()
            }
          }
        } else {
          setSpState(timeResult as SpState)
        }
      }
    }
    if (isPollingActive) {
      updateState()
    }
    intervalIdRef.current = setInterval(updateState, 1000)
    return () => {
      log.purple(
        'Spotify',
        'Polling useEffect: Cleanup running, clearing interval ID:',
        intervalIdRef.current
      )
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
    }
  }, [
    spotifyAuthToken,
    integrations.spotify?.active,
    integrations.spotify?.status,
    player,
    setSpDevices,
    setSpState,
    attemptTokenRefresh,
    isPollingActive,
    spotifyState
  ])

  // --- Effect for SDK Initialization ---
  useEffect(() => {
    if (
      !integrations.spotify?.active ||
      integrations.spotify.status !== 1 ||
      !spotifyAuthToken ||
      player ||
      (window as any).Spotify
    ) {
      return
    }
    const tokenToUse = spotifyAuthToken

    const createWebPlayer = (tokenArg: string) => {
      // Changed parameter name
      if ((window as any).onSpotifyWebPlaybackSDKReady) {
        log.purple('Spotify', 'onSpotifyWebPlaybackSDKReady already exists, triggering manually.')
        ;(window as any).onSpotifyWebPlaybackSDKReady()
        return
      }

      ;(window as any).onSpotifyWebPlaybackSDKReady = () => {
        log.purple('Spotify', 'Spotify SDK is ready.')
        if (!(window as any).Spotify) {
          console.error('Spotify SDK Ready callback fired, but window.Spotify is not defined!')
          return
        }
        try {
          const new_player = new (window as any).Spotify.Player({
            name: 'LedFX Web Player',
            // eslint-disable-next-line no-unused-vars
            getOAuthToken: (cb: (accessToken: string) => void) => {
              log.purple('Spotify', 'getOAuthToken called by SDK, providing token.')
              cb(tokenArg) // Use the token passed into createWebPlayer
            },
            // --- End Fix ---
            volume: 0.5
          })
          // Add Listeners
          new_player.addListener('initialization_error', ({ message }: { message: string }) => {
            console.error('Spotify SDK Init Error:', message)
            setPlayer(undefined)
          })
          new_player.addListener(
            'authentication_error',
            async ({ message }: { message: string }) => {
              console.error('Spotify SDK Auth Error:', message)
              const refreshed = await attemptTokenRefresh()
              if (refreshed) {
                log.purple(
                  'Spotify',
                  'SDK Auth Error: Refresh successful, disconnecting SDK to re-init.'
                )
                player?.disconnect()
                setPlayer(undefined)
              } else {
                setPlayer(undefined)
              }
            }
          )
          new_player.addListener('account_error', ({ message }: { message: string }) => {
            console.error('Spotify SDK Account Error:', message)
            if (message.includes('premium')) {
              log.green('Spotify', 'no premium? no problem! using free')
            }
          })
          new_player.addListener('playback_error', ({ message }: { message: string }) => {
            console.error('Spotify SDK Playback Error:', message)
          })
          new_player.addListener('player_state_changed', (state: SpotifyState | null) => {
            if (state) {
              setSpotifyState(state)
              new_player.getVolume().then((v: number) => setVolume(v))
              setSpState(undefined)
            } else {
              log.purple('Spotify', 'SDK player state is null.')
              setSpotifyState(undefined)
            }
          })
          new_player.addListener('ready', ({ device_id }: { device_id: string }) => {
            log.purple('Spotify', `Spotify SDK Player ready with Device ID: ${device_id}`)
            setSpotifyDevice(device_id)
          })
          new_player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
            log.error.purple('Spotify', `Spotify SDK Player disconnected: ${device_id}`)
            setSpotifyDevice('')
            setSpotifyState(undefined)
          })
          // Connect
          new_player
            .connect()
            .then((success: boolean) => {
              if (success) {
                log.green('Spotify', 'connected. checking premium...')
                setPlayer(new_player)
              } else {
                log.error.purple('Spotify', 'Spotify SDK Player connection failed.')
                setPlayer(undefined)
              }
            })
            .catch((err: Error) => {
              console.error('Error connecting Spotify SDK Player:', err)
              setPlayer(undefined)
            })
        } catch (error) {
          console.error('Error creating Spotify Player instance:', error)
          setPlayer(undefined)
        }
      } // End onSpotifyWebPlaybackSDKReady
      // Load Script
      if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
        log.purple('Spotify', 'Loading Spotify SDK script...')
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true
        document.body.appendChild(script)
        script.onerror = () => {
          console.error('Failed to load Spotify SDK script.')
        }
      } else if ((window as any).Spotify) {
        log.purple('Spotify', 'SDK script already loaded, triggering ready callback manually.')
        ;(window as any).onSpotifyWebPlaybackSDKReady()
      } else {
        log.warn.purple('Spotify', 'SDK script tag found, but window.Spotify not defined yet.')
      }
    } // End createWebPlayer

    createWebPlayer(tokenToUse) // Call init function

    return () => {
      log.purple('Spotify', 'Cleanup for SDK Init Effect running.')
      ;(window as any).onSpotifyWebPlaybackSDKReady = undefined
    }
  }, [
    integrations.spotify?.active,
    integrations.spotify?.status,
    spotifyAuthToken,
    player,
    attemptTokenRefresh,
    setPlayer,
    setSpotifyDevice
  ]) // Removed setters not directly used by effect body

  // --- Effect for Activating Scene Triggers ---
  useEffect(() => {
    if (currentSceneTriggers.length === 0) return
    const spotifyPos = spotifyState?.position ?? spState?.progress_ms ?? 0
    const nextTriggerIndex = currentSceneTriggers.findIndex(
      (trigger) => trigger.position_ms > spotifyPos
    )
    let activeTrigger: SpotifyTrigger | undefined
    if (nextTriggerIndex === 0) {
      activeTrigger = undefined
    } else if (nextTriggerIndex > 0) {
      activeTrigger = currentSceneTriggers[nextTriggerIndex - 1]
    } else {
      activeTrigger = currentSceneTriggers[currentSceneTriggers.length - 1]
    }
    const currentScene = activeTrigger
    const nxtScene = nextTriggerIndex !== -1 ? currentSceneTriggers[nextTriggerIndex] : undefined
    if (nxtScene && nxtScene.position_ms - spotifyPos <= 100 && spotifyPos < nxtScene.position_ms) {
      if (nxtScene.trigger_id !== lastTriggerId) {
        setLastTriggerId(nxtScene.trigger_id)
        activateSceneIn(nxtScene.sceneId, (nxtScene.position_ms - spotifyPos) / 1000)
      }
    } else if (currentScene && currentScene.trigger_id !== lastTriggerId) {
      setLastTriggerId(currentScene.trigger_id)
      activateScene(currentScene.sceneId)
    } else if (!currentScene && lastTriggerId !== '') {
      setLastTriggerId('')
    }
  }, [
    currentSceneTriggers,
    spotifyState?.position,
    spState?.progress_ms,
    activateScene,
    activateSceneIn,
    lastTriggerId
  ])

  // --- Render ---
  return integrations.spotify?.active ? (
    <SpotifyVolumeContext.Provider value={volume}>
      <SpStateContext.Provider value={spState}>
        <SpotifyStateContext.Provider value={spotifyState}>
          <SpotifyTriggersContext.Provider value={currentSceneTriggers}>
            <SpotifyControlContext.Provider value={controlSp}>
              {children}
            </SpotifyControlContext.Provider>
          </SpotifyTriggersContext.Provider>
        </SpotifyStateContext.Provider>
      </SpStateContext.Provider>
    </SpotifyVolumeContext.Provider>
  ) : (
    children
  )
}

export default SpotifyProvider
