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
  DeletePlaylistApiResponse,
  PlaylistTiming,
  PlaylistItem
} from '../../api/ledfx.types'

// Event-driven state update helpers
const handlePlaylistStartedEvent = (state: IStore, data: any) => {
  state.currentPlaylist = data.playlist_id
  if (!state.playlistRuntimeState) {
    state.playlistRuntimeState = {} as PlaylistRuntimeState
  }
  state.playlistRuntimeState.active_playlist = data.playlist_id
  state.playlistRuntimeState.index = data.index
  state.playlistRuntimeState.scene_id = data.scene_id
  state.playlistRuntimeState.effective_duration_ms = data.effective_duration_ms
  state.playlistRuntimeState.paused = false
  state.sceneStartTime = Date.now() // Record when scene started
}

const handlePlaylistAdvancedEvent = (state: IStore, data: any) => {
  if (!state.playlistRuntimeState) return
  state.playlistRuntimeState.index = data.index
  state.playlistRuntimeState.scene_id = data.scene_id
  state.playlistRuntimeState.effective_duration_ms = data.effective_duration_ms
  state.sceneStartTime = Date.now() // Record when new scene started
}

const handlePlaylistStoppedEvent = (state: IStore) => {
  state.currentPlaylist = null
  state.playlistRuntimeState = null
}

const handlePlaylistPausedEvent = (state: IStore, data: any) => {
  if (!state.playlistRuntimeState) return
  state.playlistRuntimeState.paused = true
  state.playlistRuntimeState.remaining_ms = data.remaining_ms
}

const handlePlaylistResumedEvent = (state: IStore, data: any) => {
  if (!state.playlistRuntimeState) return
  state.playlistRuntimeState.paused = false
  state.playlistRuntimeState.remaining_ms = data.remaining_ms
}

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
  sceneStartTime: Date.now() as number, // Timestamp when current scene started

  // Event handlers for WebSocket events
  onPlaylistStarted: (data: any) => {
    set(
      produce((state: IStore) => {
        handlePlaylistStartedEvent(state, data)
      }),
      false,
      'playlist/started'
    )
    // Request full state to get scenes order per MSC
    useStore.getState().getPlaylistState()
  },

  onPlaylistAdvanced: (data: any) => {
    set(
      produce((state: IStore) => {
        handlePlaylistAdvancedEvent(state, data)
      }),
      false,
      'playlist/advanced'
    )
    // If index hits 0, we're in a new cycle - request state to get new order
    if (data.index === 0) {
      useStore.getState().getPlaylistState()
    }
  },

  onPlaylistStopped: () => {
    set(
      produce((state: IStore) => {
        handlePlaylistStoppedEvent(state)
      }),
      false,
      'playlist/stopped'
    )
  },

  onPlaylistPaused: (data: any) => {
    set(
      produce((state: IStore) => {
        handlePlaylistPausedEvent(state, data)
      }),
      false,
      'playlist/paused'
    )
  },

  onPlaylistResumed: (data: any) => {
    set(
      produce((state: IStore) => {
        handlePlaylistResumedEvent(state, data)
      }),
      false,
      'playlist/resumed'
    )
  },

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

  updatePlaylist: async (playlistId: string, name: string, config: Partial<PlaylistConfig>) => {
    const updatedConfig = { ...config, name, id: playlistId }
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
    const resp: DeletePlaylistApiResponse = await Ledfx(`/api/playlists/${playlistId}`, 'DELETE')
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

    return state.updatePlaylist(playlistId, playlist.name, {
      items: updatedItems
    })
  },

  removeItemFromPlaylist: async (playlistId: string, itemIndex: number) => {
    const state = useStore.getState()
    const playlist = state.playlists[playlistId]
    if (!playlist || !Array.isArray(playlist.items)) return null

    const updatedItems = playlist.items.filter((_, index) => index !== itemIndex)

    return state.updatePlaylist(playlistId, playlist.name, {
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

    return state.updatePlaylist(playlistId, playlist.name, {
      items
    })
  },

  // Add method to update playlist mode in stored config
  updatePlaylistMode: async (playlistId: string, mode: 'sequence' | 'shuffle') => {
    const state = useStore.getState()
    const playlist = state.playlists[playlistId]
    if (!playlist) return null

    return state.updatePlaylist(playlistId, playlist.name, { mode })
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
