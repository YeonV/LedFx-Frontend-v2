/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import produce from 'immer';
import { Ledfx } from '../../api/ledfx';

const storeActions = (set: any) => ({
  scanForDevices: async () => {
    const resp = await Ledfx('/api/find_devices', 'POST', {});
    if (!(resp && resp.status === 'success')) {
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
      set(
        produce((s: any) => {
          s.paused = resp.paused;
        }),
        false,
        'gotPaused'
      );
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
});

export default storeActions;
