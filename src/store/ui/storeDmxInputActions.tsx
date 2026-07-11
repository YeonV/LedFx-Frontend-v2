import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import type { DmxInputData, DmxMapping } from './storeDmxInput'

const storeDmxInputActions = (set: any) => ({
  getDmxInput: async (integrationId: string) => {
    const resp = await Ledfx(`/api/integrations/dmx_input/${integrationId}`)
    if (resp && resp.mappings !== undefined) {
      set(
        produce((state: IStore) => {
          state.dmxInput[integrationId] = {
            mappings: resp.mappings || [],
            live_dmx: resp.live_dmx || {},
            venues: resp.venues || {},
            virtuals: resp.virtuals || {}
          } as DmxInputData
        }),
        false,
        'dmxInput/get'
      )
      return resp as DmxInputData
    }
    return null
  },

  // Global pause/resume of the whole DMX Input integration. The persisted
  // paused flag lives on the integration's own `data` (as returned by
  // GET /api/integrations, alongside `active`/`config`) rather than on the
  // mapping-editor payload, so update that slice of the store on success.
  setDmxInputPause: async (integrationId: string, paused: boolean) => {
    const resp = await Ledfx(`/api/integrations/dmx_input/${integrationId}/pause`, 'PUT', {
      paused
    })
    if (resp && resp.status === 'success') {
      set(
        produce((state: IStore) => {
          if (state.integrations[integrationId]) {
            state.integrations[integrationId].data = {
              ...state.integrations[integrationId].data,
              paused
            }
          }
        }),
        false,
        'dmxInput/setPause'
      )
      return true
    }
    return false
  },

  // Lightweight poll used by the live monitor / DMX-learn (only updates live_dmx)
  getDmxLive: async (integrationId: string) => {
    const resp = await Ledfx(
      `/api/integrations/dmx_input/${integrationId}`,
      'GET',
      undefined,
      false
    )
    if (resp && resp.live_dmx !== undefined) {
      set(
        produce((state: IStore) => {
          if (!state.dmxInput[integrationId]) {
            state.dmxInput[integrationId] = {
              mappings: resp.mappings || [],
              live_dmx: resp.live_dmx || {},
              venues: resp.venues || {},
              virtuals: resp.virtuals || {}
            } as DmxInputData
          } else {
            state.dmxInput[integrationId].live_dmx = resp.live_dmx || {}
          }
        }),
        false,
        'dmxInput/getLive'
      )
      return resp.live_dmx as Record<string, number[]>
    }
    return null
  },

  saveDmxMapping: async (integrationId: string, mapping: DmxMapping, index?: number) =>
    Ledfx(`/api/integrations/dmx_input/${integrationId}`, 'POST', {
      mapping,
      ...(index !== undefined && index !== null ? { index } : {})
    }),

  deleteDmxMapping: async (integrationId: string, index: number) =>
    Ledfx(`/api/integrations/dmx_input/${integrationId}`, 'DELETE', { data: { index } })
})

export default storeDmxInputActions
