import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

const storeAssets = (set: any) => ({
  assets: [] as any[],

  getAssets: async () => {
    const resp = await Ledfx('/api/assets')
    if (resp && resp.assets) {
      set(
        produce((state: IStore) => {
          state.assets = resp.assets
        }),
        false,
        'api/getAssets'
      )
    }
  },

  uploadAsset: async (file: File, filename: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('type', file.type)

    const resp = await Ledfx('/api/assets', 'POST', formData)
    // if (resp) {
    //   console.log('Asset uploaded:', resp)
    // }
    return resp
  },

  deleteAsset: async (filename: string) => {
    const encodedFilename = encodeURIComponent(filename)
    const resp = await Ledfx(`/api/assets/${encodedFilename}`, 'DELETE')
    if (resp) {
      console.log('Asset deleted:', filename)
      // Refresh the assets list
      set(
        produce((state: IStore) => {
          state.assets = state.assets.filter((asset: any) => asset.filename !== filename)
        }),
        false,
        'api/deleteAsset'
      )
    }
    return resp
  }
})

export default storeAssets
