/* eslint-disable no-return-await */
import { Ledfx } from '../../utils/api/ledfx';

const storeIntegrations = (get: any, set: any) => ({
  integrations: {},
  getIntegrations: async () => {
    const resp = await Ledfx('/api/integrations');
    if (resp && resp.integrations) {
      set({ integrations: resp.integrations });
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
