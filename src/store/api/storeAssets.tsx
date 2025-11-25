import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

const storeAssets = (set: any) => ({
  assets: [] as any[],

  getAssets: async () => {
    // Mock data for now - remove when backend is ready
    const mockAssets = [
      {
        id: '1',
        filename: 'example-image.png',
        type: 'image/png',
        size: 245678,
        url: 'https://via.placeholder.com/300'
      },
      {
        id: '2',
        filename: 'test-photo.jpg',
        type: 'image/jpeg',
        size: 512345,
        url: 'https://via.placeholder.com/300/0000FF'
      }
    ]

    set(
      produce((state: IStore) => {
        state.assets = mockAssets
      }),
      false,
      'api/getAssets'
    )

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
    if (resp) {
      console.log('Asset uploaded:', resp)
    }
    return resp
  },

  deleteAsset: async (id: string) => {
    const resp = await Ledfx(`/api/assets/${id}`, 'DELETE')
    if (resp) {
      console.log('Asset deleted:', id)
      // Refresh the assets list
      set(
        produce((state: IStore) => {
          state.assets = state.assets.filter((asset: any) => asset.id !== id)
        }),
        false,
        'api/deleteAsset'
      )
    }
    return resp
  }
})

export default storeAssets
