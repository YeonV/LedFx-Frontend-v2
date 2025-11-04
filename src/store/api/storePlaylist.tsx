import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import useStore from '../useStore'
import {
  PlaylistConfig,
  PlaylistRuntimeState,
  GetPlaylistsApiResponse,
  GetSinglePlaylistApiResponse,
  CreatePlaylistApiResponse,
  PlaylistControlRequest,
  PlaylistControlApiResponse,
  DeletePlaylistRequest,
  DeletePlaylistApiResponse,
  PlaylistTiming,
  PlaylistItem
} from '../../api/ledfx.types'

export interface IPlaylistOrder {
  playlistId: string
  order: number
}

const storePlaylist = (set: any) => ({
  // State
  playlists: {} as Record<string, PlaylistConfig>,
  currentPlaylist: null as string | null,
  playlistRuntimeState: null as PlaylistRuntimeState | null,
  playlistOrder: [] as IPlaylistOrder[],

  // Playlist Order Management
  setPlaylistOrder: (order: IPlaylistOrder[]) => {
    set(
      produce((state: IStore) => {
        state.playlistOrder = order
      }),
      false,
      'setPlaylistOrder'
    )
  },

  setCurrentPlaylist: (playlistId: string | null) => {
    set(
      produce((state: IStore) => {
        state.currentPlaylist = playlistId
      }),
      false,
      'setCurrentPlaylist'
    )
  },

  // CRUD Operations
  getPlaylists: async () => {
    const resp: GetPlaylistsApiResponse = await Ledfx('/api/playlists')
    if (resp && resp.playlists) {
      set(
        produce((state: IStore) => {
          state.playlists = resp.playlists
        }),
        false,
        'api/gotPlaylists'
      )
    }
    return resp
  },

  getPlaylist: async (playlistId: string) => {
    const resp: GetSinglePlaylistApiResponse = await Ledfx(`/api/playlists/${playlistId}`)
    if (resp && resp.data?.playlist) {
      set(
        produce((state: IStore) => {
          state.playlists[playlistId] = resp.data!.playlist
        }),
        false,
        'api/gotSinglePlaylist'
      )
    }
    return resp
  },

  createPlaylist: async (config: Omit<PlaylistConfig, 'id'> & { id?: string }) => {
    const resp: CreatePlaylistApiResponse = await Ledfx('/api/playlists', 'POST', config)
    if (resp && resp.data?.playlist) {
      set(
        produce((state: IStore) => {
          state.playlists[resp.data!.playlist.id] = resp.data!.playlist
        }),
        false,
        'api/createdPlaylist'
      )
    }
    return resp
  },

  updatePlaylist: async (playlistId: string, config: Partial<PlaylistConfig>) => {
    const updatedConfig = { ...config, id: playlistId }
    const resp: CreatePlaylistApiResponse = await Ledfx('/api/playlists', 'POST', updatedConfig)
    if (resp && resp.data?.playlist) {
      set(
        produce((state: IStore) => {
          state.playlists[playlistId] = resp.data!.playlist
        }),
        false,
        'api/updatedPlaylist'
      )
    }
    return resp
  },

  deletePlaylist: async (playlistId: string) => {
    const deleteRequest: DeletePlaylistRequest = { id: playlistId }
    const resp: DeletePlaylistApiResponse = await Ledfx('/api/playlists', 'DELETE', deleteRequest)
    if (resp && resp.status === 'success') {
      set(
        produce((state: IStore) => {
          delete state.playlists[playlistId]
          if (state.currentPlaylist === playlistId) {
            state.currentPlaylist = null
            state.playlistRuntimeState = null
          }
        }),
        false,
        'api/deletedPlaylist'
      )
    }
    return resp
  },

  // Playlist Control Operations
  startPlaylist: async (
    playlistId: string,
    mode?: 'sequence' | 'shuffle',
    timing?: PlaylistTiming
  ) => {
    const controlRequest: PlaylistControlRequest = {
      action: 'start',
      id: playlistId,
      ...(mode && { mode }),
      ...(timing && { timing })
    }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.currentPlaylist = playlistId
          state.playlistRuntimeState = resp.data!.state
        }),
        false,
        'api/startedPlaylist'
      )
    }
    return resp
  },

  stopPlaylist: async () => {
    const controlRequest: PlaylistControlRequest = { action: 'stop' }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.status === 'success') {
      set(
        produce((state: IStore) => {
          state.currentPlaylist = null
          state.playlistRuntimeState = null
        }),
        false,
        'api/stoppedPlaylist'
      )
    }
    return resp
  },

  pausePlaylist: async () => {
    const controlRequest: PlaylistControlRequest = { action: 'pause' }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.playlistRuntimeState = resp.data!.state
        }),
        false,
        'api/pausedPlaylist'
      )
    }
    return resp
  },

  resumePlaylist: async () => {
    const controlRequest: PlaylistControlRequest = { action: 'resume' }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.playlistRuntimeState = resp.data!.state
        }),
        false,
        'api/resumedPlaylist'
      )
    }
    return resp
  },

  nextPlaylistItem: async () => {
    const controlRequest: PlaylistControlRequest = { action: 'next' }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.playlistRuntimeState = resp.data!.state
        }),
        false,
        'api/nextPlaylistItem'
      )
    }
    return resp
  },

  previousPlaylistItem: async () => {
    const controlRequest: PlaylistControlRequest = { action: 'prev' }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.playlistRuntimeState = resp.data!.state
        }),
        false,
        'api/previousPlaylistItem'
      )
    }
    return resp
  },

  getPlaylistState: async () => {
    const controlRequest: PlaylistControlRequest = { action: 'state' }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.playlistRuntimeState = resp.data!.state
          // Update current playlist if state indicates one is active
          if (resp.data!.state.active_playlist) {
            state.currentPlaylist = resp.data!.state.active_playlist
          }
        }),
        false,
        'api/gotPlaylistState'
      )
    }
    return resp
  },

  // Helper methods for playlist management
  addItemToPlaylist: async (playlistId: string, item: PlaylistItem) => {
    const state = useStore.getState()
    const playlist = state.playlists[playlistId]
    if (!playlist) return null

    const updatedItems = Array.isArray(playlist.items) ? [...playlist.items, item] : [item]

    return state.updatePlaylist(playlistId, {
      items: updatedItems
    })
  },

  removeItemFromPlaylist: async (playlistId: string, itemIndex: number) => {
    const state = useStore.getState()
    const playlist = state.playlists[playlistId]
    if (!playlist || !Array.isArray(playlist.items)) return null

    const updatedItems = playlist.items.filter((_, index) => index !== itemIndex)

    return state.updatePlaylist(playlistId, {
      items: updatedItems
    })
  },

  reorderPlaylistItems: async (playlistId: string, fromIndex: number, toIndex: number) => {
    const state = useStore.getState()
    const playlist = state.playlists[playlistId]
    if (!playlist || !Array.isArray(playlist.items)) return null

    const items = [...playlist.items]
    const [movedItem] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, movedItem)

    return state.updatePlaylist(playlistId, {
      items
    })
  },

  // Add method to update playlist mode in stored config
  updatePlaylistMode: async (playlistId: string, mode: 'sequence' | 'shuffle') => {
    const state = useStore.getState()
    const playlist = state.playlists[playlistId]
    if (!playlist) return null

    return state.updatePlaylist(playlistId, { mode })
  },

  // Add method to start playlist with runtime mode override
  startPlaylistWithMode: async (
    playlistId: string,
    runtimeMode?: 'sequence' | 'shuffle',
    timing?: PlaylistTiming
  ) => {
    const controlRequest: PlaylistControlRequest = {
      action: 'start',
      id: playlistId,
      ...(runtimeMode && { mode: runtimeMode }),
      ...(timing && { timing })
    }
    const resp: PlaylistControlApiResponse = await Ledfx('/api/playlists', 'PUT', controlRequest)
    if (resp && resp.data?.state) {
      set(
        produce((state: IStore) => {
          state.currentPlaylist = playlistId
          state.playlistRuntimeState = resp.data!.state
        }),
        false,
        'api/startedPlaylistWithMode'
      )
    }
    return resp
  }
})

export default storePlaylist
