import { createContext, useEffect, useMemo, useState, type JSX } from 'react'

// Assuming SpotifyState is the type from the Web Playback SDK's player_state_changed event
import { SpotifyState } from '../../../store/ui/SpotifyState'
import useStore from '../../../store/useStore'
import {
  // Import the *actual* data types returned on success (or define them here/centrally)
  // SpotifyDevices, // Assuming this is defined in spotifyProxies or imported
  // SpotifyPlayerState,
  logoutAuth, // Assuming this is defined in spotifyProxies or imported
  spotifyCurrentTime,
  spotifyGetDevices
  // spotifyPlay
} from '../../../utils/spotifyProxies'
import { getTime, log } from '../../../utils/helpers'
// Keep SpState if it's genuinely different or used elsewhere, but SpotifyPlayerState is likely what spotifyCurrentTime returns
import { SpState, spDevice } from '../../../store/ui/SpState'

// --- Interfaces & Contexts (Keep as is) ---

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

export const SpotifyStateContext = createContext<SpotifyState | undefined>(
  undefined
)
// Consider using SpotifyPlayerState here if SpState is identical
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
  // State from Web Playback SDK event listener
  const [spotifyState, setSpotifyState] = useState<SpotifyState | undefined>(
    undefined
  )
  // State specifically from polling /me/player/currently-playing
  const [spState, setSpState] = useState<SpState | undefined>(undefined)

  const integrations = useStore((state) => state.integrations)
  const setSpotifyDevice = useStore((state) => state.setSpDevice)
  // Ensure the state setter expects the correct type (spDevice[] likely)
  const setSpDevices = useStore((state) => state.setSpDevices)
  const setPlayer = useStore((state) => state.setPlayer)
  const player = useStore((state) => state.spotify.player)
  const activateScene = useStore((state) => state.activateScene)
  const activateSceneIn = useStore((state) => state.activateSceneIn)
  const sceneTriggers = useStore((state) => state.spotify.spTriggersList)
  const [volume, setVolume] = useState<number>(1)
  const spotifyAuthToken = useStore((state) => state.spotify.spotifyAuthToken)
  const [currentSceneTriggers, setCurrentTriggers] = useState<SpotifyTrigger[]>(
    []
  )
  const [lastTriggerId, setLastTriggerId] = useState('')

  const controlSp: ControlSpotify = useMemo(
    () => ({
      togglePlay: () => {
        if (spotifyState)
          setSpotifyState({ ...spotifyState, paused: !spotifyState.paused })
        player?.togglePlay()
      },
      stop: () => player?.stop(),
      setPos: (pos) => player?.seek(pos),
      next: () => player?.nextTrack(),
      prev: () => {
        player?.previousTrack()
      },
      setVol: (vol) => {
        setVolume(vol)
        player?.setVolume(vol) // Use optional chaining
      }
    }),
    [player, spotifyState]
  )

  // Effect for processing triggers based on current track
  useEffect(() => {
    // Guard clauses
    if (!integrations.spotify?.active || !integrations.spotify?.data) {
      setCurrentTriggers([]) // Clear triggers if inactive or no data
      return
    }

    const triggersNew: SpotifyTrigger[] = []
    let id = 1
    const temp = integrations.spotify.data
    // Determine current track ID from either SDK state or polled state
    const currentTrackId =
      spotifyState?.track_window?.current_track?.id || spState?.item?.id

    if (temp && currentTrackId) {
      // Ensure we have a track ID
      Object.keys(temp).forEach((sceneId) => {
        // Use descriptive variable name
        const sceneData = temp[sceneId]
        const sceneName = sceneData?.name
        // Iterate through potential trigger arrays within the scene data
        Object.keys(sceneData).forEach((key) => {
          const triggerData = sceneData[key]
          // Check if it's an array and matches the current track ID
          if (
            Array.isArray(triggerData) &&
            triggerData.length >= 3 && // Ensure array has expected elements
            triggerData[0] === currentTrackId // Check track ID match
          ) {
            triggersNew.push({
              id: id++,
              trigger_id: `${triggerData[0]}-${triggerData[2]}`, // songId-position_ms
              songId: triggerData[0],
              songName: triggerData[1] || 'Unknown Song', // Handle potential missing name
              position: getTime(triggerData[2]),
              position_ms: triggerData[2],
              sceneId,
              sceneName: sceneName || 'Unknown Scene' // Handle potential missing name
            })
          }
        })
      })
    }

    triggersNew.sort((a, b) => a.position_ms - b.position_ms)
    setCurrentTriggers(triggersNew)
    // Dependencies: update when track changes (via either state) or when triggers list changes
  }, [
    integrations.spotify?.active,
    integrations.spotify?.data, // React if trigger data changes
    spotifyState?.track_window?.current_track?.id,
    spState?.item?.id,
    sceneTriggers // If sceneTriggers is the raw list from store
  ])

  // Effect for polling Spotify state when player is active but potentially paused
  useEffect(() => {
    // Guard clauses
    if (
      !integrations.spotify?.active ||
      integrations.spotify.status !== 1 || // Check for explicit active status (assuming 1 is active)
      !spotifyAuthToken || // Check the token state directly
      !player // Don't poll if player doesn't exist
    ) {
      // Consider clearing state if player/integration becomes inactive
      // setSpState(undefined);
      // setSpDevices([]);
      return // Exit if no player or integration is inactive
    }

    // Don't poll if Web Playback SDK is actively providing state (unless maybe if SDK state is null?)
    // This might need refinement based on how spotifyState behaves when SDK disconnects.
    // For now, let's assume SDK state (spotifyState) takes precedence if available.
    // We poll mainly to get state when the SDK *isn't* controlling playback (e.g., user controls via another device)
    // or maybe when paused?

    let intervalId: NodeJS.Timeout | undefined

    const updateState = () => {
      // --- Get Devices ---
      spotifyGetDevices().then((s) => {
        if (typeof s === 'string') {
          // Error case
          console.error('SpotifyProvider: Failed to get devices:', s)
          // Optionally clear devices in Zustand store on error
          // setSpDevices([]);
        } else {
          // Success case: s is SpotifyDevices object
          // Ensure the type s.devices matches what setSpDevices expects (spDevice[])
          // You might need to map or ensure types are compatible
          setSpDevices(s.devices as spDevice[]) // Assuming structural compatibility or mapping needed
        }
      })

      // --- Get Current Playback State (if not provided reliably by SDK state) ---
      // Only poll if the SDK state doesn't seem active/current?
      // This logic might need adjustment depending on when you want to trust polled vs SDK state.
      // Example: Poll if SDK state is null or paused?
      // if (!spotifyState || spotifyState.paused) {
      if (!spotifyState?.track_window?.current_track?.id) {
        // Example: poll if SDK state doesn't have track ID
        spotifyCurrentTime().then((s) => {
          if (typeof s === 'string') {
            // Error case
            console.error(
              'SpotifyProvider: Failed to get current time/state:',
              s
            )
            // Optionally clear spState on error
            // setSpState(undefined);
          } else {
            // Success case: s is SpotifyPlayerState object
            // Ensure SpotifyPlayerState is compatible with SpState
            setSpState(s as SpState) // Assuming structural compatibility
          }
        })
      }

      // Update from Player SDK directly (if player exists) - less reliable than event listener
      // player.getCurrentState().then((state: any) => {
      //   if (state) { setSpotifyState(state); }
      // });
    }

    // Initial call
    updateState()
    // Set up interval
    // eslint-disable-next-line prefer-const
    intervalId = setInterval(updateState, 1000) // Poll every second Adjust as needed.

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [
    spotifyAuthToken,
    player,
    integrations.spotify?.active,
    integrations.spotify?.status,
    setSpDevices,
    setSpState,
    spotifyState // Re-run if SDK state changes, to decide whether to poll currently-playing
  ])

  // Effect for initializing the Web Playback SDK
  useEffect(() => {
    // Guard clauses
    if (
      !integrations.spotify?.active ||
      integrations.spotify.status === 0 ||
      !spotifyAuthToken ||
      player ||
      (window as any).Spotify
    ) {
      // Don't initialize if:
      // - Integration inactive
      // - No auth token
      // - Player already exists
      // - SDK script already loaded (basic check)
      return
    }

    // log('infoSpotify', 'Attempting to initialize Spotify Web Playback SDK...')

    const createWebPlayer = (token: string) => {
      // --- SDK Ready Callback ---
      ;(window as any).onSpotifyWebPlaybackSDKReady = () => {
        try {
          const new_player = new (window as any).Spotify.Player({
            name: 'LedFX Web Player', // Give it a distinct name
            getOAuthToken: (cb: (token: string) => void) => {
              // Provide the current token
              // TODO: Consider adding token refresh logic here if a call fails later
              cb(token)
            },
            volume: 0.5 // Initial volume (optional)
          })

          // --- SDK Event Listeners ---
          new_player.addListener(
            'initialization_error',
            ({ message }: { message: string }) => {
              console.error('Spotify SDK Init Error:', message)
              // Maybe clear player state here?
              setPlayer(undefined)
            }
          )
          new_player.addListener(
            'authentication_error',
            ({ message }: { message: string }) => {
              console.error('Spotify SDK Auth Error:', message)
              // This often means the token is invalid/expired. Trigger logout/refresh?
              logoutAuth() // Example: Force logout on auth error
              setPlayer(undefined)
            }
          )
          new_player.addListener(
            'account_error',
            ({ message }: { message: string }) => {
              if (message.includes('premium')) {
                // More robust check
                log('successSpotify', 'no premium. using free')
                // Handle free user state - maybe disable playback controls?
              } else {
                console.error('Spotify SDK Account Error:', message)
              }
              // Don't necessarily clear player - it might still report state
            }
          )
          new_player.addListener(
            'playback_error',
            ({ message }: { message: string }) => {
              console.error('Spotify SDK Playback Error:', message)
            }
          )
          new_player.addListener(
            'player_state_changed',
            (state: SpotifyState | null) => {
              log('infoSpotify', 'SDK player_state_changed:', state)
              if (state) {
                // Update main state from SDK
                setSpotifyState(state)
                // Update volume separately if needed, SDK might not include it reliably
                new_player.getVolume().then((v: number) => setVolume(v))
                // Clear the polled state if SDK is active?
                setSpState(undefined)
              } else {
                // State is null when player disconnects or potentially on errors
                log('infoSpotify', 'SDK player state is null.')
                setSpotifyState(undefined)
                // Consider polling again if SDK state becomes null
              }
            }
          )
          new_player.addListener(
            'ready',
            ({ device_id }: { device_id: string }) => {
              log(
                'successSpotify',
                `Spotify SDK Player ready with Device ID: ${device_id}`
              )
              setSpotifyDevice(device_id)
              // Don't automatically play here, let user control
              // spotifyPlay(device_id);
            }
          )
          new_player.addListener(
            'not_ready',
            ({ device_id }: { device_id: string }) => {
              log(
                'errorSpotify',
                `Spotify SDK Player disconnected: ${device_id}`
              )
              setSpotifyDevice('') // Clear the device ID
              setSpotifyState(undefined) // Clear SDK state
            }
          )

          // --- Connect Player ---
          new_player
            .connect()
            .then((success: boolean) => {
              if (success) {
                log('successSpotify', 'connected. check premium')
                setPlayer(new_player) // Set player in state *after* successful connection
              } else {
                log('errorSpotify', 'Spotify SDK Player connection failed.')
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
      } // End of onSpotifyWebPlaybackSDKReady

      // --- Load SDK Script ---
      if (
        !document.querySelector(
          'script[src="https://sdk.scdn.co/spotify-player.js"]'
        )
      ) {
        // log('infoSpotify', 'Loading Spotify SDK script...')
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true
        document.body.appendChild(script)
      } else {
        // If script exists but SDK not ready, maybe trigger callback manually?
        if ((window as any).onSpotifyWebPlaybackSDKReady) {
          log(
            'infoSpotify',
            'SDK script already loaded, triggering ready callback.'
          )
          ;(window as any).onSpotifyWebPlaybackSDKReady()
        }
      }
    }

    // Call the function to init
    createWebPlayer(spotifyAuthToken)

    // Cleanup: potentially disconnect player? SDK script removal is tricky.
    // return () => {
    //   player?.disconnect();
    // };
  }, [
    integrations.spotify?.active,
    integrations.spotify?.status,
    spotifyAuthToken,
    player, // React if player changes (e.g., gets cleared)
    setPlayer,
    setSpotifyDevice // Include setters if used in cleanup
  ])

  // Effect for activating scenes based on playback position and triggers
  useEffect(() => {
    // Guard clause
    if (currentSceneTriggers.length === 0) {
      return
    }

    // Determine current position (prefer SDK state if available and playing)
    const spotifyPos = spotifyState?.position ?? spState?.progress_ms ?? 0 // Use SDK position if available

    // Find the *next* trigger whose time is greater than the current position
    const nextTriggerIndex = currentSceneTriggers.findIndex(
      (trigger) => trigger.position_ms > spotifyPos
    )

    let activeTrigger: SpotifyTrigger | undefined

    if (nextTriggerIndex === 0) {
      // Before the first trigger
      activeTrigger = undefined
    } else if (nextTriggerIndex > 0) {
      // Between triggers, the "current" one is the one before the next one
      activeTrigger = currentSceneTriggers[nextTriggerIndex - 1]
    } else {
      // After the last trigger (findIndex returned -1)
      activeTrigger = currentSceneTriggers[currentSceneTriggers.length - 1]
    }

    // Find the trigger whose range contains the current position
    const currentScene = activeTrigger // Use the already calculated activeTrigger

    // Find the next trigger after the current position
    const nxtScene =
      nextTriggerIndex !== -1
        ? currentSceneTriggers[nextTriggerIndex]
        : undefined

    // Previous logic to activate scene *in* advance or *now*
    if (
      nxtScene &&
      nxtScene.position_ms - spotifyPos <= 100 &&
      spotifyPos < nxtScene.position_ms
    ) {
      // Check we are actually BEFORE the next scene time
      // Only activate IN advance if the next trigger is different from the last activated ID
      if (nxtScene.trigger_id !== lastTriggerId) {
        log(
          'infoSpotify',
          `Pre-activating next scene: ${nxtScene.sceneName} in ${nxtScene.position_ms - spotifyPos}ms`
        )
        setLastTriggerId(nxtScene.trigger_id) // Mark the *next* scene as the one being activated
        activateSceneIn(
          nxtScene.sceneId,
          (nxtScene.position_ms - spotifyPos) / 1000 // Delay in seconds
        )
      }
    } else if (currentScene && currentScene.trigger_id !== lastTriggerId) {
      // Activate the current scene if we are not pre-activating the next one
      log('infoSpotify', `Activating current scene: ${currentScene.sceneName}`)
      setLastTriggerId(currentScene.trigger_id)
      activateScene(currentScene.sceneId)
    } else if (!currentScene && lastTriggerId !== '') {
      // Handle case where playback is before the first trigger
      setLastTriggerId('')
      // Maybe deactivate scenes?
    }

    // This logic activates the scene *immediately* when its time range starts.
    // The previous logic with `activateSceneIn` seems more complex and might be harder to manage.
  }, [
    currentSceneTriggers,
    spotifyState?.position, // React to SDK position changes
    spState?.progress_ms, // React to polled position changes
    activateScene,
    lastTriggerId
  ])

  // --- Render Context Providers ---
  // Only provide context if the integration is active?
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
    // Render children directly if integration is not active
    children
  )
}

export default SpotifyProvider
