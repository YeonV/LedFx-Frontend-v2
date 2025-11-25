import { Ledfx } from '../../api/ledfx'

const storeAssets = () => ({
  assets: [] as any[],
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
  }
})

export default storeAssets
