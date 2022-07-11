/* eslint-disable default-case */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import { Ledfx } from '../../api/ledfx';

const storeQLCActions = (set: any) => ({
  setQLCEmbedUrl: (url: string) =>
    set(
      produce((state: any) => {
        state.qlc.qlcEmbedUrl = url;
      }),
      false,
      'qlc/setQLCEmbedUrl'
    ),
  setQLCPos: (pos: any) =>
    set(
      produce((state: any) => {
        state.qlc.qlcPos = pos;
      }),
      false,
      'qlc/setQLCPos'
    ),
  setQLCData: (type: string, data: any) =>
    set(
      produce((state: any) => {
        state.qlc.qlcData[type] = data;
      }),
      false,
      'qlc/setQLCData'
    ),
  getQLCTriggers: async (id: string) => {
    const resp = await Ledfx('/api/integrations', set, 'GET');
    // const res = await resp.json()
    if (resp) {
      set(
        produce((state: any) => {
          state.qlc.qlc = resp.qlc;
        }),
        false,
        'qlc/getTriggers'
      );
    }
  },
  setQLCActTriggers: async (ids: string[]) => {
    set(
      produce((state: any) => {
        state.qlc.qlcActTriggers = ids;
      }),
      false,
      'qlc/setTriggers'
    );
  },
  removeQLCActTriggers: async (id: string) => {
    set(
      produce((state: any) => {
        state.qlc.qlcActTriggers = state.qlc.qlcActTriggers.filter(
          (f: any) => f.id !== id
        );
      }),
      false,
      'qlc/delTriggers'
    );
  },
  addToQLCTriggerList: async (newTrigger: any, type: string) => {
    switch (type) {
      case 'create':
        set(
          produce((state: any) => {
            state.qlc.qlcTriggersList = [...newTrigger];
          }),
          false,
          'qlc/addToTriggerList'
        );
        break;
      case 'update':
        set(
          produce((state: any) => {
            state.qlc.qlcTriggersList = [...state.qlcTriggersList, newTrigger];
          }),
          false,
          'qlc/addToTriggerList'
        );
        break;
    }
  },
  addQLCSongTrigger: async ({
    scene_id,
    song_id,
    song_name,
    song_position,
  }: any) => {
    await Ledfx('/api/integrations/qlc/qlc', 'POST', {
      scene_id,
      song_id,
      song_name,
      song_position,
    });
  },
  toggleQLCTrigger: (QLCId: string, config: any) =>
    Ledfx(`/api/integrations/qlc/${QLCId}`, 'PUT', config),
  deleteQLCTrigger: async (config: any) => {
    await Ledfx('/api/integrations/qlc/qlc', 'DELETE', config);
    // set(state=>state.getIntegrations())
  },
});

export default storeQLCActions;
