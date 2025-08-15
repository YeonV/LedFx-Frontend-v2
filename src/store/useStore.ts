import { create } from 'zustand'
import { devtools, combine, persist } from 'zustand/middleware'

import storeGeneral from './ui/storeGeneral'
import storeFeatures from './ui/storeFeatures'
import storeTours from './ui/storeTours'
import storeUI from './ui/storeUI'
import storeUser from './ui/storeUser'
import storeDialogs from './ui/storeDialogs'
import storeSpotify from './ui/storeSpotify'
import storeQLC from './ui/storeQLC'
import storeWebAudio from './ui/storeWebAudio'
import storeCloud from './ui/storeCloud'
import storeYoutube from './ui/storeYoutube'
import storeDevices from './api/storeDevices'
import storeVirtuals from './api/storeVirtuals'
import storeScenes from './api/storeScenes'
import storeIntegrations from './api/storeIntegrations'
import storeIntegrationsSpotify from './api/storeIntegrationsSpotify'
import storePresets from './api/storePresets'
import storeConfig from './api/storeConfig'
import storeActions from './api/storeActions'
import storeColors from './api/storeColors'
import storeSpotifyActions from './ui/storeSpotifyActions'
import storeQLCActions from './ui/storeQLCActions'
import storeNotifications from './ui/storeNotifications'
import storePad from './ui/storePad'
import storeMidi from './ui/storeMidi'
import storeVideo from './ui/storeVideo'
import storeUIPersist from './ui-persist/storeUIpersist'
import storeUIPersistActions from './ui-persist/storeUIpersistActions'
import storeSongDectector from './ui/storeSongDectector'
import { frontendConfig, log } from '../utils/helpers'
import { migrations, MigrationState } from './migrate'
import storeMatrix from './ui/storeMatrix'

const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade'
        },
        (set, get) => ({
          ui: storeUI(set),
          uiPersist: storeUIPersist(),
          spotify: storeSpotify(),
          qlc: storeQLC(),
          user: storeUser(set),
          ...storeMatrix(set),
          ...storeUIPersistActions(set),
          ...storePad(set),
          ...storeMidi(set, get),
          ...storeVideo(set),
          ...storeNotifications(set),
          ...storeTours(set),
          ...storeSpotifyActions(set),
          ...storeQLCActions(set),
          ...storeGeneral(set),
          ...storeDialogs(set),
          ...storeFeatures(set),
          ...storeWebAudio(set),
          ...storeYoutube(set),
          ...storeSongDectector(set),
          ...storeColors(set),
          ...storeDevices(set),
          ...storeVirtuals(set),
          ...storeScenes(set),
          ...storeIntegrations(set),
          ...storePresets(set),
          ...storeConfig(set),
          ...storeActions(set),
          ...storeIntegrationsSpotify(set),

          ...storeCloud(set)
        })
      ),
      {
        name: 'ledfx-storage',
        version: frontendConfig,
        migrate: (persistedState, version) => {
          log('infoConfig Migrator', `Migrating from version ${version} to ${frontendConfig}`)
          let state = persistedState as MigrationState
          for (let i = version + 1; i <= frontendConfig; i++) {
            if (migrations[i]) {
              state = migrations[i](state)
            }
          }

          return state
        },
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) =>
                ![
                  'dialogs',
                  'disconnected',
                  'ui',
                  'spotify',
                  'pixelGraphs',
                  'externalStudioRef'
                ].includes(key)
            )
          )
      }
    )
  )
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const state = useStore.getState()
export type IStore = typeof state

export interface IOpenRgbDevice {
  name: string
  type: number
  id: number
  leds: number
}

export default useStore
