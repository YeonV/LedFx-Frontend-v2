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
        state.host = host;
      }),
      false,
      'general/host'
    );
  },
  disconnected: false,
  setDisconnected: (dis: boolean) =>
    set(
      produce((state: any) => {
        state.disconnected = dis;
      }),
      false,
      'general/setStreamingToDevices'
    ),

  streamingToDevices: [] as string[],
  setStreamingToDevices: (devices: any) => {
    set(
      produce((state: any) => {
        state.streamingToDevices = devices;
      }),
      false,
      'general/setStreamingToDevices'
    );
  },

  graphs: !!isElectron(),
  toggleGraphs: () => {
    set(
      produce((state: any) => {
        state.graphs = !state.graphs;
      }),
      false,
      'general/toggleGraphs'
    );
  },

  pixelGraphs: [],
  setPixelGraphs: (virtuals: any): void =>
    set(
      produce((state: any) => {
        state.pixelGraphs = [...virtuals];
      }),
      false,
      'ui/setPixelGraphs'
    ),
  viewMode: 'user',
  setViewMode: (mode: string): void =>
    set(
      produce((state: any) => {
        state.ui.viewMode = mode;
      }),
      false,
      'ui/setViewMode'
    ),
  // Cloud
  isLogged: false,
  setIsLogged: (logged: boolean) =>
    set(
      produce((state: any) => {
        state.isLogged = logged;
      }),
      false,
      'general/setIsLogged'
    ),

  // Example
  animals: {
    bears: 1,
  },
  increase: (by: number) =>
    set(
      produce((state: any) => {
        state.animals.bears += by;
      })
    ),
});

export default storeGeneral;
