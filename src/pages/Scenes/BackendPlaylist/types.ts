export interface BackendPlaylistProps {
  maxWidth?: string | number
  cards?: boolean
}

export interface PlaylistSelectorProps {
  currentPlaylist: string | null
  playlists: any
  onPlaylistChange: (playlistId: string) => void
  onEdit: () => void
  onDelete: () => void
  onCreate: () => void
  canEdit: boolean
}

export interface PlaybackControlsProps {
  selectedPlaylist: string | null
  playlistName: string
  playlistImage: string
  isPlaying: boolean
  isPaused: boolean
  playlistRuntimeState: any
  runtimeMode: string | undefined
  onPlayPause: () => void
  onStop: () => void
  onNext: () => void
  onPrevious: () => void
  onToggleMode: () => void
}

export interface ProgressBarProps {
  progress: number
  localElapsedMs: number
  effectiveDurationMs: number | undefined
  currentSceneIndex: number
  totalScenes: number
  isPlaying: boolean
  isSceneChange: boolean
}

export interface PlaylistItemsGridProps {
  playlistItems: any[]
  currentSceneIndex: number
  isPlaying: boolean
  isPaused: boolean
  scenes: any
  currentPlaylistConfig: any
  playlistRuntimeState: any
  onActivateScene: (sceneId: string) => void
}

export interface PlaylistDialogProps {
  open: boolean
  isEdit: boolean
  playlist: Partial<any>
  scenes: any
  onClose: () => void
  onSave: () => void
  onChange: (playlist: Partial<any>) => void
}
