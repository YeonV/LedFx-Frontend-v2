import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import type {
  GetVirtualPresetsApiResponse,
  SetVirtualPresetRequest,
  SetVirtualPresetApiResponse,
  CreateVirtualPresetRequest,
  CreateVirtualPresetApiResponse,
  DeleteVirtualPresetApiResponse,
  Preset
} from '../../api/ledfx.types'

// Update the IPresets interface to match the API response structure
export interface IPresets {
  ledfx_presets: Record<string, Preset>
  user_presets: Record<string, Preset>
  // Keep old names for backward compatibility if needed
  default_presets?: Record<string, Preset>
  custom_presets?: Record<string, Preset>
}

const storePresets = (set: any) => ({
  presets: {} as IPresets,

  getPresets: async (virtId: string) => {
    const resp = (await Ledfx(`/api/virtuals/${virtId}/presets`)) as GetVirtualPresetsApiResponse
    if (resp && resp.status === 'success') {
      set(
        produce((s: IStore) => {
          s.presets = {
            ledfx_presets: resp.ledfx_presets,
            user_presets: resp.user_presets,
            // Backward compatibility
            default_presets: resp.ledfx_presets,
            custom_presets: resp.user_presets
          }
        }),
        false,
        'gotPresets'
      )
    }
    return resp
  },

  addPreset: async (virtId: string, name: string) => {
    const body: CreateVirtualPresetRequest = { name }
    const resp = (await Ledfx(
      `/api/virtuals/${virtId}/presets`,
      'POST',
      body
    )) as CreateVirtualPresetApiResponse
    return resp
  },

  activatePreset: async (
    virtId: string,
    category: 'ledfx_presets' | 'user_presets',
    effectType: string,
    presetId: string
  ) => {
    const body: SetVirtualPresetRequest = {
      category,
      effect_id: effectType as any, // Cast to EffectType
      preset_id: presetId
    }
    const resp = (await Ledfx(
      `/api/virtuals/${virtId}/presets`,
      'PUT',
      body
    )) as SetVirtualPresetApiResponse
    return resp
  },

  deletePreset: async (effectId: string, presetId: string) => {
    const resp = (await Ledfx(`/api/effects/${effectId}/presets/${presetId}`, 'DELETE')) as DeleteVirtualPresetApiResponse
    return resp
  }
})

export default storePresets
