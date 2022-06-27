/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import produce from 'immer';
import { Ledfx } from '../../api/ledfx';

const storeScenes = (set: any) => ({
  scenes: {} as any,
  getScenes: async () => {
    const resp = await Ledfx('/api/scenes');
    if (resp && resp.scenes) {
      set(
        produce((s: any) => {
          s.scenes = resp.scenes;
        }),
        false,
        'gotScenes'
      );
    }
  },
  addScene: async (name: string, scene_image: string) =>
    await Ledfx('/api/scenes', 'POST', { name, scene_image }),
  activateScene: async (id: string) =>
    await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate',
    }),
  activateSceneIn: async (id: string, ms: number) =>
    await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate_in',
      ms,
    }),
  deleteScene: async (name: string) =>
    await Ledfx('/api/scenes', 'DELETE', { data: { id: name } }),
});

export default storeScenes;
