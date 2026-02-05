import { useEffect, useState, useRef } from 'react'
import {
  Box,
  Card,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { DeleteForever, Add, PlayArrow, Pause, FileDownload, UploadFile } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import useStore from '../../../../../store/useStore'
import Popover from '../../../../Popover/Popover'
import { generateSongHash } from '../../../../../store/ui/storeSongDectector'

const PREFIX = 'SongDetectorSceneTriggerTable'

const classes = {
  root: `${PREFIX}-root`
}

const Root = styled('div')(({ theme }: any) => ({
  [`& .${classes.root}`]: {
    '&.MuiDataGrid-root .MuiDataGrid-footerContainer .MuiTablePagination-root': {
      color: theme.palette.text.secondary
    },
    '&.MuiDataGrid-root .MuiButtonBase-root.MuiIconButton-root': {
      color: theme.palette.text.secondary
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell': {
      borderColor: '#333'
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
      {
        outline: 'none'
      },
    '& .currently_playing, .currently_playing.MuiDataGrid-row, .currently_playing.MuiDataGrid-row:hover':
      {
        backgroundColor: `${theme.palette.success.main}30`,
        color: theme.palette.text.primary
      },
    '& .trigger_fired, .trigger_fired.MuiDataGrid-row, .trigger_fired.MuiDataGrid-row:hover': {
      backgroundColor: `${theme.palette.primary.main}15`,
      color: theme.palette.text.secondary,
      opacity: 0.7
    }
  }
}))

export default function SongDetectorSceneTriggerTable() {
  const scenes = useStore((state) => state.scenes)
  const getScenes = useStore((state) => state.getScenes)
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const duration = useStore((state) => state.duration)
  const position = useStore((state) => state.position)
  const playing = useStore((state) => state.playing)
  const timestamp = useStore((state) => state.timestamp)
  const triggers = useStore((state) => state.triggers)
  const addTrigger = useStore((state) => state.addTrigger)
  const updateTrigger = useStore((state) => state.updateTrigger)
  const deleteTrigger = useStore((state) => state.deleteTrigger)
  const sceneTriggerActive = useStore((state) => state.sceneTriggerActive)
  const setSceneTriggerActive = useStore((state) => state.setSceneTriggerActive)
  const triggerLatencyMs = useStore((state) => state.triggerLatencyMs)
  const setTriggerLatencyMs = useStore((state) => state.setTriggerLatencyMs)
  const activateScene = useStore((state) => state.activateScene)

  // Interpolate position for smooth updates (same logic as SongDetectorPlayer)
  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const currentPositionRef = useRef<number | null>(null)
  const previousPositionRef = useRef<number | null>(null)
  // Track which triggers have fired in current song to prevent re-firing
  const [firedTriggers, setFiredTriggers] = useState<Set<string>>(new Set())

  // Generate current song hash for highlighting
  const currentSongHash = currentTrack && duration ? generateSongHash(currentTrack, duration) : null

  // Fetch scenes on mount
  useEffect(() => {
    getScenes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Interpolate position for smooth updates
  useEffect(() => {
    if (!position || !timestamp || !playing) {
      const newPos = position
      previousPositionRef.current = currentPositionRef.current
      currentPositionRef.current = newPos
      setCurrentPosition(newPos)
      return
    }

    const updatePosition = () => {
      const elapsed = Date.now() / 1000 - timestamp!
      const interpolated = Math.min(position! + elapsed, duration || Infinity)
      previousPositionRef.current = currentPositionRef.current
      currentPositionRef.current = interpolated
      setCurrentPosition(interpolated)
    }

    updatePosition()
    const interval = setInterval(updatePosition, 100)

    return () => clearInterval(interval)
  }, [position, timestamp, playing, duration])

  // Reset fired triggers when song changes
  useEffect(() => {
    console.log('🎵 Song changed, resetting fired triggers:', {
      currentTrack,
      duration,
      hash: currentSongHash
    })
    setFiredTriggers(new Set())
  }, [currentSongHash, currentTrack, duration])

  // 🔥 FML MODE: Scene trigger activation logic - fires scenes at specific positions
  useEffect(() => {
    const previousPosition = previousPositionRef.current

    if (
      !sceneTriggerActive ||
      !currentSongHash ||
      currentPosition === null ||
      previousPosition === null
    ) {
      return
    }

    // Find triggers for current song that have scenes assigned
    const matchingTriggers = triggers.filter((t) => t.songHash === currentSongHash && t.sceneId)

    if (matchingTriggers.length === 0) return

    // Calculate latency-compensated trigger positions (fire earlier)
    const latencySeconds = triggerLatencyMs / 1000

    // CRITICAL: Check for triggers we CROSSED in this interpolation tick (every 100ms)
    // We fire any trigger where: previousPosition < (trigger.position - latency) <= currentPosition
    const crossedTriggers = matchingTriggers.filter((t) => {
      const compensatedPosition = t.position - latencySeconds
      return (
        previousPosition < compensatedPosition &&
        compensatedPosition <= currentPosition &&
        !firedTriggers.has(t.id)
      )
    })

    // Fire all crossed triggers in chronological order
    if (crossedTriggers.length > 0) {
      // Sort by position to fire in correct order
      crossedTriggers.sort((a, b) => a.position - b.position)

      console.log('🚀 FIRING TRIGGERS:', {
        current: currentPosition.toFixed(2),
        previous: previousPosition.toFixed(2),
        latencyMs: triggerLatencyMs,
        triggers: crossedTriggers.map((t) => ({
          pos: t.position.toFixed(2),
          compensated: (t.position - latencySeconds).toFixed(2),
          scene: t.sceneId,
          id: t.id
        }))
      })

      crossedTriggers.forEach((trigger) => {
        // FIRE THE SCENE! 🚀
        const compensated = (trigger.position - latencySeconds).toFixed(2)
        console.log(
          `🔥 Activating scene: ${trigger.sceneId} at ${trigger.position.toFixed(2)} (comp: ${compensated})`
        )
        activateScene(trigger.sceneId)
        // Mark as fired
        setFiredTriggers((prev) => new Set(prev).add(trigger.id))
      })
    }
  }, [
    currentPosition,
    currentSongHash,
    sceneTriggerActive,
    triggers,
    firedTriggers,
    activateScene,
    triggerLatencyMs
  ])

  const handleAddTrigger = () => {
    if (!currentTrack || !duration || currentPosition === null) {
      return
    }

    const songHash = generateSongHash(currentTrack, duration)
    const newTriggerId = `${songHash}_${Math.round(currentPosition * 1000)}`
    console.log('➕ Adding trigger:', {
      id: newTriggerId,
      song: currentTrack,
      position: currentPosition.toFixed(2),
      hash: songHash
    })
    addTrigger({
      songName: currentTrack,
      songHash,
      duration,
      position: currentPosition,
      sceneId: ''
    })
  }

  const handleUpdateTrigger = (id: string, sceneId: string) => {
    updateTrigger(id, { sceneId })
  }

  const handleDeleteTrigger = (id: string) => {
    deleteTrigger(id)
  }

  // Export triggers to JSON file
  const handleExportTriggers = () => {
    const dataStr = JSON.stringify(triggers, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ledfx-triggers-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    console.log('📥 Exported', triggers.length, 'triggers')
  }

  // Import triggers from JSON file
  const handleImportTriggers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedTriggers = JSON.parse(e.target?.result as string)
        if (!Array.isArray(importedTriggers)) {
          console.error('❌ Invalid trigger file format')
          return
        }
        importedTriggers.forEach((trigger: any) => {
          // Validate trigger has required fields
          const hasRequiredFields =
            trigger.songName &&
            trigger.songHash &&
            trigger.duration !== undefined &&
            trigger.position !== undefined
          if (hasRequiredFields) {
            addTrigger({
              songName: trigger.songName,
              songHash: trigger.songHash,
              duration: trigger.duration,
              position: trigger.position,
              sceneId: trigger.sceneId || ''
            })
          }
        })
        console.log('📤 Imported', importedTriggers.length, 'triggers')
      } catch (error) {
        console.error('❌ Failed to import triggers:', error)
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be imported again
    event.target.value = ''
  }

  // Parse MM:SS.mmm format to seconds
  const parsePosition = (value: string): number | null => {
    const match = value.match(/^(\d+):(\d{2})(?:\.(\d{1,3}))?$/)
    if (!match) return null
    const minutes = parseInt(match[1], 10)
    const seconds = parseInt(match[2], 10)
    const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0
    return minutes * 60 + seconds + milliseconds / 1000
  }

  // Format seconds to MM:SS.mmm
  const formatPosition = (value: number): string => {
    const minutes = Math.floor(value / 60)
    const seconds = Math.floor(value % 60)
    const milliseconds = Math.round((value % 1) * 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }

  // Handle position edit
  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    if (newRow.position === oldRow.position) {
      return oldRow // No change
    }

    // Validate position
    if (newRow.position <= 0 || newRow.position >= oldRow.duration) {
      console.warn('⚠️ Invalid position:', newRow.position, 'Duration:', oldRow.duration)
      return oldRow // Reject invalid edit
    }

    console.log('✏️ Editing trigger position:', {
      oldPosition: oldRow.position.toFixed(3),
      newPosition: newRow.position.toFixed(3),
      songName: oldRow.songName
    })

    // Since ID includes position, we need to delete old and create new
    const wasFired = firedTriggers.has(oldRow.id)
    deleteTrigger(oldRow.id)

    const songHash = generateSongHash(oldRow.songName, oldRow.duration)
    const newTriggerId = `${songHash}_${Math.round(newRow.position * 1000)}`

    addTrigger({
      songName: oldRow.songName,
      songHash,
      duration: oldRow.duration,
      position: newRow.position,
      sceneId: oldRow.sceneId
    })

    // Preserve fired state
    if (wasFired) {
      setFiredTriggers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(oldRow.id)
        newSet.add(newTriggerId)
        return newSet
      })
    }

    return { ...newRow, id: newTriggerId }
  }

  const columns: GridColDef[] = [
    {
      field: 'songName',
      headerName: 'Song',
      flex: 1,
      minWidth: 250
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      valueFormatter: (params: any) => formatPosition(params.value),
      valueParser: (value: string) => {
        const parsed = parsePosition(value)
        return parsed !== null ? parsed : value
      },
      renderCell: (params: any) => formatPosition(params.value)
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => {
        const minutes = Math.floor(params.value / 60)
        const seconds = Math.round(params.value % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      }
    },
    {
      field: 'sceneId',
      headerName: 'Scene',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => {
        return (
          <FormControl fullWidth sx={{ height: '100%' }}>
            <Select
              value={params.value || ''}
              onChange={(e) => handleUpdateTrigger(params.row.id, e.target.value)}
              displayEmpty
              size="small"
              sx={{ height: '100%' }}
            >
              <MenuItem value="">
                <em>No Scene</em>
              </MenuItem>
              {scenes &&
                Object.keys(scenes).map((sceneId) => (
                  <MenuItem key={sceneId} value={sceneId}>
                    {scenes[sceneId].name || sceneId}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <Popover
          variant="text"
          color="inherit"
          icon={<DeleteForever />}
          style={{ minWidth: 40 }}
          onConfirm={() => handleDeleteTrigger(params.row.id)}
        />
      )
    }
  ]

  const rows = triggers.map((trigger) => ({
    id: trigger.id,
    songName: trigger.songName,
    position: trigger.position,
    duration: trigger.duration,
    sceneId: trigger.sceneId,
    songHash: trigger.songHash
  }))

  return (
    <Root style={{ display: 'flex', width: '100%' }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Scene Triggers</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              label="Latency"
              type="number"
              value={triggerLatencyMs}
              onChange={(e) => setTriggerLatencyMs(Number(e.target.value))}
              size="small"
              sx={{ width: 120 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">ms</InputAdornment>
              }}
            />
            <IconButton
              onClick={handleExportTriggers}
              disabled={triggers.length === 0}
              sx={{ color: 'primary.main' }}
              size="small"
              title="Export triggers to JSON"
            >
              <FileDownload />
            </IconButton>
            <IconButton
              component="label"
              sx={{ color: 'primary.main' }}
              size="small"
              title="Import triggers from JSON"
            >
              <UploadFile />
              <input type="file" hidden accept=".json" onChange={handleImportTriggers} />
            </IconButton>
            <IconButton
              onClick={handleAddTrigger}
              disabled={!currentTrack || !duration || currentPosition === null}
              sx={{
                color: 'primary.main'
              }}
              size="small"
              title="Add trigger at current position"
            >
              <Add />
            </IconButton>
            <IconButton
              onClick={() => {
                const newState = !sceneTriggerActive
                console.log(`🎮 Scene Triggers ${newState ? 'ACTIVATED ✅' : 'DEACTIVATED ❌'}`)
                console.log('Current state:', {
                  sceneTriggerActive,
                  newState,
                  currentPosition,
                  currentSongHash,
                  triggerCount: triggers.length,
                  latencyMs: triggerLatencyMs
                })
                setSceneTriggerActive(newState)
              }}
              sx={{
                color: sceneTriggerActive ? 'success.main' : 'primary.main',
                '&:hover': {
                  backgroundColor: sceneTriggerActive ? 'success.dark' : 'primary.dark'
                }
              }}
              size="small"
              title={sceneTriggerActive ? 'Stop scene triggers' : 'Start scene triggers'}
            >
              {sceneTriggerActive ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Stack>
        </Box>
        <DataGrid
          className={classes.root}
          autoHeight
          disableRowSelectionOnClick
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('❌ Row update error:', error)
          }}
          sx={{
            boxShadow: 2,
            color: '#fff',
            border: 1,
            borderColor: '#666'
          }}
          columns={columns}
          rows={rows}
          getRowClassName={(params: GridRowParams<any>) => {
            if (firedTriggers.has(params.row.id)) {
              return 'trigger_fired'
            }
            return params.row.songHash === currentSongHash ? 'currently_playing' : ''
          }}
        />
      </Card>
    </Root>
  )
}
