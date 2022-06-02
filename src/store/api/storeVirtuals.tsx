/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import produce from 'immer';
import { Ledfx } from '../../utils/api/ledfx';

const storeVirtuals = (get: any, set: any) => ({
  virtuals: {},
  getVirtuals: async () => {
    const resp = await Ledfx('/api/virtuals');
    if (resp) {
      set({ paused: resp.paused });
      if (resp && resp.virtuals) {
        console.log('YOOOO', resp);
        set({ v: resp });
        set(
          produce((state: any) => {
            state.v.virtuals = resp;
          }),
          false,
          'api/setVirtualEffect'
        );
        console.log('YOOOO2', resp);
      }
    }
  },
  addVirtual: async (config: any) =>
    await Ledfx('/api/virtuals', 'POST', config),
  updateVirtual: async (virtId: string, active: boolean) =>
    await Ledfx(`/api/virtuals/${virtId}`, 'PUT', {
      active,
    }),
  deleteVirtual: async (virtId: string) =>
    await Ledfx(`/api/virtuals/${virtId}`, 'DELETE'),
  clearVirtualEffect: async (virtId: string) =>
    await Ledfx(`/api/virtuals/${virtId}/effects`, 'DELETE'),
  setVirtualEffect: async (
    virtId: string,
    type: string,
    config: any,
    active: boolean
  ) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}/effects`, 'POST', {
      type,
      config,
      active,
    });

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
        'api/setVirtualEffect'
      );
    }
  },
  updateVirtualEffect: async (
    virtId: string,
    type: string,
    config: any,
    active: boolean
  ) => {
    const resp = await Ledfx(`/api/virtuals/${virtId}/effects`, 'PUT', {
      type,
      config,
      active,
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
          'api/updateVirtualEffect'
        );
      }
    }
  },
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
