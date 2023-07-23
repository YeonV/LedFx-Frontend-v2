/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

const storeVirtuals = (set: any) => ({
  virtuals: {} as any,
  currentVirtual: null as null | string,
  setCurrentVirtual: (v: null | string) =>
    set(
      produce((state: IStore) => {
        state.currentVirtual = v
      }),
      false,
      'api/setCurrentVirtual'
    ),
  getVirtuals: async () => {
    const resp = await Ledfx('/api/virtuals')
    if (resp) {
      set(
        produce((state: IStore) => {
          state.paused = resp.paused
        }),
        false,
        'api/gotPausedState'
      )
      if (resp && resp.virtuals) {
        set(
          produce((state: IStore) => {
            state.virtuals = resp.virtuals
          }),
          false,
          'api/gotVirtuals'
        )
      }
    }
  },
  addVirtual: async (config: any) =>
    await Ledfx('/api/virtuals', 'POST', config),
  updateVirtual: async (virtId: string, active: boolean) =>
    await Ledfx(`/api/virtuals/${virtId}`, 'PUT', { active }),
  deleteVirtual: async (virtId: string) =>
    await Ledfx(`/api/virtuals/${virtId}`, 'DELETE'),
  clearEffect: async (virtId: string) =>
    await Ledfx(`/api/virtuals/${virtId}/effects`, 'DELETE'),
  setEffect: async (
    virtId: string,
    type: string,
    config: any,
    active: boolean
  ) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}/effects`, 'POST', {
      type,
      config,
      active,
    })

    if (resp && resp.effect) {
      set(
        produce((state: IStore) => {
          state.virtuals[virtId].effect = {
            type: resp.effect.type,
            name: resp.effect.name,
            config: resp.effect.config,
          }
        }),
        false,
        'api/setEffect'
      )
    }
  },
  updateEffect: async (
    virtId: string,
    type: string,
    config: any,
    active: boolean
  ) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}/effects`, 'PUT', {
      type,
      config,
      active,
    })
    if (resp && resp.status && resp.status === 'success') {
      if (resp && resp.effect) {
        set(
          produce((state: IStore) => {
            state.virtuals[virtId].effect = {
              type: resp.effect.type,
              name: resp.effect.name,
              config: resp.effect.config,
            }
          }),
          false,
          'api/updateEffect'
        )
      }
    }
  },
  updateSegments: async (virtId: string, segments: any) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}`, 'POST', {
      segments: [...segments],
    })
    if (resp && resp.status && resp.status === 'success') {
      if (resp && resp.effect) {
        set(
          produce((state: IStore) => {
            state.virtuals[virtId].effect = {
              type: resp.effect.type,
              name: resp.effect.name,
              config: resp.effect.config,
            }
          }),
          false,
          'api/updateVirtualsSegments'
        )
      }
    }
  },
  highlightSegment: async (virtId: string, segment: number) => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'highlight',
      segment,
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
  calibrationMode: async (virtId: string, mode: 'on' | 'off') => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'calibration',
      mode,
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
})

export default storeVirtuals
