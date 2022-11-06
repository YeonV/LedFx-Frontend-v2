/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import produce from 'immer';
// import { string } from 'prop-types';
import { Ledfx } from '../../api/ledfx';

const storeScenes = (set: any) => ({
  scenes: {} as any,
  recentScenes: [] as string[],
  count: {} as any,
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
  addScene: async (
    name: string,
    scene_image: string,
    scene_tags: string,
    scene_puturl: string,
    scene_payload: string
  ) =>
    await Ledfx('/api/scenes', 'POST', {
      name,
      scene_image,
      scene_tags,
      scene_puturl,
      scene_payload,
    }),
  activateScene: async (id: string) => {
    set(
      produce((s: any) => {
        s.recentScenes = s.recentScenes
          ? s.recentScenes.indexOf(id) > -1
            ? [id, ...s.recentScenes.filter((t: any) => t !== id)]
            : [id, ...s.recentScenes].slice(0, 5)
          : [id];
      }),
      false,
      'setScenes'
    );
    set(
      produce((s: any) => {
        s.count[id] = (s.count[id] || 0) + 1;
      }),
      false,
      'setScenes'
    );
    return await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate',
    });
  },
  activateSceneIn: async (id: string, ms: number) =>
    await Ledfx('/api/scenes', 'PUT', {
      id,
      action: 'activate_in',
      ms,
    }),
  deleteScene: async (name: string) =>
    await Ledfx('/api/scenes', 'DELETE', { data: { id: name } }),

  captivateScene: async (scene_puturl: string, scene_payload: string) =>
    await Ledfx(scene_puturl, 'PUT', JSON.parse(scene_payload)),
});

export default storeScenes;
