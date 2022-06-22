/* eslint-disable default-case */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import { Ledfx } from '../../api/ledfx';

const storeSpotifyActions = (set: any) => ({
  setSpEmbedUrl: (url: string) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyEmbedUrl = url;
      }),
      false,
      'spotify/setSpotifyEmbedUrl'
    ),
  setSpAuthToken: (token: any) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyAuthToken = token;
      }),
      false,
      'spotify/setSpotifyAuthToken'
    ),
  setPlayer: (player: any) =>
    set(
      produce((state: any) => {
        state.spotify.player = player;
      }),
      false,
      'spotify/setPlayer'
    ),
  getVolume: null as any,
  setGetVolume: (val: any) =>
    set(
      produce((state: any) => {
        state.getVolume = val;
      }),
      false,
      'spotify/setPlayer'
    ),
  setSwSize: (x: any) =>
    set(
      produce((state: any) => {
        state.spotify.swSize = x || 'small';
      }),
      false,
      'spotify/setSwSize'
    ),
  setSwX: (x: number) =>
    set(
      produce((state: any) => {
        state.spotify.swX = x || 50;
      }),
      false,
      'spotify/setSwX'
    ),
  setSwY: (y: number) =>
    set(
      produce((state: any) => {
        state.spotify.swY = y || 200;
      }),
      false,
      'spotify/setSwY'
    ),
  setSwWidth: (width: number) =>
    set(
      produce((state: any) => {
        state.spotify.swWidth = width;
      }),
      false,
      'spotify/setSwWidth'
    ),
  setSpVol: (vol: number) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyVol = vol;
      }),
      false,
      'spotify/setSpotifyVol'
    ),
  setSpPos: (pos: any) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyPos = pos;
      }),
      false,
      'spotify/setSpotifyPos'
    ),
  setSpAuthenticated: (val: boolean) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyAuthenticated = val;
      }),
      false,
      'spotify/setSpAuthenticated'
    ),
  setSpData: (type: string, data: any) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyData[type] = data;
      }),
      false,
      'spotify/setSpotifyData'
    ),
  setSpDevice: (id: string) =>
    set(
      produce((state: any) => {
        state.spotify.spotifyDevice = id;
      }),
      false,
      'spotify/setSpotifyDevice'
    ),
  getSpTriggers: async (id: string) => {
    const resp = await Ledfx('/api/integrations', set, 'GET');
    // const res = await resp.json()
    if (resp) {
      console.log(resp);
      set(
        produce((state: any) => {
          state.spotify.spotify = resp.spotify;
        }),
        false,
        'spotify/getTriggers'
      );
    }
  },
  addToSpTriggerList: async (newTrigger: any, type: string) => {
    switch (type) {
      case 'create':
        set(
          produce((state: any) => {
            state.spotify.spTriggersList = [...newTrigger];
          }),
          false,
          'spotify/addToTriggerList'
        );
        break;
      case 'update':
        set(
          produce((state: any) => {
            state.spotify.spTriggersList = [
              ...state.spTriggersList,
              newTrigger,
            ];
          }),
          false,
          'spotify/addToTriggerList'
        );
        break;
    }
  },
  addSpSongTrigger: async ({
    scene_id,
    song_id,
    song_name,
    song_position,
  }: any) => {
    await Ledfx('/api/integrations/spotify/spotify', 'POST', {
      scene_id,
      song_id,
      song_name,
      song_position,
    });
  },
  toggleSpTrigger: (SpotifyId: string, config: any) =>
    Ledfx(`/api/integrations/spotify/${SpotifyId}`, 'PUT', config),
  deleteSpTrigger: async (config: any) => {
    await Ledfx('/api/integrations/spotify/spotify', 'DELETE', config);
    // set(state=>state.getIntegrations())
  },
});

export default storeSpotifyActions;
