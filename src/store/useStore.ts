/* eslint-disable import/no-cycle */
import create from 'zustand';
import { devtools, combine, persist } from 'zustand/middleware';

import storeGeneral from './ui/storeGeneral';
import storeFeatures from './ui/storeFeatures';
import storeTours from './ui/storeTours';
import storeUI from './ui/storeUI';
import storeDialogs from './ui/storeDialogs';
import storeSpotify from './ui/storeSpotify';
import storeQLC from './ui/storeQLC';
import storeWebAudio from './ui/storeWebAudio';
import storeYoutube from './ui/storeYoutube';
import storeDevices from './api/storeDevices';
import storeVirtuals from './api/storeVirtuals';
import storeScenes from './api/storeScenes';
import storeIntegrations from './api/storeIntegrations';
import storePresets from './api/storePresets';
import storeConfig from './api/storeConfig';
import storeActions from './api/storeActions';
import storeColors from './api/storeColors';
import storeSpotifyActions from './ui/storeSpotifyActions';
import storeQLCActions from './ui/storeQLCActions';

const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade',
        },
        (set: any) => ({
          ui: storeUI(set),
          spotify: storeSpotify(),
          qlc: storeQLC(),
          ...storeTours(set),
          ...storeSpotifyActions(set),
          ...storeQLCActions(set),
          ...storeGeneral(set),
          ...storeDialogs(set),
          ...storeFeatures(set),
          ...storeWebAudio(set),
          ...storeYoutube(set),

          ...storeColors(set),
          ...storeDevices(set),
          ...storeVirtuals(set),
          ...storeScenes(set),
          ...storeIntegrations(set),
          ...storePresets(set),
          ...storeConfig(set),
          ...storeActions(set),
        })
      ),
      {
        name: 'ledfx-storage',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) =>
                !['dialogs', 'disconnected', 'ui', 'spotify'].includes(key)
            )
          ),
      }
    )
  )
);

const state = useStore.getState();
export type IStore = typeof state;

export default useStore;
