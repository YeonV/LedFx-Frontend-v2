import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

const storeColors = (set: any) => ({
  colors: {
    colors: {
      user: {} as Record<string, string>,
      builtin: {} as Record<string, string>
    },
    gradients: {
      user: {} as Record<string, string>,
      builtin: {} as Record<string, string>
    }
  },
  getColors: async () => {
    const resp = await Ledfx('/api/colors', set)
    if (resp) {
      set(
        produce((s: IStore) => {
          s.colors = resp
        }),
        false,
        'gotColors'
      )
    }
  },
  // HERE API DOC
  addColor: async (config: Record<string, string>) =>
    await Ledfx(
      '/api/colors',
      'POST',
      { ...config } // { 'name': 'string' }
    ),
  deleteColors: async (colorkey: string[]) => {
    const results = await Promise.all(
      colorkey.map((color) => Ledfx(`/api/colors/${encodeURIComponent(color)}`, 'DELETE'))
    )
    return results
  }
})

export default storeColors
