import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Paper
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  Add,
  Edit,
  Delete,
  Shuffle,
  Repeat,
  Save,
  Close,
  PlaylistPlay,
  QueueMusic,
  RemoveCircle,
  AddCircle,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useStore from '../../store/useStore'
import SceneImage from './ScenesImage'
import ExpanderCard from './ExpanderCard'
import type { PlaylistConfig, PlaylistItem } from '../../api/ledfx.types'

interface BackendPlaylistProps {
  scenes: Record<string, any>
  maxWidth?: string | number
  // eslint-disable-next-line no-unused-vars
  activateScene: (sceneId: string) => void
}

export default function BackendPlaylist({
  scenes,
  activateScene,
  maxWidth = 486
}: BackendPlaylistProps) {
  const theme = useTheme()

  // Store hooks
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

  // Local state
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
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

  // Sync selectedPlaylist with currentPlaylist from store
  useEffect(() => {
    if (currentPlaylist && playlists[currentPlaylist]) {
      setSelectedPlaylist(currentPlaylist)
    } else if (!selectedPlaylist && Object.keys(playlists).length > 0) {
      const firstPlaylistId = Object.keys(playlists)[0]
      setSelectedPlaylist(firstPlaylistId)
      setCurrentPlaylist(firstPlaylistId)
    }
  }, [playlists, currentPlaylist, selectedPlaylist, setCurrentPlaylist])

  // Update store when selectedPlaylist changes
  useEffect(() => {
    if (selectedPlaylist !== currentPlaylist) {
      setCurrentPlaylist(selectedPlaylist)
    }
  }, [selectedPlaylist, currentPlaylist, setCurrentPlaylist])

  const currentPlaylistConfig = selectedPlaylist ? playlists[selectedPlaylist] : null
  const isPlaying =
    playlistRuntimeState?.active_playlist === selectedPlaylist && !playlistRuntimeState?.paused
  const isPaused =
    playlistRuntimeState?.active_playlist === selectedPlaylist && playlistRuntimeState?.paused

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name) return

    const result = await createPlaylist(newPlaylist as PlaylistConfig)
    if (result?.status === 'success') {
      setCreateDialogOpen(false)
      setNewPlaylist({
        name: '',
        items: [],
        default_duration_ms: 5000,
        mode: 'sequence',
        timing: { jitter: { enabled: false, factor_min: 0.8, factor_max: 1.2 } },
        tags: [],
        image: 'QueueMusic'
      })
      getPlaylists()
    }
  }

  const handleEditPlaylist = async () => {
    if (!selectedPlaylist || !newPlaylist.name) return

    const result = await updatePlaylist(selectedPlaylist, newPlaylist)
    if (result?.status === 'success') {
      setEditDialogOpen(false)
      getPlaylists()
    }
  }

  const handleToggleRuntimeMode = async () => {
    if (!selectedPlaylist || !playlistRuntimeState) return

    // This toggles the runtime mode (temporary override)
    const currentRuntimeMode = playlistRuntimeState.mode
    const newRuntimeMode = currentRuntimeMode === 'sequence' ? 'shuffle' : 'sequence'

    // Restart playlist with new runtime mode
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
      // Start with stored config mode (no runtime override)
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

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  // Enhanced playlist items logic
  const getPlaylistItemsToDisplay = () => {
    if (!currentPlaylistConfig) return []

    let items: any[] = []

    // If items array is empty, use dynamic "all scenes" from runtime state
    if (!currentPlaylistConfig.items || currentPlaylistConfig.items.length === 0) {
      if (playlistRuntimeState?.scenes) {
        items = playlistRuntimeState.scenes.map((sceneId: string, index: number) => ({
          scene_id: sceneId,
          duration_ms: currentPlaylistConfig.default_duration_ms,
          index // This is the key - proper index mapping
        }))
      } else {
        // Fallback to all available scenes if no runtime state
        items = Object.keys(scenes).map((sceneId: string, index: number) => ({
          scene_id: sceneId,
          duration_ms: currentPlaylistConfig.default_duration_ms,
          index
        }))
      }
    } else {
      // Use configured items
      items = currentPlaylistConfig.items.map((item: PlaylistItem, index: number) => ({
        ...item,
        index
      }))
    }

    return items
  }

  const playlistItemsToDisplay = getPlaylistItemsToDisplay()
  const currentSceneIndex = playlistRuntimeState?.index || 0

  // Enhanced progress calculation with null checks
  const progress =
    playlistRuntimeState?.effective_duration_ms && playlistRuntimeState?.remaining_ms
      ? Math.max(
          0,
          Math.min(
            100,
            ((playlistRuntimeState.effective_duration_ms - playlistRuntimeState.remaining_ms) /
              playlistRuntimeState.effective_duration_ms) *
              100
          )
        )
      : 0

  const runtimeMode = playlistRuntimeState?.mode || currentPlaylistConfig?.mode

  // Add a polling effect to update state regularly when playing
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      // Poll every second to update progress
      interval = setInterval(() => {
        getPlaylistState()
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, getPlaylistState])

  // Add handler for updating individual item duration
  const handleUpdateItemDuration = async (itemIndex: number, newDuration: number) => {
    if (!selectedPlaylist || !currentPlaylistConfig?.items) return

    const updatedItems = [...currentPlaylistConfig.items]
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      duration_ms: Math.max(500, newDuration) // Ensure minimum 500ms
    }

    await updatePlaylist(selectedPlaylist, { items: updatedItems })
    getPlaylists()
  }

  const columns: GridColDef[] = [
    {
      field: 'scene_image',
      headerName: '',
      width: 60,
      renderCell: (params: GridRenderCellParams) => {
        const sceneData = scenes[params.row.scene_id]
        return (
          <Box width={24}>
            <SceneImage iconName={sceneData?.scene_image || 'Wallpaper'} list />
          </Box>
        )
      }
    },
    {
      field: 'scene_name',
      headerName: 'Scene',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const sceneData = scenes[params.row.scene_id]
        const isActive = currentSceneIndex === params.row.index && (isPlaying || isPaused)

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            {isActive && (
              <PlaylistPlay
                sx={{
                  mr: 1,
                  fontSize: 16,
                  color: 'primary.main',
                  animation: isPlaying ? 'pulse 2s infinite' : 'none'
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: isActive ? 'primary.main' : 'inherit',
                fontWeight: isActive ? 'bold' : 'normal'
              }}
            >
              {sceneData?.name || params.row.scene_id}
            </Typography>
            {/* {isCurrentScene && !isActive && (
              <Chip label="Current" size="small" variant="outlined" sx={{ ml: 1, height: 20 }} />
            )} */}
          </Box>
        )
      }
    },
    {
      field: 'duration_ms',
      headerName: 'Duration',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const duration = params.value || currentPlaylistConfig?.default_duration_ms || 5000
        const isActive = currentSceneIndex === params.row.index && (isPlaying || isPaused)
        const isConfiguredItem =
          Array.isArray(currentPlaylistConfig?.items) && currentPlaylistConfig.items.length > 0

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            {isConfiguredItem ? (
              <TextField
                size="small"
                type="number"
                value={duration / 1000} // Show in seconds
                onChange={(e) => {
                  const newDurationMs = Math.max(0.5, parseFloat(e.target.value)) * 1000
                  handleUpdateItemDuration(params.row.index, newDurationMs)
                }}
                onBlur={(e) => {
                  // Ensure minimum on blur
                  const newDurationMs = Math.max(500, parseFloat(e.target.value) * 1000)
                  if (newDurationMs !== duration) {
                    handleUpdateItemDuration(params.row.index, newDurationMs)
                  }
                }}
                inputProps={{
                  min: 0.5,
                  step: 0.5,
                  style: {
                    textAlign: 'center',
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  }
                }}
                sx={{
                  width: 70,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isActive ? 'primary.main' : 'divider'
                    }
                  }
                }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontStyle: 'italic'
                }}
              >
                {formatTime(duration)}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {isConfiguredItem ? 's' : '(default)'}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Jump to Scene">
            <IconButton
              size="small"
              onClick={() => activateScene(params.row.scene_id)}
              disabled={isPlaying}
            >
              <PlayArrow fontSize="small" />
            </IconButton>
          </Tooltip>
          {Array.isArray(currentPlaylistConfig?.items) &&
            currentPlaylistConfig.items.length > 0 && (
              <Tooltip title="Remove from Playlist">
                <IconButton
                  size="small"
                  onClick={() => handleRemoveItem(params.row.index)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
        </Stack>
      )
    }
  ]

  // Add handler for removing items
  const handleRemoveItem = async (itemIndex: number) => {
    if (!selectedPlaylist || !currentPlaylistConfig?.items) return

    const updatedItems: PlaylistItem[] = currentPlaylistConfig.items.filter(
      (_: PlaylistItem, index: number) => index !== itemIndex
    )
    await updatePlaylist(selectedPlaylist, { items: updatedItems })
    getPlaylists()
  }

  // Add handler for adding scenes
  const handleAddScene = async (sceneId: string) => {
    if (!selectedPlaylist || !currentPlaylistConfig) return

    const newItem: PlaylistItem = {
      scene_id: sceneId,
      duration_ms: currentPlaylistConfig.default_duration_ms
    }

    const updatedItems = Array.isArray(currentPlaylistConfig.items)
      ? [...currentPlaylistConfig.items, newItem]
      : [newItem]

    await updatePlaylist(selectedPlaylist, { items: updatedItems })
    getPlaylists()
  }

  return (
    <Box maxWidth={maxWidth}>
      <ExpanderCard title="Backend Playlists" cardKey="backendPlaylist" expandedHeight={950}>
        <Card sx={{ background: 'transparent', borderColor: 'transparent' }}>
          {/* Increase the max width and remove height constraints */}
          <Box sx={{ width: '100%', maxWidth: '800px', m: '0 auto' }}>
            {/* Playlist Selector */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                  <InputLabel>Select Playlist</InputLabel>
                  <Select
                    disableUnderline
                    value={selectedPlaylist || ''}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                    label="Select Playlist"
                  >
                    {Object.entries(playlists).map(([id, playlist]) => (
                      <MenuItem key={id} value={id}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <SceneImage iconName={playlist.image || 'QueueMusic'} list />
                          <Typography>{playlist.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="Create New Playlist">
                  <IconButton onClick={() => setCreateDialogOpen(true)} color="primary">
                    <Add />
                  </IconButton>
                </Tooltip>

                {selectedPlaylist && (
                  <Tooltip title="Edit Playlist">
                    <IconButton
                      onClick={() => {
                        setNewPlaylist(currentPlaylistConfig!)
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                )}

                {selectedPlaylist && (
                  <Tooltip title="Delete Playlist">
                    <IconButton onClick={() => deletePlaylist(selectedPlaylist)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>

            {/* Playback Controls */}
            {selectedPlaylist && (
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <IconButton onClick={handlePrevious} disabled={!playlistRuntimeState}>
                    <SkipPrevious />
                  </IconButton>

                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      bgcolor: theme.palette.primary.main + '20',
                      '&:hover': { bgcolor: theme.palette.primary.main + '40' }
                    }}
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>

                  <IconButton onClick={handleStop} disabled={!playlistRuntimeState}>
                    <Stop />
                  </IconButton>

                  <IconButton onClick={handleNext} disabled={!playlistRuntimeState}>
                    <SkipNext />
                  </IconButton>

                  {/* Runtime Mode Toggle (only when playing) */}
                  {playlistRuntimeState && (
                    <Tooltip title={`Toggle Runtime Mode (Current: ${runtimeMode})`}>
                      <IconButton
                        onClick={handleToggleRuntimeMode}
                        sx={{
                          bgcolor:
                            runtimeMode === 'shuffle'
                              ? theme.palette.warning.main + '20'
                              : theme.palette.info.main + '20',
                          '&:hover': {
                            bgcolor:
                              runtimeMode === 'shuffle'
                                ? theme.palette.warning.main + '40'
                                : theme.palette.info.main + '40'
                          }
                        }}
                      >
                        {runtimeMode === 'shuffle' ? <Shuffle /> : <Repeat />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                {/* Show both stored and runtime mode if different */}
                {/* {playlistRuntimeState &&
                currentPlaylistConfig &&
                playlistRuntimeState.mode !== currentPlaylistConfig.mode && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Stored: {currentPlaylistConfig.mode} → Runtime: {playlistRuntimeState.mode}
                    </Typography>
                  </Box>
                )} */}

                {/* Progress Bar */}
                {playlistRuntimeState && isPlaying && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        {formatTime(
                          playlistRuntimeState.effective_duration_ms -
                            playlistRuntimeState.remaining_ms
                        )}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        Scene {currentSceneIndex + 1} of {playlistRuntimeState.scenes?.length || 0}
                      </Typography>
                      <Typography variant="caption">
                        {formatTime(playlistRuntimeState.effective_duration_ms)}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            {/* Playlist Items */}
            {selectedPlaylist && currentPlaylistConfig && (
              <Box>
                {/* Header with info */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Playlist Items</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {!currentPlaylistConfig.items || currentPlaylistConfig.items.length === 0 ? (
                        <Chip
                          label="Dynamic (All Scenes)"
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label={`${currentPlaylistConfig.items.length} scenes`}
                          size="small"
                          variant="outlined"
                        />
                      )}

                      {/* Add Scene Button */}
                      {/* <Tooltip title="Add Scene to Playlist">
                        <IconButton
                          size="small"
                          onClick={() => {
                            const sceneIds = Object.keys(scenes)
                            if (sceneIds.length > 0) {
                              const randomSceneId = sceneIds[0]
                              handleAddScene(randomSceneId)
                            }
                          }}
                          color="primary"
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                    </Stack>
                  </Stack>
                </Box>

                {/* Enhanced DataGrid with larger height */}
                <Box sx={{ height: 600 }}>
                  {' '}
                  {/* Increased from 400 to 600 */}
                  <DataGrid
                    rows={playlistItemsToDisplay.map((item, index) => ({
                      id: index,
                      index,
                      ...item
                    }))}
                    columns={columns}
                    hideFooter
                    disableColumnSorting
                    disableColumnMenu
                    disableRowSelectionOnClick
                    getRowClassName={(params) =>
                      currentSceneIndex === params.row.index && (isPlaying || isPaused)
                        ? 'row--active'
                        : ''
                    }
                    sx={(theme) => ({
                      // Enhanced row styling with animation
                      '& .row--active': {
                        background: `${theme.palette.primary.main}15`,
                        '& .MuiDataGrid-cell': {
                          borderColor: `${theme.palette.primary.main}40`,
                          animation: isPlaying ? 'glow 2s ease-in-out infinite alternate' : 'none'
                        }
                      },
                      '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none !important'
                      },
                      '& .MuiDataGrid-row:hover': {
                        background: `${theme.palette.action.hover}`
                      },
                      // Add keyframe animations
                      '@keyframes glow': {
                        from: { borderColor: `${theme.palette.primary.main}40` },
                        to: { borderColor: `${theme.palette.primary.main}80` }
                      },
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    })}
                  />
                </Box>

                {/* Enhanced Playlist Info with more details */}
                <Box sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Total Duration:{' '}
                      {formatTime(
                        playlistItemsToDisplay.reduce(
                          (total, item) =>
                            total +
                            (item.duration_ms || currentPlaylistConfig.default_duration_ms || 5000),
                          0
                        )
                      )}
                    </Typography>

                    {playlistRuntimeState && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" color="primary">
                          Playing: {playlistRuntimeState.scene_id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Progress: {Math.round(progress)}%
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        </Card>

        {/* Enhanced Create/Edit Dialog */}
        <Dialog
          open={createDialogOpen || editDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false)
            setEditDialogOpen(false)
          }}
          maxWidth="lg" // Changed from "md" to "lg" for more space
          fullWidth
        >
          <DialogTitle>{createDialogOpen ? 'Create New Playlist' : 'Edit Playlist'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Basic Settings */}
              <TextField
                label="Playlist Name"
                value={newPlaylist.name || ''}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Default Duration (seconds)"
                  type="number"
                  value={(newPlaylist.default_duration_ms || 5000) / 1000}
                  onChange={(e) =>
                    setNewPlaylist({
                      ...newPlaylist,
                      default_duration_ms: Math.max(0.5, parseFloat(e.target.value)) * 1000
                    })
                  }
                  InputProps={{
                    inputProps: { min: 0.5, step: 0.5 }
                  }}
                  sx={{ flex: 1 }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Default Mode</InputLabel>
                  <Select
                    value={newPlaylist.mode || 'sequence'}
                    onChange={(e) =>
                      setNewPlaylist({
                        ...newPlaylist,
                        mode: e.target.value as 'sequence' | 'shuffle'
                      })
                    }
                    label="Default Mode"
                  >
                    <MenuItem value="sequence">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Repeat fontSize="small" />
                        <Typography>Sequence</Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="shuffle">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Shuffle fontSize="small" />
                        <Typography>Shuffle</Typography>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Divider />

              {/* Playlist Items Management */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">Playlist Items</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={
                        Array.isArray(newPlaylist.items)
                          ? `${newPlaylist.items.length} items`
                          : 'Dynamic (All Scenes)'
                      }
                      size="small"
                      variant="outlined"
                    />
                    <Button
                      size="small"
                      onClick={() => setNewPlaylist({ ...newPlaylist, items: [] })}
                      variant={
                        !newPlaylist.items || newPlaylist.items.length === 0
                          ? 'contained'
                          : 'outlined'
                      }
                    >
                      Dynamic
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        if (!newPlaylist.items || newPlaylist.items.length === 0) {
                          setNewPlaylist({ ...newPlaylist, items: [] })
                        }
                      }}
                      variant={
                        newPlaylist.items && newPlaylist.items.length > 0 ? 'contained' : 'outlined'
                      }
                    >
                      Custom
                    </Button>
                  </Stack>
                </Stack>

                {/* Scene Selector */}

                {/* Scene Selector - Changed from Autocomplete to Select */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  {/* <InputLabel>Add Scene to Playlist</InputLabel> */}
                  <Select
                    variant="outlined"
                    value="" // Always empty to allow repeated selections
                    onChange={(e) => {
                      if (e.target.value) {
                        const sceneId = e.target.value as string
                        const newItem: PlaylistItem = {
                          scene_id: sceneId,
                          duration_ms: newPlaylist.default_duration_ms || 5000
                        }
                        const currentItems = Array.isArray(newPlaylist.items)
                          ? newPlaylist.items
                          : []
                        setNewPlaylist({
                          ...newPlaylist,
                          items: [...currentItems, newItem]
                        })
                      }
                    }}
                    //   label="Add Scene to Playlist"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      <Typography color="text.secondary">Select a scene to add...</Typography>
                    </MenuItem>
                    {Object.entries(scenes).map(([sceneId, scene]) => (
                      <MenuItem key={sceneId} value={sceneId}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <SceneImage iconName={scene.scene_image || 'Wallpaper'} list />
                          <Typography>{scene.name || sceneId}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Playlist Items List */}
                {Array.isArray(newPlaylist.items) && newPlaylist.items.length > 0 ? (
                  <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {newPlaylist.items.map((item, index) => {
                        const sceneData = scenes[item.scene_id]
                        return (
                          <ListItem key={`${item.scene_id}-${index}`} divider>
                            {/* Move ordering buttons to the front */}
                            <ListItemIcon>
                              <Stack direction="column" spacing={0}>
                                {/* Move Up */}
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    if (index > 0) {
                                      const updatedItems = [...newPlaylist.items!]
                                      const temp = updatedItems[index]
                                      updatedItems[index] = updatedItems[index - 1]
                                      updatedItems[index - 1] = temp
                                      setNewPlaylist({ ...newPlaylist, items: updatedItems })
                                    }
                                  }}
                                  disabled={index === 0}
                                  sx={{
                                    height: 20,
                                    width: 20,
                                    p: 0,
                                    '&.Mui-disabled': {
                                      opacity: 0.3
                                    }
                                  }}
                                >
                                  <KeyboardArrowUp fontSize="small" />
                                </IconButton>

                                {/* Move Down */}
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    if (index < newPlaylist.items!.length - 1) {
                                      const updatedItems = [...newPlaylist.items!]
                                      const temp = updatedItems[index]
                                      updatedItems[index] = updatedItems[index + 1]
                                      updatedItems[index + 1] = temp
                                      setNewPlaylist({ ...newPlaylist, items: updatedItems })
                                    }
                                  }}
                                  disabled={index === newPlaylist.items!.length - 1}
                                  sx={{
                                    height: 20,
                                    width: 20,
                                    p: 0,
                                    '&.Mui-disabled': {
                                      opacity: 0.3
                                    }
                                  }}
                                >
                                  <KeyboardArrowDown fontSize="small" />
                                </IconButton>
                              </Stack>
                            </ListItemIcon>

                            {/* Scene Icon */}
                            <ListItemIcon sx={{ mr: 2 }}>
                              <SceneImage iconName={sceneData?.scene_image || 'Wallpaper'} list />
                            </ListItemIcon>

                            {/* Scene Name and ID */}
                            <ListItemText
                              primary={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    #{index + 1}
                                  </Typography>
                                  <Typography variant="body2">
                                    {sceneData?.name || item.scene_id}
                                  </Typography>
                                </Stack>
                              }
                              // secondary={item.scene_id}
                            />

                            {/* Duration Input */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                              <TextField
                                size="small"
                                type="number"
                                value={
                                  (item.duration_ms || newPlaylist.default_duration_ms || 5000) /
                                  1000
                                }
                                onChange={(e) => {
                                  const newDuration =
                                    Math.max(0.5, parseFloat(e.target.value)) * 1000
                                  const updatedItems = [...newPlaylist.items!]
                                  updatedItems[index] = { ...item, duration_ms: newDuration }
                                  setNewPlaylist({ ...newPlaylist, items: updatedItems })
                                }}
                                InputProps={{
                                  inputProps: { min: 0.5, step: 0.5 },
                                  endAdornment: <Typography variant="caption">s</Typography>
                                }}
                                sx={{ width: 80 }}
                              />
                            </Box>

                            {/* Remove Button */}
                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const updatedItems = newPlaylist.items!.filter(
                                    (_, i) => i !== index
                                  )
                                  setNewPlaylist({ ...newPlaylist, items: updatedItems })
                                }}
                                color="error"
                                sx={{
                                  '&:hover': {
                                    bgcolor: 'error.main',
                                    color: 'error.contrastText'
                                  }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      border: `1px dashed ${theme.palette.divider}`
                    }}
                  >
                    <QueueMusic sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {!newPlaylist.items || newPlaylist.items.length === 0
                        ? 'Dynamic playlist - will include all available scenes'
                        : 'No items added yet'}
                    </Typography>
                    {(!newPlaylist.items || newPlaylist.items.length === 0) && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Scenes will be resolved when the playlist starts
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Quick Actions */}
                {Array.isArray(newPlaylist.items) && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<AddCircle />}
                      onClick={() => {
                        // Add all scenes
                        const allSceneItems: PlaylistItem[] = Object.keys(scenes).map(
                          (sceneId) => ({
                            scene_id: sceneId,
                            duration_ms: newPlaylist.default_duration_ms || 5000
                          })
                        )
                        setNewPlaylist({ ...newPlaylist, items: allSceneItems })
                      }}
                      variant="outlined"
                    >
                      Add All Scenes
                    </Button>

                    <Button
                      size="small"
                      startIcon={<Shuffle />}
                      onClick={() => {
                        if (newPlaylist.items && newPlaylist.items.length > 0) {
                          const shuffled = [...newPlaylist.items].sort(() => Math.random() - 0.5)
                          setNewPlaylist({ ...newPlaylist, items: shuffled })
                        }
                      }}
                      variant="outlined"
                      disabled={!newPlaylist.items || newPlaylist.items.length === 0}
                    >
                      Shuffle Order
                    </Button>

                    <Button
                      size="small"
                      startIcon={<RemoveCircle />}
                      onClick={() => setNewPlaylist({ ...newPlaylist, items: [] })}
                      variant="outlined"
                      color="error"
                      disabled={!newPlaylist.items || newPlaylist.items.length === 0}
                    >
                      Clear All
                    </Button>
                  </Stack>
                )}
              </Box>

              <Divider />

              {/* Jitter Settings */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newPlaylist.timing?.jitter?.enabled || false}
                      onChange={(e) =>
                        setNewPlaylist({
                          ...newPlaylist,
                          timing: {
                            ...newPlaylist.timing,
                            jitter: {
                              ...newPlaylist.timing?.jitter,
                              enabled: e.target.checked
                            }
                          }
                        })
                      }
                    />
                  }
                  label="Enable Timing Jitter"
                />

                {newPlaylist.timing?.jitter?.enabled && (
                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom>Jitter Range</Typography>
                    <Slider
                      value={[
                        newPlaylist.timing?.jitter?.factor_min || 0.8,
                        newPlaylist.timing?.jitter?.factor_max || 1.2
                      ]}
                      onChange={(_, value) => {
                        const [min, max] = value as number[]
                        setNewPlaylist({
                          ...newPlaylist,
                          timing: {
                            ...newPlaylist.timing,
                            jitter: {
                              ...newPlaylist.timing?.jitter,
                              factor_min: min,
                              factor_max: max
                            }
                          }
                        })
                      }}
                      valueLabelDisplay="auto"
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      marks={[
                        { value: 0.5, label: '0.5x' },
                        { value: 1.0, label: '1.0x' },
                        { value: 1.5, label: '1.5x' }
                      ]}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setCreateDialogOpen(false)
                setEditDialogOpen(false)
              }}
            >
              <Close sx={{ mr: 1 }} />
              Cancel
            </Button>
            <Button
              onClick={createDialogOpen ? handleCreatePlaylist : handleEditPlaylist}
              variant="contained"
              disabled={!newPlaylist.name}
            >
              <Save sx={{ mr: 1 }} />
              {createDialogOpen ? 'Create' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </ExpanderCard>
    </Box>
  )
}
