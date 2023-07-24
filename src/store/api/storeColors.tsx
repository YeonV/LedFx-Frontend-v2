/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'

const storeColors = (set: any) => ({
  colors: {
    colors: {
      user: {} as any,
      builtin: {} as any
    },
    gradients: {
      user: {} as any,
      builtin: {} as any
    }
  },
  getColors: async () => {
    const resp = await Ledfx('/api/colors', set)
    if (resp) {
      set(
        produce((s: any) => {
          s.colors = resp
        }),
        false,
        'gotColors'
      )
    }
  },
  // HERE API DOC
  addColor: async (config: any) =>
    await Ledfx(
      '/api/colors',
      'POST',
      { ...config } // { 'name': 'string' }
    ),
  deleteColors: async (colorkey: any) =>
    await Ledfx('/api/colors', 'DELETE', {
      data: colorkey
    })
})

export default storeColors
