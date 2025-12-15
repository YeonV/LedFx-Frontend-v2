import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

interface CacheEntry {
  url: string
  cached_at: string
  last_accessed: string
  access_count: number
  file_size: number
  content_type: string
  width: number
  height: number
  format: string | null
  n_frames: number
  is_animated: boolean
}

interface CacheStats {
  total_size: number
  total_count: number
  max_size: number
  max_count: number
  cache_policy: {
    expiration: string
    refresh: string
    eviction: string
  }
  entries: CacheEntry[]
}

interface Asset {
  path: string
  size: number
  modified: string
  width: number
  height: number
  format: string | null
  n_frames: number
  is_animated: boolean
}

const storeAssets = (set: any) => ({
  assets: [] as Asset[],
  assetsFixed: [] as Asset[],
  cacheStats: null as CacheStats | null,

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

  getAssetsFixed: async () => {
    const resp = await Ledfx('/api/assets_fixed')
    if (resp && resp.assets) {
      set(
        produce((state: IStore) => {
          state.assetsFixed = resp.assets
        }),
        false,
        'api/getAssetsFixed'
      )
    }
    return resp
  },

  uploadAsset: async (file: File, filename: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', filename)
    // formData.append('type', file.type)

    const resp = await Ledfx('/api/assets', 'POST', formData)
    return resp
  },

  deleteAsset: async (filename: string) => {
    const encodedFilename = encodeURIComponent(filename)
    const resp = await Ledfx(`/api/assets?path=${encodedFilename}`, 'DELETE')
    if (resp) {
      console.log('Asset deleted:', filename)
      set(
        produce((state: IStore) => {
          state.assets = state.assets.filter((asset: any) => asset.path !== filename)
        }),
        false,
        'api/deleteAsset'
      )
    }
    return resp
  },

  getCacheStats: async () => {
    const resp = await Ledfx('/api/cache/images')
    if (resp) {
      set(
        produce((state: IStore) => {
          state.cacheStats = resp
        }),
        false,
        'api/getCacheStats'
      )
    }
    return resp
  },

  clearCache: async (url?: string) => {
    const endpoint = url ? `/api/cache/images?url=${encodeURIComponent(url)}` : '/api/cache/images'

    const resp = await Ledfx(endpoint, 'DELETE')
    if (resp && resp.status === 'success') {
      // Refresh cache stats after clearing
      set(
        produce((state: IStore) => {
          if (!url && state.cacheStats) {
            // Entire cache cleared
            state.cacheStats.entries = []
            state.cacheStats.total_count = 0
            state.cacheStats.total_size = 0
          } else if (url && state.cacheStats) {
            // Specific URL cleared
            state.cacheStats.entries = state.cacheStats.entries.filter(
              (entry: CacheEntry) => entry.url !== url
            )
            state.cacheStats.total_count = state.cacheStats.entries.length
            state.cacheStats.total_size = state.cacheStats.entries.reduce(
              (sum: number, entry: CacheEntry) => sum + entry.file_size,
              0
            )
          }
        }),
        false,
        'api/clearCache'
      )
    }
    return resp
  },

  refreshCacheImage: async (url: string) => {
    const resp = await Ledfx('/api/cache/images/refresh', 'POST', { url })
    if (resp && resp.status === 'success') {
      // Remove from cache stats if it was there
      set(
        produce((state: IStore) => {
          if (state.cacheStats) {
            state.cacheStats.entries = state.cacheStats.entries.filter(
              (entry: CacheEntry) => entry.url !== url
            )
            state.cacheStats.total_count = state.cacheStats.entries.length
            state.cacheStats.total_size = state.cacheStats.entries.reduce(
              (sum: number, entry: CacheEntry) => sum + entry.file_size,
              0
            )
          }
        }),
        false,
        'api/refreshCacheImage'
      )
    }
    return resp
  }
})

export default storeAssets
