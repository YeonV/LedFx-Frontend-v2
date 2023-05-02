/* eslint-disable no-console */
import { createContext, useEffect, useMemo, useState } from 'react'

import { SpotifyState } from '../../../store/ui/SpotifyState'
import useStore from '../../../store/useStore'
import { spotifyPlay } from '../../../utils/spotifyProxies'
import { log } from '../../../utils/helpers'

export interface ControlSpotify {
  togglePlay: () => void
  stop: () => void
  // eslint-disable-next-line no-unused-vars
  setPos: (pos: number) => void
  next: () => void
  prev: () => void
  // eslint-disable-next-line no-unused-vars
  setVol: (vol: number) => void
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

export const SpotifyVolumeContext = createContext<number>(1)
export const SpotifyTriggersContext = createContext<SpotifyTrigger[]>([])

export const SpotifyControlContext = createContext<ControlSpotify>({
  togglePlay: () => undefined,
  stop: () => undefined,
  setPos: () => undefined,
  next: () => undefined,
  prev: () => undefined,
  setVol: () => undefined,
})

interface ISpotifyProviderProps {
  children: JSX.Element[] | JSX.Element
}

const SpotifyProvider = ({ children }: ISpotifyProviderProps) => {
  const [spotifyState, setSpotifyState] = useState<SpotifyState | undefined>(
    undefined
  )

  const integrations = useStore((state) => state.integrations)
  const setSpotifyDevice = useStore((state) => state.setSpDevice)
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
        player.setVolume(vol)
      },
    }),
    [player, spotifyState]
  )

  const padTo2Digits = (num: any) => {
    return num.toString().padStart(2, '0')
  }

  const getTime = (milliseconds: any) => {
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)

    seconds %= 60
    minutes %= 60
    hours %= 24

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`
  }

  useEffect(() => {
    if (!integrations.spotify?.data) return
    const triggersNew: SpotifyTrigger[] = []
    let id = 1
    const temp = integrations?.spotify?.data

    Object.keys(temp).forEach((key) => {
      const temp1 = temp[key]
      const sceneName = temp1.name
      const sceneId = key
      Object.keys(temp1).forEach((key1) => {
        if (temp1[key1].constructor === Array) {
          if (temp1[key1][0] !== spotifyState?.track_window?.current_track?.id)
            return
          triggersNew.push({
            id,
            trigger_id: `${temp1[key1][0]}-${temp1[key1][2]}`,
            songId: temp1[key1][0],
            songName: temp1[key1][1],
            position: getTime(temp1[key1][2]),
            position_ms: temp1[key1][2],
            sceneId,
            sceneName,
          })
          id += 1
        }
      })
    })
    triggersNew.sort((a, b) => a.position_ms - b.position_ms)
    setCurrentTriggers(triggersNew)
  }, [spotifyState?.track_window?.current_track?.id, sceneTriggers.length])

  useEffect(() => {
    if (!player) {
      setSpotifyState(undefined)
      return () => '' as any
    }

    if (spotifyState?.paused === true) {
      return () => '' as any
    }
    const updateState = () => {
      player.getCurrentState().then((state: any) => {
        setSpotifyState(state)
      })
      player.getVolume().then((v: number) => setVolume(v))
    }
    const update = setInterval(updateState, 1000)

    return () => clearInterval(update)
  }, [player, spotifyState?.paused])

  useEffect(() => {
    const createWebPlayer = async (token: string) => {
      // console.log(token);
      ;(window as any).onSpotifyWebPlaybackSDKReady = async () => {
        const new_player = new (window as any).Spotify.Player({
          name: 'LedFX',
          getOAuthToken: (cb: any) => {
            cb(token)
          },
        })
        setPlayer(new_player)
        if (new_player) {
          new_player.addListener('initialization_error', ({ message }: any) => {
            console.error(message)
          })
          new_player.addListener('authentication_error', ({ message }: any) => {
            console.error(message)
          })
          new_player.addListener('account_error', ({ message }: any) => {
            console.error(message)
          })
          new_player.addListener('playback_error', ({ message }: any) => {
            console.error(message)
          })
          new_player.addListener('player_state_changed', (state: any) => {
            if (state !== null) {
              setSpotifyState(state)
              new_player
                .getVolume()
                .then((v: number) => setSpotifyState({ ...state, volume: v }))
            } else {
              setSpotifyState(undefined)
            }
          })
          new_player.addListener('ready', ({ device_id }: any) => {
            setSpotifyDevice(device_id)
            spotifyPlay(device_id)
            log('successSpotify connected')
          })
          new_player.addListener('not_ready', ({ _device_id }: any) => {
            log('errorSpotify disconnected')
            // console.log('Device ID has gone offline', device_id);
          })
          await new_player.connect()
        }
      }
      const script = window.document.createElement('script')
      script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
      script.setAttribute('type', 'application/javascript')
      window.document.head.appendChild(script)
    }

    if (spotifyAuthToken && !player && !(window as any).Spotify) {
      createWebPlayer(spotifyAuthToken)
    }
    if (!spotifyAuthToken && player) {
      setPlayer(undefined)
    }
  }, [spotifyAuthToken])

  if (
    spotifyState &&
    spotifyState?.loading === false &&
    currentSceneTriggers.length > 0
  ) {
    const spotifyPos = spotifyState.position
    const nxtSceneIdx = currentSceneTriggers.findIndex(
      (x) => x.position_ms > spotifyPos
    )

    const currentSceneIdx =
      nxtSceneIdx > -1 ? nxtSceneIdx - 1 : currentSceneTriggers.length - 1

    const currentScene = currentSceneTriggers[currentSceneIdx]
    const nxtScene =
      nxtSceneIdx !== -1 ? currentSceneTriggers[nxtSceneIdx] : undefined

    if (nxtScene && nxtScene.position_ms - spotifyPos <= 100) {
      if (nxtScene.trigger_id !== lastTriggerId) {
        setLastTriggerId(nxtScene.trigger_id)
        activateSceneIn(
          nxtScene.sceneId,
          (nxtScene.position_ms - spotifyPos) / 1000
        )
      }
    } else if (currentScene && currentScene.trigger_id !== lastTriggerId) {
      setLastTriggerId(currentScene.trigger_id)
      activateScene(currentScene.sceneId)
    }
  }

  return (
    <SpotifyVolumeContext.Provider value={volume}>
      <SpotifyStateContext.Provider value={spotifyState}>
        <SpotifyTriggersContext.Provider value={currentSceneTriggers}>
          <SpotifyControlContext.Provider value={controlSp}>
            {children}
          </SpotifyControlContext.Provider>
        </SpotifyTriggersContext.Provider>
      </SpotifyStateContext.Provider>
    </SpotifyVolumeContext.Provider>
  )
}

export default SpotifyProvider
