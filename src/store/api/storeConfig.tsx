/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

const storeConfig = (set: any) => ({
  schemas: {} as any,
  getSchemas: async () => {
    const resp = await Ledfx('/api/schema')
    if (resp) {
      set(
        produce((s: any) => {
          s.schemas = resp
        }),
        false,
        'gotSchemas'
      )
    }
  },

  config: {} as any,
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
              scenes: undefined,
            },
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
      return resp.ledfx_presets
    }
    return set(
      produce((state: IStore) => {
        state.dialogs.nohost.open = true
      }),
      false,
      'api/getLedFxPresets'
    )
  },
  setSystemConfig: async (config: any) =>
    await Ledfx('/api/config', 'PUT', config),
  deleteSystemConfig: async () => await Ledfx('/api/config', 'DELETE'),
  importSystemConfig: async (config: any) =>
    await Ledfx('/api/config', 'POST', config),
})

export default storeConfig
