/* eslint-disable import/no-cycle */
/* eslint-disable no-return-await */
import { Ledfx } from '../../utils/api/ledfx';

const storeApiDevices = (set: any) => ({
  devices: {},
  getDevices: async () => {
    const resp = await Ledfx('/api/devices');
    if (resp && resp.devices) {
      set({ devices: resp.devices }, false, 'api/gotDevices');
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
      set({ paused: resp.paused }, false, 'api/gotPausedState');
      if (resp && resp.virtuals) {
        set({ virtuals: resp.virtuals }, false, 'api/gotVirtuals');
      }
    }
  },
  updateDevice: async (deviceId: string, config: any) =>
    await Ledfx(`/api/devices/${deviceId}`, 'PUT', config),
});

export default storeApiDevices;
