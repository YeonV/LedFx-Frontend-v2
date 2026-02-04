import { useEffect, useState } from 'react'
import { Box, Card, Stack } from '@mui/material'
import { useSubscription } from '../../../utils/Websocket/WebSocketProvider'
import useStore from '../../../store/useStore'
import { useLocation } from 'react-router-dom'
import { useFireTv } from '../../../components/FireTv/useFireTv'
import ExpanderCard from '../ExpanderCard'
import PlaylistSelector from './PlaylistSelector'
import PlaybackControls from './PlaybackControls'
import ProgressBar from './ProgressBar'
import PlaylistItemsGrid from './PlaylistItemsGrid'
import PlaylistDialog from './PlaylistDialog'
import PlaylistCardsView from './PlaylistCardsView'
import type { PlaylistConfig, PlaylistItem } from '../../../api/ledfx.types'
import { BackendPlaylistProps } from './types'

export default function BackendPlaylist({ maxWidth = 486, cards = false }: BackendPlaylistProps) {
  const location = useLocation()
  const isPlaylistPage = location.pathname === '/Playlists'

  // Store hooks
  const scenes = useStore((state) => state.scenes)
  const playlists = useStore((state) => state.playlists)
  const currentPlaylist = useStore((state) => state.currentPlaylist)
  const setCurrentPlaylist = useStore((state) => state.setCurrentPlaylist)
  const playlistRuntimeState = useStore((state) => state.playlistRuntimeState)
  const getPlaylists = useStore((state) => state.getPlaylists)
  const createPlaylist = useStore((state) => state.createPlaylist)
  const updatePlaylist = useStore((state) => state.updatePlaylist)
  const deletePlaylist = useStore((state) => state.deletePlaylist)
  const startPlaylist = useStore((state) => state.startPlaylist)
  const stopPlaylist = useStore((state) => state.stopPlaylist)
  const pausePlaylist = useStore((state) => state.pausePlaylist)
  const resumePlaylist = useStore((state) => state.resumePlaylist)
  const nextPlaylistItem = useStore((state) => state.nextPlaylistItem)
  const previousPlaylistItem = useStore((state) => state.previousPlaylistItem)
  const getPlaylistState = useStore((state) => state.getPlaylistState)
  const startPlaylistWithMode = useStore((state) => state.startPlaylistWithMode)
  const activateScene = useStore((state) => state.activateScene)
  const features = useStore((state) => state.features)
  const onPlaylistStarted = useStore((state) => state.onPlaylistStarted)
  const onPlaylistAdvanced = useStore((state) => state.onPlaylistAdvanced)
  const onPlaylistStopped = useStore((state) => state.onPlaylistStopped)
  const onPlaylistPaused = useStore((state) => state.onPlaylistPaused)
  const onPlaylistResumed = useStore((state) => state.onPlaylistResumed)
  const sceneStartTime = useStore((state) => state.sceneStartTime)

  // Subscribe to playlist events
  useSubscription('playlist_started', onPlaylistStarted)
  useSubscription('playlist_advanced', onPlaylistAdvanced)
  useSubscription('playlist_stopped', onPlaylistStopped)
  useSubscription('playlist_paused', onPlaylistPaused)
  useSubscription('playlist_resumed', onPlaylistResumed)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)
  const [newPlaylist, setNewPlaylist] = useState<Partial<PlaylistConfig>>({
    name: '',
    items: [],
    default_duration_ms: 5000,
    mode: 'sequence',
    timing: { jitter: { enabled: false, factor_min: 0.8, factor_max: 1.2 } },
    tags: [],
    image: 'QueueMusic'
  })

  // Initialize
  useEffect(() => {
    getPlaylists()
    getPlaylistState()
  }, [getPlaylists, getPlaylistState])

  useEffect(() => {
    if (!currentPlaylist && Object.keys(playlists).length > 0) {
      const firstPlaylistId = Object.keys(playlists)[0]
      setCurrentPlaylist(firstPlaylistId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists])

  const selectedPlaylist = currentPlaylist
  const currentPlaylistConfig = selectedPlaylist ? playlists[selectedPlaylist] : null
  const isPlaying =
    playlistRuntimeState?.active_playlist === selectedPlaylist && !playlistRuntimeState?.paused
  const isPaused =
    playlistRuntimeState?.active_playlist === selectedPlaylist && playlistRuntimeState?.paused

  const [localElapsedMs, setLocalElapsedMs] = useState<number>(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - sceneStartTime
      setLocalElapsedMs(elapsed)
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, sceneStartTime])

  const handleCreatePlaylist = async () => {
    if (!newPlaylist?.name) return

    const defaultPlaylist: Partial<PlaylistConfig> = {
      name: '',
      items: [],
      default_duration_ms: 5000,
      mode: 'sequence',
      timing: { jitter: { enabled: false, factor_min: 0.8, factor_max: 1.2 } },
      tags: [],
      image: 'QueueMusic'
    }
    const result = await createPlaylist({ ...defaultPlaylist, ...newPlaylist } as PlaylistConfig)
    if (result?.status === 'success') {
      setCreateDialogOpen(false)
      setNewPlaylist(defaultPlaylist)
      getPlaylists()
    }
  }

  const handleEditPlaylist = async () => {
    if (!editingPlaylistId || !newPlaylist?.name) return

    const result = await updatePlaylist(editingPlaylistId, newPlaylist.name, newPlaylist)
    if (result?.status === 'success') {
      setEditDialogOpen(false)
      setEditingPlaylistId(null)
      getPlaylists()
    }
  }

  const handleToggleRuntimeMode = async () => {
    if (!selectedPlaylist || !playlistRuntimeState) return

    const currentRuntimeMode = playlistRuntimeState.mode
    const newRuntimeMode = currentRuntimeMode === 'sequence' ? 'shuffle' : 'sequence'

    await startPlaylistWithMode(selectedPlaylist, newRuntimeMode, playlistRuntimeState.timing)
    getPlaylistState()
  }

  const handlePlayPause = async () => {
    if (!selectedPlaylist) return

    if (isPlaying) {
      await pausePlaylist()
    } else if (isPaused) {
      await resumePlaylist()
    } else {
      await startPlaylist(selectedPlaylist)
    }
    getPlaylistState()
  }

  const handleStop = async () => {
    await stopPlaylist()
    getPlaylistState()
  }

  const handleNext = async () => {
    await nextPlaylistItem()
    getPlaylistState()
  }

  const handlePrevious = async () => {
    await previousPlaylistItem()
    getPlaylistState()
  }

  useFireTv({
    enabled: features.firetv && !!selectedPlaylist && isPlaylistPage,
    play: {
      label: isPlaying ? 'Pause Playlist' : 'Play Playlist',
      action: selectedPlaylist ? () => handlePlayPause() : undefined
    },
    rewind: {
      label: 'Previous Scene',
      action: playlistRuntimeState ? () => handlePrevious() : undefined
    },
    forward: {
      label: 'Next Scene',
      action: playlistRuntimeState ? () => handleNext() : undefined
    }
  })

  const getPlaylistItemsToDisplay = () => {
    if (!currentPlaylistConfig) return []

    if (
      playlistRuntimeState?.active_playlist === selectedPlaylist &&
      playlistRuntimeState?.scenes &&
      playlistRuntimeState?.order
    ) {
      return playlistRuntimeState.scenes.map((sceneId: string, runtimeIndex: number) => {
        const configItem = currentPlaylistConfig.items?.find(
          (item: PlaylistItem) => item.scene_id === sceneId
        )
        return {
          scene_id: sceneId,
          duration_ms: configItem?.duration_ms,
          index: runtimeIndex
        }
      })
    }

    if (!currentPlaylistConfig.items || currentPlaylistConfig.items.length === 0) {
      return []
    }

    return currentPlaylistConfig.items.map((item: PlaylistItem, index: number) => ({
      ...item,
      index
    }))
  }

  const playlistItemsToDisplay = getPlaylistItemsToDisplay()
  const currentSceneIndex = playlistRuntimeState?.index || 0

  const progress = playlistRuntimeState?.effective_duration_ms
    ? Math.max(
        0,
        Math.min(100, (localElapsedMs / playlistRuntimeState.effective_duration_ms) * 100)
      )
    : 0

  const runtimeMode = playlistRuntimeState?.mode || currentPlaylistConfig?.mode

  const [prevProgress, setPrevProgress] = useState(0)
  const isSceneChange = progress < prevProgress - 50

  useEffect(() => {
    setPrevProgress(progress)
  }, [progress])

  const renderWidget = () => {
    return (
      <>
        <Card sx={{ background: 'transparent', borderColor: 'transparent', minWidth: '400px' }}>
          <Box sx={{ width: '100%', maxWidth: '800px', m: '0 auto' }}>
            {!cards && (
              <PlaylistSelector
                currentPlaylist={currentPlaylist}
                playlists={playlists}
                onPlaylistChange={setCurrentPlaylist}
                onEdit={() => {
                  setEditingPlaylistId(selectedPlaylist!)
                  setNewPlaylist(currentPlaylistConfig!)
                  setEditDialogOpen(true)
                }}
                onDelete={() => selectedPlaylist && deletePlaylist(selectedPlaylist)}
                onCreate={() => setCreateDialogOpen(true)}
                canEdit={!!currentPlaylistConfig?.items && currentPlaylistConfig?.items.length > 0}
              />
            )}

            <Box
              sx={
                cards
                  ? {
                      border: '1px solid #444',
                      borderRadius: 1,
                      mt: 1,
                      mb: 2,
                      py: 1
                    }
                  : {}
              }
            >
              <PlaybackControls
                selectedPlaylist={selectedPlaylist}
                playlistName={currentPlaylistConfig?.name || ''}
                playlistImage={currentPlaylistConfig?.image || 'QueueMusic'}
                isPlaying={isPlaying}
                isPaused={isPaused}
                playlistRuntimeState={playlistRuntimeState}
                runtimeMode={runtimeMode}
                onPlayPause={handlePlayPause}
                onStop={handleStop}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onToggleMode={handleToggleRuntimeMode}
              />

              {playlistRuntimeState && selectedPlaylist && currentPlaylistConfig?.name && (
                <ProgressBar
                  progress={progress}
                  localElapsedMs={localElapsedMs}
                  effectiveDurationMs={playlistRuntimeState.effective_duration_ms}
                  currentSceneIndex={currentSceneIndex}
                  totalScenes={playlistRuntimeState.scenes?.length || 0}
                  isPlaying={isPlaying}
                  isSceneChange={isSceneChange}
                />
              )}
            </Box>

            {selectedPlaylist && currentPlaylistConfig && (
              <PlaylistItemsGrid
                playlistItems={playlistItemsToDisplay}
                currentSceneIndex={currentSceneIndex}
                isPlaying={isPlaying}
                isPaused={isPaused}
                scenes={scenes}
                currentPlaylistConfig={currentPlaylistConfig}
                playlistRuntimeState={playlistRuntimeState}
                onActivateScene={activateScene}
              />
            )}
          </Box>
        </Card>
      </>
    )
  }

  return (
    <>
      {cards ? (
        <Stack direction="row" spacing={1} alignItems="start" sx={{ mb: 2 }}>
          {Object.keys(playlists).length > 0 && renderWidget()}
          <PlaylistCardsView
            playlists={playlists}
            currentPlaylist={currentPlaylist}
            onStartPlaylist={async (playlistId) => {
              await stopPlaylist()
              await startPlaylist(playlistId)
              setCurrentPlaylist(playlistId)
              getPlaylistState()
            }}
            onEditPlaylist={(plId: string) => {
              setEditingPlaylistId(plId)
              setNewPlaylist(playlists[plId])
              setEditDialogOpen(true)
            }}
            onCreatePlaylist={() => {
              setNewPlaylist({})
              setCreateDialogOpen(true)
            }}
          />
        </Stack>
      ) : (
        <Box maxWidth={maxWidth} className="step-scenes-six">
          <ExpanderCard title="Backend Playlists" cardKey="backendPlaylist" expandedHeight={1085}>
            {renderWidget()}
          </ExpanderCard>
        </Box>
      )}

      <PlaylistDialog
        open={createDialogOpen || editDialogOpen}
        isEdit={editDialogOpen}
        playlist={newPlaylist}
        scenes={scenes}
        onClose={() => {
          setCreateDialogOpen(false)
          setEditDialogOpen(false)
        }}
        onSave={createDialogOpen ? handleCreatePlaylist : handleEditPlaylist}
        onChange={setNewPlaylist}
      />
    </>
  )
}
