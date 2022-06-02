/* eslint-disable no-param-reassign */
import produce from 'immer';
import isElectron from 'is-electron';

const storeGeneral = (set: any) => ({
  host: isElectron()
    ? 'http://localhost:8888'
    : window.location.href.split('#')[0],
  setHost: (host: any) => {
    window.localStorage.setItem('ledfx-host', host.title ? host.title : host);
    return set(
      produce((state: any) => {
        state.general.host = host;
      }),
      false,
      'general/host'
    );
  },
  disconnected: false,
  setDisconnected: (dis: boolean) =>
    set(
      produce((state: any) => {
        state.general.disconnected = dis;
      }),
      false,
      'general/setStreamingToDevices'
    ),

  streamingToDevices: [],
  setStreamingToDevices: (devices: any) => {
    set(
      produce((state: any) => {
        state.general.streamingToDevices = devices;
      }),
      false,
      'general/setStreamingToDevices'
    );
  },

  graphs: isElectron(),
  toggleGraphs: () => {
    set(
      produce((state: any) => {
        state.general.graphs = !state.general.graphs;
      }),
      false,
      'general/toggleGraphs'
    );
  },

  // Cloud
  isLogged: false,
  setIsLogged: (logged: boolean) =>
    set(
      produce((state: any) => {
        state.general.isLogged = logged;
      }),
      false,
      'general/setIsLogged'
    ),

  // Example
  animals: {
    bears: 1,
  },
  increase: (by: number): void =>
    set(
      produce((state: any) => {
        state.general.animals.bears += by;
      }),
      false,
      'bears/increase'
    ),
});

export default storeGeneral;
