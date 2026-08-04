import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

/**
 * Backend Now Playing configuration.
 *
 * Config only, deliberately: the track itself (title, artist, position,
 * artwork path) already reaches the frontend through the `song_detected`
 * websocket event, and keeping a second copy here would give two sources of
 * truth for "what is playing" that drift apart - this one a snapshot from the
 * last fetch, the other live.
 *
 * The one exception is the extracted gradients, which the core computes from
 * the artwork and the browser cannot reproduce.
 */

export interface NowPlayingGradientConfig {
  enabled: boolean
  variant: string
  virtual_ids: string[]
}

export interface NowPlayingTrackTextConfig {
  enabled: boolean
  duration: number
  virtual_ids: string[]
  preset: string
}

export interface NowPlayingAlbumArtConfig {
  enabled: boolean
  duration: number
  virtual_ids: string[]
}

export interface NowPlayingConfig {
  gradient: NowPlayingGradientConfig
  track_text: NowPlayingTrackTextConfig
  album_art: NowPlayingAlbumArtConfig
}

export interface NowPlayingState {
  config: NowPlayingConfig
  /** Gradients the core extracted from the current artwork, keyed by variant. */
  artwork: { gradients: Record<string, { gradient: string }> | null } | null
}

const storeNowPlaying = (set: any) => ({
  nowPlayingState: null as NowPlayingState | null,
  nowPlayingAvailable: true,

  getNowPlaying: async () => {
    const resp = await Ledfx('/api/now-playing', 'GET', undefined, false)
    if (resp && resp.config) {
      set(
        produce((state: IStore) => {
          // Narrow on the way in - the endpoint returns the whole state.
          state.nowPlayingState = {
            config: resp.config,
            artwork: resp.artwork ? { gradients: resp.artwork.gradients ?? null } : null
          }
          state.nowPlayingAvailable = true
        }),
        false,
        'nowPlaying/getState'
      )
    } else if (resp?.status === 'failed') {
      set(
        produce((state: IStore) => {
          state.nowPlayingAvailable = false
        }),
        false,
        'nowPlaying/unavailable'
      )
    }
  },

  updateNowPlayingConfig: async (config: Partial<NowPlayingConfig>) => {
    const resp = await Ledfx('/api/now-playing', 'PUT', config)
    if (resp?.status !== 'success') return false

    const data = resp.payload?.data ?? resp.data
    if (data) {
      set(
        produce((state: IStore) => {
          if (state.nowPlayingState) {
            state.nowPlayingState.config = data
          } else {
            state.nowPlayingState = { config: data, artwork: null }
          }
        }),
        false,
        'nowPlaying/updateConfig'
      )
    }
    return true
  }
})

export default storeNowPlaying
