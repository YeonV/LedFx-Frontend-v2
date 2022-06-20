/* eslint-disable no-param-reassign */
import produce from 'immer';

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
  setThePlayer: (ref: any) =>
    set(
      produce((state: any) => {
        state.spotify.thePlayer = ref;
      }),
      false,
      'spotify/setThePlayer'
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
});

export default storeSpotifyActions;
