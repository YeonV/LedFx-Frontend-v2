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
  // Chip,
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
  Paper,
  Grid,
  InputAdornment
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
  KeyboardArrowDown,
  AddCircleOutline
  // DeleteOutline
} from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useStore from '../../store/useStore'
import SceneImage from './ScenesImage'
import ExpanderCard from './ExpanderCard'
import type { PlaylistConfig, PlaylistItem } from '../../api/ledfx.types'
import { useLocation, useNavigate } from 'react-router-dom'
import PlaylistCard from './PlaylistCard'
import TooltipImage from '../../components/Dialogs/SceneDialogs/TooltipImage'
import Popover from '../../components/Popover/Popover'
import { useFireTv } from '../../components/FireTv/useFireTv'

interface BackendPlaylistProps {
  maxWidth?: string | number
  cards?: boolean
}

export default function BackendPlaylist({ maxWidth = 486, cards = false }: BackendPlaylistProps) {
  const theme = useTheme()
  const navigate = useNavigate()
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

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null) // ADD THIS
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

  // Use currentPlaylist directly instead of selectedPlaylist
  const selectedPlaylist = currentPlaylist
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
    if (!editingPlaylistId || !newPlaylist.name) return // USE editingPlaylistId

    const result = await updatePlaylist(editingPlaylistId, newPlaylist.name, newPlaylist) // USE editingPlaylistId
    if (result?.status === 'success') {
      setEditDialogOpen(false)
      setEditingPlaylistId(null) // CLEAR IT
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

  useFireTv({
    enabled: !!selectedPlaylist && isPlaylistPage,
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

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  // Enhanced playlist items logic
  const getPlaylistItemsToDisplay = () => {
    if (!currentPlaylistConfig) return []

    // Always use configured items - no fallback to "all scenes"
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

    // Spread the entire config to preserve all fields
    await updatePlaylist(selectedPlaylist, currentPlaylistConfig.name, {
      ...currentPlaylistConfig,
      items: updatedItems
    })
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
          <Box>
            <SceneImage
              iconName={sceneData?.scene_image || 'Wallpaper'}
              list
              sx={{ height: 50, width: 60 }}
            />
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
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          alignItems="center"
          height={'100%'}
        >
          <Tooltip title="Jump to Scene">
            <IconButton
              size="small"
              onClick={() => activateScene(params.row.scene_id)}
              disabled={isPlaying}
            >
              <PlayArrow fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* {Array.isArray(currentPlaylistConfig?.items) &&
            currentPlaylistConfig.items.length > 0 && (
              <Tooltip title="Remove from Playlist">
                <IconButton
                  size="small"
                  onClick={() => handleRemoveItem(params.row.index)}
                  color="error"
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            )} */}
        </Stack>
      )
    }
  ]

  // Add handler for removing items
  // const handleRemoveItem = async (itemIndex: number) => {
  //   if (!selectedPlaylist || !currentPlaylistConfig?.items) return

  //   const updatedItems: PlaylistItem[] = currentPlaylistConfig.items.filter(
  //     (_: PlaylistItem, index: number) => index !== itemIndex
  //   )

  //   // Spread the entire config here too
  //   await updatePlaylist(selectedPlaylist, currentPlaylistConfig.name, {
  //     ...currentPlaylistConfig,
  //     items: updatedItems
  //   })
  //   getPlaylists()
  // }

  // Track previous progress to detect scene changes
  const [prevProgress, setPrevProgress] = useState(0)
  const isSceneChange = progress < prevProgress - 50 // Detect big jumps backwards

  useEffect(() => {
    setPrevProgress(progress)
  }, [progress])

  const renderWidget = () => {
    return (
      <>
        <Card sx={{ background: 'transparent', borderColor: 'transparent', minWidth: '400px' }}>
          {/* Increase the max width and remove height constraints */}
          <Box sx={{ width: '100%', maxWidth: '800px', m: '0 auto' }}>
            {/* Playlist Selector */}
            {!cards && (
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                    <Select
                      disableUnderline
                      value={currentPlaylist || ''}
                      onChange={(e) => setCurrentPlaylist(e.target.value)}
                    >
                      {Object.entries(playlists).map(([id, playlist]) => (
                        <MenuItem key={id} value={id}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <SceneImage
                              iconName={playlist.image || 'QueueMusic'}
                              list
                              sx={{ height: 30, width: 50 }}
                            />
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
                          setEditingPlaylistId(selectedPlaylist) // SET IT
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
            )}

            {/* Playback Controls */}
            {
              <Box
                sx={{
                  ...(cards
                    ? {
                        border: '1px solid #444',
                        borderRadius: 1,
                        mt: 1,
                        mb: 2,
                        py: 1
                      }
                    : {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        p: 2
                      })
                }}
              >
                <Box
                  sx={{
                    height: 360,
                    width: 360,
                    margin: '16px auto'
                  }}
                >
                  <SceneImage
                    iconName={
                      selectedPlaylist
                        ? playlists[selectedPlaylist].image || 'QueueMusic'
                        : 'yz:logo2'
                    }
                    sx={{
                      height: '100%',
                      color: selectedPlaylist
                        ? theme.palette.text.primary
                        : theme.palette.text.disabled
                    }}
                  />
                </Box>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                  width={'100%'}
                  mt={2}
                >
                  <IconButton
                    onClick={handlePrevious}
                    disabled={!selectedPlaylist || !playlistRuntimeState}
                  >
                    <SkipPrevious />
                  </IconButton>

                  <IconButton
                    onClick={handlePlayPause}
                    disabled={!selectedPlaylist}
                    sx={{
                      bgcolor: theme.palette.primary.main + '20',
                      '&:hover': { bgcolor: theme.palette.primary.main + '40' }
                    }}
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>

                  <IconButton
                    onClick={async () => {
                      const pl = selectedPlaylist
                      await handleStop()
                      setCurrentPlaylist(pl)
                    }}
                    disabled={!selectedPlaylist || !playlistRuntimeState}
                  >
                    <Stop />
                  </IconButton>

                  <IconButton
                    onClick={handleNext}
                    disabled={!selectedPlaylist || !playlistRuntimeState}
                  >
                    <SkipNext />
                  </IconButton>

                  {/* Runtime Mode Toggle (only when playing) */}
                  {playlistRuntimeState && (
                    <Tooltip title={`Toggle Runtime Mode (Current: ${runtimeMode})`}>
                      <IconButton
                        disabled={!selectedPlaylist || !playlistRuntimeState}
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
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{ mt: 1, mb: 0.5, fontWeight: 'bold' }}
                  color={selectedPlaylist ? 'textPrimary' : 'textDisabled'}
                >
                  {selectedPlaylist ? playlists[selectedPlaylist].name : 'No Playlist Selected'}
                </Typography>

                {/* Progress Bar */}
                {playlistRuntimeState && selectedPlaylist && playlists[selectedPlaylist].name && (
                  <Box sx={{ mt: 2, mx: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          // Disable transition on scene change (backward jump)
                          transition: isSceneChange ? 'none' : 'transform 0.9s linear'
                        }
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        {playlistRuntimeState.effective_duration_ms
                          ? formatTime(
                              playlistRuntimeState.effective_duration_ms -
                                playlistRuntimeState.remaining_ms
                            )
                          : ''}
                      </Typography>
                      <Typography variant="caption" color={isPlaying ? 'primary' : 'textDisabled'}>
                        {isPlaying
                          ? `Scene ${currentSceneIndex + 1} of ${playlistRuntimeState.scenes?.length || 0}`
                          : 'not playing'}
                      </Typography>
                      <Typography variant="caption">
                        {playlistRuntimeState.effective_duration_ms
                          ? formatTime(playlistRuntimeState.effective_duration_ms)
                          : ''}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Box>
            }

            {/* Playlist Items */}
            {selectedPlaylist && currentPlaylistConfig && (
              <Box>
                {/* Enhanced DataGrid with larger height */}
                <Box sx={{ height: 400 }}>
                  {/* Increased from 400 to 600 */}
                  <DataGrid
                    rows={playlistItemsToDisplay.map((item) => ({
                      id: item.scene_id,
                      ...item
                    }))}
                    columns={columns}
                    hideFooter
                    disableColumnSorting
                    slots={{
                      columnHeaders: () => null
                    }}
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

                    {playlistRuntimeState && playlistRuntimeState.scene_id && (
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
          maxWidth="sm" // Changed from "md" to "lg" for more space
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
              <Stack direction="row" spacing={0} justifyContent={'space-between'}>
                <Box width="75%">
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
                        variant="outlined"
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

                  <TextField
                    margin="dense"
                    id="scene_image"
                    label="Image (400x400 px recommended)"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <TooltipImage />
                          </InputAdornment>
                        )
                      }
                    }}
                    sx={{ mt: 2 }}
                    type="text"
                    value={newPlaylist.image || ''}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, image: e.target.value })}
                    fullWidth
                  />
                </Box>
                <SceneImage
                  iconName={newPlaylist.image || 'QueueMusic'}
                  sx={{ height: 128, width: 128 }}
                />
              </Stack>
              {/* Scene Selector */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  variant="outlined"
                  sx={{ height: 56 }}
                  value="" // Always empty to allow repeated selections
                  onChange={(e) => {
                    if (e.target.value) {
                      const sceneId = e.target.value as string
                      const newItem: PlaylistItem = {
                        scene_id: sceneId,
                        duration_ms: newPlaylist.default_duration_ms || 5000
                      }
                      const currentItems = Array.isArray(newPlaylist.items) ? newPlaylist.items : []
                      setNewPlaylist({
                        ...newPlaylist,
                        items: [...currentItems, newItem]
                      })
                    }
                  }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <Typography color="text.secondary">Select a scene to add...</Typography>
                  </MenuItem>
                  {Object.entries(scenes).map(([sceneId, scene]) => (
                    <MenuItem key={sceneId} value={sceneId}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SceneImage
                          iconName={scene.scene_image || 'Wallpaper'}
                          list
                          sx={{ height: 50, width: 100 }}
                        />
                        <Typography>{scene.name || sceneId}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
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
                              <SceneImage
                                iconName={sceneData?.scene_image || 'Wallpaper'}
                                list
                                sx={{ height: 50, width: 100 }}
                              />
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
                              <Popover
                                size="small"
                                type="iconbutton"
                                color="error"
                                onConfirm={() => {
                                  const updatedItems = newPlaylist.items!.filter(
                                    (_, i) => i !== index
                                  )
                                  setNewPlaylist({ ...newPlaylist, items: updatedItems })
                                }}
                              />
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
                      No scenes added yet
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Use the dropdown above to get started
                    </Typography>
                  </Box>
                )}

                {/* Quick Actions - removed "Dynamic" button */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    startIcon={<AddCircle />}
                    onClick={() => {
                      // Add all scenes
                      const allSceneItems: PlaylistItem[] = Object.keys(scenes).map((sceneId) => ({
                        scene_id: sceneId,
                        duration_ms: newPlaylist.default_duration_ms || 5000
                      }))
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
      </>
    )
  }
  return cards ? (
    <Stack direction="row" spacing={1} alignItems="start" sx={{ mb: 2 }}>
      {renderWidget()}
      <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
        {Object.keys(playlists).length === 0 && (
          <Typography variant="body1" color="text.secondary">
            No playlists available. Please create a playlist to get started.
          </Typography>
        )}
        <Grid container justifyContent="start" spacing={1}>
          {Object.values(playlists).map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlistId={playlist.id}
              playlist={playlist}
              order={0} // You might want to set the order dynamically
              handleStartPlaylist={async (playlistId) => {
                await stopPlaylist()
                await startPlaylist(playlistId)
                setCurrentPlaylist(playlistId)
                getPlaylistState()
              }}
              handleEditPlaylist={(plId: string) => {
                setEditingPlaylistId(plId) // SET IT HERE TOO
                setNewPlaylist(playlists[plId])
                setEditDialogOpen(true)
              }}
              isActive={currentPlaylist === playlist.id}
              classes={{ root: '' }} // You can pass your custom classes here
            />
          ))}
          <Grid
            key={'add-playlist'}
            mt={['0.5rem', '0.5rem', 0, 0, 0]}
            p="8px !important"
            order={99}
            width={400}
          >
            <Card
              sx={{
                border: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor: 'transparent',
                position: 'relative',
                width: 384,
                height: 190,
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.palette.background.paper }
              }}
              onClick={() => {
                setNewPlaylist({})
                setCreateDialogOpen(true)
              }}
            >
              <Box
                sx={{
                  height: 140,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.background.default
                }}
              >
                <AddCircleOutline color="disabled" sx={{ fontSize: 64, opacity: 0.5 }} />
              </Box>
              <Box
                sx={{
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  bgcolor: '#282829',
                  p: 1
                }}
              >
                <Typography variant="h5">Add Playlist</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  ) : (
    <Box maxWidth={maxWidth}>
      <ExpanderCard title="Backend Playlists" cardKey="backendPlaylist" expandedHeight={1135}>
        {renderWidget()}
        <Button
          variant="outlined"
          sx={{
            height: 55,
            bgcolor: 'black',
            width: '100%',
            textTransform: 'none',
            borderColor: '#666'
          }}
          onClick={() => {
            navigate('/playlist')
          }}
        >
          POC: Playlist Page
        </Button>
      </ExpanderCard>
    </Box>
  )
}
