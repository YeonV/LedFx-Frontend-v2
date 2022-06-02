/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import { Ledfx } from '../../utils/api/ledfx';

const storeVirtuals = (get: any, set: any) => ({
  scanForDevices: async () => {
    const resp = await Ledfx('/api/find_devices', 'POST', {});
    // eslint-disable-next-line no-empty
    if (resp && resp.status === 'success') {
    } else {
      set(
        produce((state: any) => {
          state.dialogs.nohost.open = true;
        }),
        false,
        'api/scanForDevices'
      );
    }
  },

  paused: false,
  togglePause: async () => {
    const resp = await Ledfx('/api/virtuals', 'PUT', {});
    if (resp && resp.paused) {
      set({ paused: resp.paused });
    }
  },

  shutdown: async () =>
    await Ledfx('/api/power', 'POST', {
      timeout: 0,
      action: 'shutdown',
    }),
  restart: async () =>
    await Ledfx('/api/power', 'POST', {
      timeout: 0,
      action: 'restart',
    }),
  getInfo: async () => await Ledfx('/api/info'),
  getPing: async (virtId: string) => await Ledfx(`/api/ping/${virtId}`),

  updateVirtualSegments: async (virtId: string, segments: any) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}`, 'POST', {
      segments: [...segments],
    });
    if (resp && resp.status && resp.status === 'success') {
      if (resp && resp.effect) {
        set(
          produce((state: any) => {
            state.virtuals[virtId].effect = {
              type: resp.effect.type,
              name: resp.effect.name,
              config: resp.effect.config,
            };
          }),
          false,
          'api/updateVirtualsSegments'
        );
      }
    }
  },
});

export default storeVirtuals;
