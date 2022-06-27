/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import produce from 'immer';
import { Ledfx } from '../../api/ledfx';

const storeIntegrations = (set: any) => ({
  integrations: {} as any,
  getIntegrations: async () => {
    const resp = await Ledfx('/api/integrations');
    if (resp && resp.integrations) {
      // console.log(resp.integrations);
      set(
        produce((s: any) => {
          s.integrations = resp.integrations;
        }),
        false,
        'gotIntegrations'
      );
    }
  },
  addIntegration: async (config: any) =>
    await Ledfx('/api/integrations', 'POST', config),
  updateIntegration: async (config: any) =>
    await Ledfx('/api/integrations', 'POST', config),
  toggleIntegration: async (config: any) =>
    await Ledfx('/api/integrations', 'PUT', config),
  deleteIntegration: async (config: any) =>
    await Ledfx('/api/integrations', 'DELETE', { data: { id: config } }),
});

export default storeIntegrations;
