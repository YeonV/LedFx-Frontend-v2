/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore, IOpenRgbDevice } from '../useStore'

const storeActions = (set: any) => ({
  scanForOpenRgbDevices: async () => {
    const resp = await Ledfx('/api/find_openrgb', 'GET', {})
    if (resp && resp.status === 'success') {
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
                d.type === 0 ? 'mdi:chip'
              : d.type === 2 ? 'mdi:expansion-card-variant'
              : d.type === 6 ? (d.name.includes('Razer') ? 'razer:mouse' : 'mouse')
              : 'mdi:led-strip',
              center_offset: 0,
              refresh_rate: 64,
              openrgb_id: d.id,
              pixel_count: d.leds,
              port: 6742,
              name: d.name,
              ip_address: '127.0.0.1',
            },
          })
      )
    }
  },
  scanForLaunchpadDevices: async () => {
    const resp = await Ledfx('/api/find_launchpad', 'GET', {})
    if (resp && resp.status === 'success' && resp.device) {
      set(
        produce((state: IStore) => {
          state.launchpadDevice = resp.device
        }),
        false,
        'api/scanForDevices'
      )
      return await Ledfx('/api/devices', 'POST', {
        type: 'launchpad',
        config: {
          center_offset: 0,
          refresh_rate: 64,
          pixel_count: resp.device.pixels,
          rows: resp.device.rows,
          icon_name: 'launchpad',
          create_segments: resp.device.name === 'Launchpad X',
          name: resp.device.name,
        },
      })
    }
    return false
  },
  scanForDevices: async () => {
    const resp = await Ledfx('/api/find_devices', 'POST', {
      name_to_icon: {
        'Desk': 'mdi:desk',
        'Desktop': 'mdi:desktop-classic',
        'Monitor': 'mdi:monitor',
        'TV': 'mdi:television',
        'Kitchen': 'mdi:stove',
        'Fridge': 'mdi:fridge',
        'Bed': 'mdi:bed',
        'Radiator': 'mdi:radiator',
        'Heater': 'mdi:radiator',
        'Cinema': 'mdi:theater',
        'Water': 'mdi:water-pump',
        'Matrix': 'mdi:table-large',
        'Wardrobe': 'mdi:wardrobe',
        'Cupboard': 'mdi:cupboard',
        'Speaker': 'mdi:speaker',
        'Chair': 'mdi:chair-rolling',
        'Couch': 'mdi:sofa',
        'Sofa': 'mdi:sofa',
        'Cloud': 'mdi:cloud',
        'Roof': 'mdi:home-roof',
        'Cat': 'mdi:cat',
        'Dog': 'mdi:dog',
        'Bat': 'mdi:bat',
        'Elephant': 'mdi:elephant',
        'Fish': 'mdi:fish',
        'Dolphin': 'mdi:dolphin',
        'Duck': 'mdi:duck',
        'Panda': 'mdi:panda',
        'Kangaroo': 'mdi:kangaroo',
        'Snake': 'mdi:snake',
        'Rabbit': 'mdi:rabbit',
        'Plant': 'mdi:flower',
        'Flower': 'mdi:flower',
        'Tree': 'mdi:tree',
        'Palm': 'mdi:palm-tree',
        'Xmas': 'mdi:pine-tree',
        'Christmas': 'mdi:pine-tree',
        'DJ': 'mdi:album',
        'EQ': 'mdi:equalizer',
        'Headphones': 'mdi:headphones',
        'Car': 'mdi:car',
        'Halloween': 'mdi:halloween',
        'Bath': 'mdi:bathtub',
        'Balcony': 'mdi:balcony',
        'Cradle': 'mdi:cradle',
        'Guitar': 'mdi:guitar-acoustic',
        'Bugle': 'mdi:bugle',
        'Saxophone': 'mdi:saxophone',
        'Violin': 'mdi:violin',
        'Trumpet': 'mdi:trumpet',
        'Bride': 'mdi:bride',
        'Castle': 'mdi:castle',
        'Rocket': 'mdi:rocket',
        'Billiards': 'mdi:billiards',
        'Bowling': 'mdi:bowling',
        'Logo-III-Y': 'yz:logo3y',
        'Logo-III-Z': 'yz:logo3z',
        'Logo-III-Top': 'yz:logo3top',
        'Logo-III-Left': 'yz:logo3left',
        'Logo-III-Right': 'yz:logo3right',
        'Logo-III': 'yz:logo3',
        'Logo-II-Y': 'yz:logo2y',
        'Logo-II-Z': 'yz:logo2z',
        'Logo-II-Top': 'yz:logo2top',
        'Logo-II-Bottom': 'yz:logo2bot',
        'Logo-II': 'yz:logo2',
    }
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
      action: 'shutdown',
    }),
  restart: async () =>
    await Ledfx('/api/power', 'POST', {
      timeout: 0,
      action: 'restart',
    }),
  getInfo: async () => await Ledfx('/api/info'),
  getPing: async (virtId: string) => await Ledfx(`/api/ping/${virtId}`),
})

export default storeActions
