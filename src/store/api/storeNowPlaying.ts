import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

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

export interface NowPlayingMetadata {
  source_id: string
  title: string | null
  artist: string | null
  album: string | null
  duration: number | null
  position: number | null
  track_id: string | null
  artwork_url: string | null
  artwork_hash: string | null
  updated_at: number | null
}

export interface NowPlayingArtwork {
  source_id: string
  url: string | null
  cache_key: string | null
  content_type: string | null
  hash: string | null
  width: number | null
  height: number | null
  gradients: Record<string, { gradient: string }> | null
}

export interface NowPlayingState {
  active_source_id: string | null
  metadata: NowPlayingMetadata | null
  artwork: NowPlayingArtwork | null
  selected_gradient_variant: string
  current_gradient: string | null
  updated_at: number | null
  config: NowPlayingConfig
}

const storeNowPlaying = (set: any) => ({
  nowPlayingState: null as NowPlayingState | null,
  nowPlayingAvailable: true,

  getNowPlaying: async () => {
    const resp = await Ledfx('/api/now-playing', 'GET', undefined, false)
    if (resp && resp.config) {
      set(
        produce((state: IStore) => {
          state.nowPlayingState = resp as NowPlayingState
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
    if (resp?.status === 'success') {
      const data = resp.payload?.data ?? resp.data
      if (data) {
        set(
          produce((state: IStore) => {
            if (state.nowPlayingState) {
              state.nowPlayingState.config = data
            } else {
              state.nowPlayingState = {
                active_source_id: null,
                metadata: null,
                artwork: null,
                selected_gradient_variant: data.gradient?.variant ?? 'led_punchy',
                current_gradient: null,
                updated_at: null,
                config: data
              }
            }
          }),
          false,
          'nowPlaying/updateConfig'
        )
      }
      return true
    }
    return false
  }
})

export default storeNowPlaying
