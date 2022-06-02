/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable no-return-await */
import produce from 'immer';
import { Ledfx } from '../../utils/api/ledfx';

const storeConfig = (get: any, set: any) => ({
  schemas: {},
  getSchemas: async () => {
    const resp = await Ledfx('/api/schema');
    if (resp) {
      set({ schemas: resp });
    }
  },

  config: {},
  getSystemConfig: async () => {
    const resp = await Ledfx('/api/config');
    if (resp && resp.host) {
      set({
        config: {
          ...resp,
          ...{
            ledfx_presets: undefined,
            devices: undefined,
            virtuals: undefined,
            integrations: undefined,
            scenes: undefined,
          },
        },
      });
    } else {
      set({ dialogs: { nohost: { open: true } } });
    }
  },
  getFullConfig: async () => {
    const resp = await Ledfx('/api/config');
    if (resp && resp.host) {
      return { ...resp, ...{ ledfx_presets: undefined } };
    }
    return set(
      produce((state: any) => {
        state.dialogs.nohost.open = true;
      }),
      false,
      'api/getFullConfig'
    );
  },
  setSystemConfig: async (config: any) =>
    await Ledfx('/api/config', 'PUT', config),
  deleteSystemConfig: async () => await Ledfx('/api/config', 'DELETE'),
  importSystemConfig: async (config: any) =>
    await Ledfx('/api/config', 'POST', config),
});

export default storeConfig;
