import { produce } from 'immer'
import { Ledfx, api } from '../../api/ledfx'
import type { IStore } from '../useStore'
import useStore from '../useStore'
import type { EffectConfig, Schemas } from '../../api/ledfx.types'

export interface Intergration {
  active: boolean
  config: Record<string, any>
  data: Record<string, any>
  id: string
  type: string
  status?: number
  beta?: boolean
}

export interface IPreset {
  name: string
  config: EffectConfig
}

export interface ISystemConfig {
  integrations: undefined
  user_gradients: Record<string, string>
  global_brightness: number
  visualisation_fps: number
  transmission_mode?: 'compressed' | 'uncompressed'
  dev_mode: boolean
  // ledfx_presets: Record<string, Record<string, IPreset>>
  ledfx_presets: undefined
  audio: {
    audio_device: number
    delay_ms: number
    fft_size: number
    mic_rate: number
    min_volume: number
    sample_rate: number
    pitch_method: string
    pitch_tolerance: number
    onset_method: string
    stems_enabled: boolean
    stem_hop: number
    stem_threads: number
  }
  user_colors: Record<string, string>
  devices: undefined
  create_segments: boolean
  wled_preferences: Record<string, any>
  melbanks: {
    max_frequencies: number[]
    min_frequency: number
    coeffs_type: string
  }
  global_transitions: boolean
  virtuals: undefined
  host: string
  hosts?: string[]
  visualisation_maxlen: number
  port_s: number
  user_presets: Record<string, Record<string, IPreset>>
  port: number
  configuration_version: string
  scenes: undefined
  scan_on_startup: boolean
  flush_on_deactivate: boolean
  ui_brightness_boost: number
  startup_scene_id: string
  startup_playlist_id: string
  sendspin_always_on: boolean
  /** Opt-in. While false the core never reads the OS media session. */
  now_playing_enabled?: boolean
  lifx_broadcast_address?: string
  lifx_discovery_timeout?: number
  sendspin_servers?: Record<string, { server_url: string; client_name: string }>
}

const storeConfig = (set: any) => ({
  schemas: {} as Partial<Schemas>,
  /** Set when the backend has no /api/schemas: it predates this frontend. */
  schemasMissing: false,
  /** /api/audio/devices: device index -> "Host: Name". Names live here, not in the schema. */
  audioDevices: {} as Record<string, string>,
  /** Sources (`x-ledfx-enum-source`) whose getter has resolved once: until then, "not in the list" means "not loaded yet". */
  instanceLoaded: {} as Record<string, boolean>,
  markInstanceLoaded: (source: string) =>
    set(
      produce((state: IStore) => {
        state.instanceLoaded[source] = true
      }),
      false,
      'api/instanceLoaded'
    ),
  getSchemas: async (forceRefresh = false) => {
    // Cache check: skip if already loaded (unless force refresh). `schemas` is
    // persisted, so a copy of the legacy /api/schema (no $schema) doesn't count.
    const currentSchemas = useStore.getState().schemas
    if (!forceRefresh && currentSchemas?.virtuals?.schema?.$schema) return

    try {
      const { data } = await api.get('/api/schemas')
      set(
        produce((s: IStore) => {
          s.schemas = data
          s.schemasMissing = false
        }),
        false,
        'gotSchemas'
      )
    } catch (error: any) {
      if (error.response?.status === 404) {
        set(
          produce((s: IStore) => {
            s.schemas = {}
            s.schemasMissing = true
          }),
          false,
          'schemasMissing'
        )
      } else {
        useStore.getState().ui.showSnackbar('error', error.message)
      }
    }
  },

  config: {} as ISystemConfig,
  getSystemConfig: async () => {
    const resp = await Ledfx('/api/config')
    if (resp && resp.host) {
      set(
        produce((state: IStore) => {
          state.config = {
            ...resp,
            ...{
              ledfx_presets: undefined,
              devices: undefined,
              virtuals: undefined,
              integrations: undefined,
              scenes: undefined
            }
          } as ISystemConfig
          // Sync sendspin servers from config so the manage dialog always has data
          if (resp.sendspin_servers && typeof resp.sendspin_servers === 'object') {
            state.sendspinServers = resp.sendspin_servers
            state.sendspinAvailable = true
          }
        }),
        false,
        'api/gotSystemConfig'
      )
    } else {
      set(
        produce((state: IStore) => {
          state.dialogs.nohost.open = true
        }),
        false,
        'api/failedSystemConfig'
      )
    }
  },
  getFullConfig: async () => {
    const resp = await Ledfx('/api/config')
    if (resp && resp.host) {
      return { ...resp, ...{ ledfx_presets: undefined } }
    }
    return set(
      produce((state: IStore) => {
        state.dialogs.nohost.open = true
      }),
      false,
      'api/getFullConfig'
    )
  },
  getLedFxPresets: async () => {
    const resp = await Ledfx('/api/config')
    if (resp && resp.host) {
      if (resp.ledfx_presets) return resp.ledfx_presets
      if (resp.default_presets) return resp.default_presets
    }
    return set(
      produce((state: IStore) => {
        state.dialogs.nohost.open = true
      }),
      false,
      'api/getLedFxPresets'
    )
  },
  getUserPresets: async () => {
    const resp = await Ledfx('/api/config')
    if (resp && resp.host) {
      set(
        produce((state: IStore) => {
          state.config.user_presets = resp.user_presets || resp.custom_presets
        }),
        false,
        'api/getUserPresets'
      )
      return resp.user_presets
    }
    return set(
      produce((state: IStore) => {
        state.dialogs.nohost.open = true
      }),
      false,
      'api/getUserPresets'
    )
  },
  getAudioDevices: async () => {
    const resp = await Ledfx('/api/audio/devices')
    if (resp && resp.devices !== undefined && resp.active_device_index !== undefined) {
      set(
        produce((state: IStore) => {
          state.audioDevices = resp.devices
          // Update the active device index in the config
          if (state.config?.audio) {
            state.config.audio.audio_device = resp.active_device_index
          }
        }),
        false,
        'api/gotAudioDevices'
      )
    }
  },
  setSystemConfig: async (config: any) => await Ledfx('/api/config', 'PUT', config),
  deleteSystemConfig: async () => await Ledfx('/api/config', 'DELETE'),
  importSystemConfig: async (config: any) => await Ledfx('/api/config', 'POST', config)
})

export default storeConfig
