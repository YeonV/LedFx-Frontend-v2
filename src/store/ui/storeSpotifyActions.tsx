import { produce } from 'immer'
import { SpotifyState } from './SpotifyState'
import type { IStore } from '../useStore'
import { spDevice } from './SpState'

const storeSpotifyActions = (set: any) => ({
  setSpotifyState: (spState: SpotifyState) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyState = spState
      }),
      false,
      'spotify/setSpotifyState'
    ),
  setSpEmbedUrl: (url: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyEmbedUrl = url
      }),
      false,
      'spotify/setSpotifyEmbedUrl'
    ),
  setSpAuthToken: (token: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyAuthToken = token
      }),
      false,
      'spotify/setSpotifyAuthToken'
    ),
  setPlayer: (player: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.player = player
      }),
      false,
      'spotify/setPlayer'
    ),
  getVolume: null as any,
  setGetVolume: (val: any) =>
    set(
      produce((state: IStore) => {
        state.getVolume = val
      }),
      false,
      'spotify/setPlayer'
    ),
  setSwSize: (x: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.swSize = x || 'small'
      }),
      false,
      'spotify/setSwSize'
    ),
  setSwX: (x: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.swX = x || 50
      }),
      false,
      'spotify/setSwX'
    ),
  setSwY: (y: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.swY = y || 200
      }),
      false,
      'spotify/setSwY'
    ),
  setSwWidth: (width: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.swWidth = width
      }),
      false,
      'spotify/setSwWidth'
    ),
  setSpVol: (vol: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyVol = vol
      }),
      false,
      'spotify/setSpotifyVol'
    ),
  setSpPos: (pos: any) => {
    set(
      produce((state: IStore) => {
        state.spotify.spotifyPos = pos
      }),
      false,
      'spotify/setSpotifyPos'
    )
  },
  setSpAuthenticated: (val: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.spAuthenticated = val
      }),
      false,
      'spotify/setSpAuthenticated'
    ),
  setSpData: (type: string, data: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyData[type] = data
      }),
      false,
      'spotify/setSpotifyData'
    ),
  setSpDevice: (id: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyDevice = id
      }),
      false,
      'spotify/setSpotifyDevice'
    ),
  setSpDevices: (devices: spDevice[]) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyDevices = devices
      }),
      false,
      'spotify/setSpotifyDevice'
    ),
  setSpNetworkTime: async (delay: number) => {
    set(
      produce((state: IStore) => {
        state.spotify.spNetworkTime = delay
      }),
      false,
      'spotify/setDelay'
    )
  },
  setSpActTriggers: async (ids: string[]) => {
    set(
      produce((state: IStore) => {
        state.spotify.spActTriggers = ids
      }),
      false,
      'spotify/setTriggers'
    )
  },
  removeSpActTriggers: async (id: string) => {
    set(
      produce((state: IStore) => {
        state.spotify.spActTriggers = state.spotify.spActTriggers.filter((f: any) => f.id !== id)
      }),
      false,
      'spotify/delTriggers'
    )
  },
  addToSpTriggerList: async (newTrigger: any, type: string) => {
    switch (type) {
      case 'create':
        set(
          produce((state: IStore) => {
            state.spotify.spTriggersList = [...newTrigger]
          }),
          false,
          'spotify/addToTriggerList'
        )
        break
      case 'update':
        set(
          produce((state: IStore) => {
            // state.spotify.spTriggersList = [
            //   ...state.spotify.spTriggersList,
            //   newTrigger,
            // ];
            state.spotify.spTriggersList = state.spotify.spTriggersList.map((each: any) =>
              each.id === newTrigger.id ? newTrigger : each
            )
          }),
          false,
          'spotify/addToTriggerList'
        )
        break
    }
  },
  setPlaylist: (playerlist: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.playlist = playerlist
      }),
      false,
      'spotify/setPlayer'
    ),
  setMe: (me: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.me = me
      }),
      false,
      'spotify/setMe'
    ),
  setCurrentTrack: (track: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.currentTrack = track
      }),
      false,
      'spotify/setCurrentTrack'
    ),
  setSendSpotifyTrack: (val: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.sendSpotifyTrack = val
      }),
      false,
      'spotify/setSendSpotifyTrack'
    ),
  setSpTexter: (texter: any) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter = {
          ...state.spotify.spotifyTexter,
          ...texter
        }
      }),
      false,
      'spotify/setSpTexter'
    ),
  setSpTexterTextColor: (value: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.text_color = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterFallback: (value: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.fallback = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterBackground: (value: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.background_color = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterFlipVertical: (value: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.flip_vertical = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterFlipHorizontal: (value: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.flip_horizontal = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterGradient: (value: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.gradient = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterUseGradient: (value: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.use_gradient = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterAlpha: (value: boolean) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.alpha = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterGradientRoll: (value: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.gradient_roll = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterRotate: (value: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.rotate = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterHeightPercent: (value: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.height_percent = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterBrightness: (value: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.brightness = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterBackgroundBrightness: (value: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.background_brightness = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterSpeed: (value: number) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.speed_option_1 = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterFont: (value: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.font = value
      }),
      false,
      'spotify/setSpTexterValue'
    ),
  setSpTexterTextEffect: (value: string) =>
    set(
      produce((state: IStore) => {
        state.spotify.spotifyTexter.text_effect = value
      }),
      false,
      'spotify/setSpTexterValue'
    )
})

export default storeSpotifyActions
