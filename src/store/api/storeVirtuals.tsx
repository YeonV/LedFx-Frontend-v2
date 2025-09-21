import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import { Effect, EffectConfig, Virtual } from '../../api/ledfx.types'

export interface IVirtualOrder {
  virtId: string
  order: number
}

export type Segment = [device: string, start: number, end: number, reverse: boolean]

const storeVirtuals = (set: any) => ({
  virtualOrder: [] as IVirtualOrder[],
  setVirtualOrder: (order: IVirtualOrder[]) => {
    set(
      produce((s: IStore) => {
        s.virtualOrder = order
      }),
      false,
      'setVirtualOrder'
    )
  },
  newBlender: '',
  setNewBlender: (v: string) =>
    set(
      produce((state: IStore) => {
        state.newBlender = v
      }),
      false,
      'api/setNewBlender'
    ),
  virtuals: {} as Record<string, Virtual>,
  activeSegment: -1,
  setActiveSegment: (v: number) =>
    set(
      produce((state: IStore) => {
        state.activeSegment = v
      }),
      false,
      'api/setCurrentVirtual'
    ),
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
            state.virtuals = resp.virtuals as Record<string, Virtual>
          }),
          false,
          'api/gotVirtuals'
        )
      }
    }
  },
  addVirtual: async (config: any) => await Ledfx('/api/virtuals', 'POST', config),
  updateVirtual: async (virtId: string, active: boolean) =>
    await Ledfx(`/api/virtuals/${virtId}`, 'PUT', { active }),
  deleteVirtual: async (virtId: string) => await Ledfx(`/api/virtuals/${virtId}`, 'DELETE'),
  clearEffect: async (virtId: string) => await Ledfx(`/api/virtuals/${virtId}/effects`, 'DELETE'),
  setEffect: async (
    virtId: string,
    type: string,
    config: any,
    active: boolean,
    fallback?: boolean | number
  ) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}/effects`, 'POST', {
      type,
      config,
      active,
      fallback
    })

    if (resp && resp.effect) {
      set(
        produce((state: IStore) => {
          state.virtuals[virtId].effect = {
            type: resp.effect.type,
            name: resp.effect.name,
            config: resp.effect.config
          }
        }),
        false,
        'api/setEffect'
      )
    }
  },
  setEffectFallback: (virtId: string) => {
    Ledfx(`/api/virtuals/${virtId}/fallback`)
  },
  removeEffectfromHistory: async (type: string, virtId: string) => {
    await Ledfx(`/api/virtuals/${virtId}/effects/delete`, 'POST', {
      type
    })
    set(
      produce((state: IStore) => {
        state.virtuals[virtId].effect = {
          type: null,
          name: '',
          config: null
        }
      }),
      false,
      'api/removeEffectfromHistory'
    )
  },
  updateEffect: async (
    virtId: string,
    type: string,
    config: EffectConfig,
    active: boolean,
    fallback?: boolean
  ) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}/effects`, 'PUT', {
      type,
      config,
      active,
      fallback
    })
    if (resp && resp.status && resp.status === 'success') {
      if (resp && resp.effect) {
        set(
          produce((state: IStore) => {
            state.virtuals[virtId].effect = {
              type: (resp.effect as Effect).type,
              name: (resp.effect as Effect).name,
              config: (resp.effect as Effect).config
            }
          }),
          false,
          'api/updateEffect'
        )
      }
    }
  },
  copyTo: async (virtId: string, target: string[]) => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'copy',
      target
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
  updateSegments: async (virtId: string, segments: Segment[]) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}`, 'POST', {
      segments: [...segments]
    })
    if (resp && resp.status && resp.status === 'success') {
      if (resp && resp.effect) {
        set(
          produce((state: IStore) => {
            state.virtuals[virtId].effect = {
              type: (resp.effect as Effect).type,
              name: (resp.effect as Effect).name,
              config: (resp.effect as Effect).config
            }
          }),
          false,
          'api/updateVirtualsSegments'
        )
      }
    }
  },
  highlightSegment: async (
    virtId: string,
    device: string,
    start: number,
    stop: number,
    flip: boolean
  ) => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'highlight',
      device,
      start,
      stop,
      flip
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
  highlightOffSegment: async (virtId: string) => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'highlight',
      state: false
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
  calibrationMode: async (virtId: string, mode: 'on' | 'off') => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'calibration',
      mode
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
  oneShotAll: async (color: string, ramp: number, hold: number, fade: number) => {
    const resp = await Ledfx('/api/virtuals_tools', 'POST', {
      tool: 'oneshot',
      color,
      ramp,
      hold,
      fade
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  },
  oneShot: async (virtId: string, color: string, ramp: number, hold: number, fade: number) => {
    const resp = await Ledfx(`/api/virtuals_tools/${virtId}`, 'PUT', {
      tool: 'oneshot',
      color,
      ramp,
      hold,
      fade
    })
    if (resp && resp.status && resp.status === 'success') {
      return true
    }
    return false
  }
})

export default storeVirtuals
