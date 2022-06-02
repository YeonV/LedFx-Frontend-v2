/* eslint-disable import/no-cycle */
import create from 'zustand';
import { devtools, combine } from 'zustand/middleware';

import storeGeneral from './ui/storeGeneral';
import storeFeatures from './ui/storeFeatures';
import storeTours from './ui/storeTours';
import storeUI from './ui/storeUI';
import storeDialogs from './ui/storeDialogs';
import storeSpotify from './ui/storeSpotify';
import storeWebAudio from './ui/storeWebAudio';
import storeYoutube from './ui/storeYoutube';

import storeVirtuals from './api/storeVirtuals';
import storeScenes from './api/storeScenes';
import storePresets from './api/storePresets';
import storeIntegrations from './api/storeIntegrations';
import storeApiDevices from './api/storeDevices';
import storeConfig from './api/storeConfig';

const useStore = create(
  devtools(
    combine(
      {
        hackedBy: 'Blade',
      },
      (get: any, set: any) => ({
        ui: storeUI(set),
        v: storeVirtuals(get, set),
        tours: storeTours(set),
        ...storeGeneral(set),
        ...storeDialogs(get, set),
        ...storeFeatures(set),
        ...storeWebAudio(set),
        ...storeSpotify(set),
        ...storeYoutube(set),
        ...storeApiDevices(set),
        ...storeConfig(get, set),
        ...storeIntegrations(get, set),
        ...storePresets(get, set),
        ...storeScenes(get, set),
        ...storeVirtuals(get, set),
      })
    )
  )
);

export default useStore;
