import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { PlayArrow, PlaylistPlay } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import SceneImage from '../ScenesImage'
import { PlaylistItemsGridProps } from './types'

export default function PlaylistItemsGrid({
  playlistItems,
  currentSceneIndex,
  isPlaying,
  isPaused,
  scenes,
  currentPlaylistConfig,
  playlistRuntimeState,
  onActivateScene
}: PlaylistItemsGridProps) {
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (playlistRuntimeState?.effective_duration_ms && playlistRuntimeState?.started_at) {
      const updateProgress = () => {
        const progress = Math.round(
          ((Date.now() - playlistRuntimeState.started_at) /
            playlistRuntimeState.effective_duration_ms) *
            100
        )
        setCurrentProgress(progress)
      }

      updateProgress()
      const interval = setInterval(updateProgress, 100)
      return () => clearInterval(interval)
    } else {
      setCurrentProgress(0)
    }
  }, [playlistRuntimeState?.effective_duration_ms, playlistRuntimeState?.started_at])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
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

        const jitterEnabled =
          playlistRuntimeState?.timing?.jitter?.enabled ||
          currentPlaylistConfig?.timing?.jitter?.enabled ||
          false

        const displayDuration =
          isActive && playlistRuntimeState?.effective_duration_ms
            ? playlistRuntimeState.effective_duration_ms
            : duration

        const durationInSeconds = Math.floor(displayDuration / 1000)

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              justifyContent: 'flex-end',
              width: '100%',
              height: '100%'
            }}
          >
            {jitterEnabled && !isActive && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}
              >
                ~
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                fontWeight: isActive ? 'bold' : 'normal',
                fontStyle: isActive ? 'normal' : 'italic',
                minWidth: '3ch',
                textAlign: 'right'
              }}
            >
              {durationInSeconds}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: isActive ? 'bold' : 'normal'
              }}
            >
              s
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
            <span>
              <IconButton
                size="small"
                onClick={() => onActivateScene(params.row.scene_id)}
                disabled={isPlaying}
              >
                <PlayArrow fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      )
    }
  ]

  return (
    <Box>
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={playlistItems.map((item) => ({
            id: item.scene_id + '_' + item.index,
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
            currentSceneIndex === params.row.index && (isPlaying || isPaused) ? 'row--active' : ''
          }
          sx={(theme) => ({
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

      <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.background.default }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Total Duration:{' '}
            {formatTime(
              playlistItems.reduce(
                (total, item) =>
                  total + (item.duration_ms || currentPlaylistConfig.default_duration_ms || 5000),
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
                Progress: {currentProgress}%
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
