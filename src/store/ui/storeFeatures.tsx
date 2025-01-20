import { produce } from 'immer'
import type { IStore } from '../useStore'

export type IFeatures =
  | 'dev'
  | 'cloud'
  | 'wled'
  | 'integrations'
  | 'spotify'
  | 'spotifypro'
  | 'youtube'
  | 'webaudio'
  | 'waves'
  | 'streamto'
  | 'effectfilter'
  | 'transitions'
  | 'frequencies'
  | 'go'
  | 'dashboard'
  | 'beta'
  | 'sceneexternal'
  | 'scenemidi'
  | 'dashboardDetailed'
  | 'scenetables'
  | 'scenechips'
  | 'alpha'
  | 'matrix'
  | 'matrix_cam'
  | 'mqtt'
  | 'mqtt_hass'
  | 'gamepad'
  | 'wakelock'
  | 'melbankGraph'
  | 'websocket_debug'

const storeFeatures = (set: any) => ({
  features: {
    dev: false,
    cloud: false,
    wled: false,
    integrations: false,
    spotify: false,
    spotifypro: false,
    youtube: false,
    webaudio: false,
    waves: false,
    streamto: false,
    effectfilter: false,
    transitions: false,
    frequencies: false,
    go: false,
    dashboard: false,
    dashboardDetailed: false,
    scenetables: false,
    scenechips: false,
    sceneexternal: false,
    scenemidi: false,
    beta: false,
    alpha: false,
    matrix: false,
    mqtt: false,
    mqtt_hass: false,
    gamepad: false,
    matrix_cam: false,
    wakelock: false,
    melbankGraph: false,
    websocket_debug: false
  },
  showFeatures: {
    dev: false,
    cloud: false,
    wled: false,
    integrations: true,
    spotify: false,
    spotifypro: false,
    youtube: false,
    webaudio: false,
    waves: false,
    streamto: false,
    effectfilter: false,
    transitions: false,
    frequencies: false,
    go: false,
    dashboard: false,
    dashboardDetailed: false,
    scenetables: false,
    scenechips: false,
    sceneexternal: false,
    scenemidi: false,
    beta: false,
    alpha: false,
    matrix: false,
    mqtt: false,
    mqtt_hass: false,
    gamepad: false,
    matrix_cam: false,
    wakelock: false,
    melbankGraph: false,
    websocket_debug: false
  },
  setFeatures: (feat: IFeatures, use: boolean): void =>
    set(
      produce((state: IStore) => {
        state.features[feat] = use
      }),
      false,
      'ui/setFeature'
    ),
  setShowFeatures: (feat: IFeatures, show: boolean): void =>
    set(
      produce((state: IStore) => {
        state.showFeatures[feat] = show
      }),
      false,
      'ui/setShowFeature'
    )
})

export default storeFeatures
