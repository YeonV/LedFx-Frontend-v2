/* eslint-disable no-return-await */
import { Ledfx } from '../../utils/api/ledfx';

const storeScenes = (get: any, set: any) => ({
  scenes: {},
  getScenes: async () => {
    const resp = await Ledfx('/api/scenes');
    if (resp && resp.scenes) {
      set({ scenes: resp.scenes });
    }
  },
  addScene: async (name: string, scene_image: string) =>
    await Ledfx('/api/scenes', 'POST', { name, scene_image }),
  activateScene: async (id: string) =>
    await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate',
    }),
  deleteScene: async (name: string) =>
    await Ledfx('/api/scenes', 'DELETE', { data: { id: name } }),
});

export default storeScenes;
