import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

/**
 * Backend Now Playing config. Config only, deliberately: the track already
 * arrives live via `song_detected`, and a second copy here would drift.
 * Gradients are the exception - only the core can compute them.
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
