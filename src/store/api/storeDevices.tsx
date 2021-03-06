/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import produce from 'immer';
import { Ledfx } from '../../api/ledfx';

const storeDevices = (set: any) => ({
  devices: {} as any,
  getDevices: async () => {
    const resp = await Ledfx('/api/devices');
    if (resp && resp.devices) {
      set(
        produce((state: any) => {
          state.devices = resp.devices;
        }),
        false,
        'api/gotDevices'
      );
    }
  },
  getDevice: async (deviceId: string) => {
    const resp = await Ledfx(`/api/devices/${deviceId}`);
    if (resp && resp.data) {
      return {
        key: deviceId,
        id: deviceId,
        name: resp.data.name,
        config: resp.data,
        virtuals: resp.data.virtuals,
        active_virtuals: resp.data.active_virtuals,
      };
    }
    return {};
  },
  addDevice: async (config: any) => await Ledfx('/api/devices', 'POST', config),
  activateDevice: async (deviceId: string) => {
    const resp = await Ledfx(`/api/devices/${deviceId}`, 'POST', {});
    if (resp) {
      set(
        produce((state: any) => {
          state.paused = resp.paused;
        }),
        false,
        'api/gotPausedState'
      );

      if (resp && resp.virtuals) {
        set(
          produce((state: any) => {
            state.virtuals = resp.virtuals;
          }),
          false,
          'api/gotVirtuals'
        );
      }
    }
  },
  updateDevice: async (deviceId: string, config: any) =>
    await Ledfx(`/api/devices/${deviceId}`, 'PUT', config),
});

export default storeDevices;
