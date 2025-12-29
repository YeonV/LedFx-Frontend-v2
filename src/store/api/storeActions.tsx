import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore, IOpenRgbDevice } from '../useStore'
import nameToIcon from '../../utils/nameToIcon'

const storeActions = (set: any) => ({
  scanForOpenRgbDevices: async () => {
    const resp = await Ledfx('/api/find_openrgb', 'GET', {})
    if (resp && resp.status === 'success' && resp.devices) {
      set(
        produce((state: IStore) => {
          state.openRgbDevices = resp.devices as IOpenRgbDevice[]
        }),
        false,
        'api/scanForDevices'
      )
      resp.devices.map(
        async (d: IOpenRgbDevice) =>
          await Ledfx('/api/devices', 'POST', {
            type: 'openrgb',
            config: {
              icon_name:
                d.type === 0
                  ? 'mdi:chip'
                  : d.type === 2
                    ? 'mdi:expansion-card-variant'
                    : d.type === 5
                      ? 'mdi:keyboard'
                      : d.type === 6
                        ? d.name.includes('Razer')
                          ? 'razer:mouse'
                          : 'mouse'
                        : d.type === 8
                          ? 'mdi:headphones'
                          : d.type === 9
                            ? 'mdi:headphones-bluetooth'
                            : d.type === 10
                              ? 'sportsEsports'
                              : d.type === 12
                                ? 'mdi:speaker-wireless'
                                : 'mdi:led-strip',
              center_offset: 0,
              refresh_rate: 64,
              openrgb_id: d.id,
              pixel_count: d.leds,
              port: 6742,
              name: d.name,
              ip_address: '127.0.0.1'
            }
          })
      )
    }
  },
  scanForLaunchpadDevices: async () => {
    const resp = await Ledfx('/api/find_launchpad', 'GET', {})
    if (resp && resp.status === 'success' && resp.data) {
      set(
        produce((state: IStore) => {
          state.launchpadDevice = resp.data
        }),
        false,
        'api/scanForDevices'
      )
      return await Ledfx('/api/devices', 'POST', {
        type: 'launchpad',
        config: {
          center_offset: 0,
          refresh_rate: 64,
          pixel_count: resp.data.pixels,
          rows: resp.data.rows,
          icon_name: 'launchpad',
          create_segments: resp.data.name === 'Launchpad X',
          name: resp.data.name
        }
      })
    }
    return false
  },
  scanForDevices: async () => {
    const resp = await Ledfx('/api/find_devices', 'POST', {
      name_to_icon: nameToIcon
    })
    if (!(resp && resp.status === 'success')) {
      set(
        produce((state: IStore) => {
          state.dialogs.nohost.open = true
        }),
        false,
        'api/scanForDevices'
      )
    }
  },

  paused: false,
  togglePause: async () => {
    const resp = await Ledfx('/api/virtuals', 'PUT', {})
    if (resp && resp.paused !== undefined) {
      set(
        produce((s: IStore) => {
          s.paused = resp.paused
        }),
        false,
        'gotPaused'
      )
    }
  },

  shutdown: async () =>
    await Ledfx('/api/power', 'POST', {
      timeout: 0,
      action: 'shutdown'
    }),
  restart: async () =>
    await Ledfx('/api/power', 'POST', {
      timeout: 0,
      action: 'restart'
    }),
  getInfo: async () => await Ledfx('/api/info'),
  getUpdateInfo: async (snackbar: boolean) =>
    await Ledfx('/api/check_for_updates', 'GET', {}, snackbar),
  getPing: async (virtId: string) => await Ledfx(`/api/ping/${virtId}`),

  getGifFrames: async (path_url: string) =>
    await Ledfx('/api/get_gif_frames', 'POST', {
      path_url
    })
})

export default storeActions
