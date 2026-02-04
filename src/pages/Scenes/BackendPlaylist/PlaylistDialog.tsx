import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Paper,
  InputAdornment,
  useTheme
} from '@mui/material'
import {
  Shuffle,
  Repeat,
  Save,
  Close,
  QueueMusic,
  RemoveCircle,
  AddCircle,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material'
import SceneImage from '../ScenesImage'
import TooltipImage from '../../../components/Dialogs/SceneDialogs/TooltipImage'
import GifPicker from '../../../components/SchemaForm/components/Gif/GifPicker'
import Popover from '../../../components/Popover/Popover'
import { PlaylistDialogProps } from './types'
import type { PlaylistItem } from '../../../api/ledfx.types'

export default function PlaylistDialog({
  open,
  isEdit,
  playlist,
  scenes,
  onClose,
  onSave,
  onChange
}: PlaylistDialogProps) {
  const theme = useTheme()
  const [localPlaylist, setLocalPlaylist] = useState(playlist)

  useEffect(() => {
    setLocalPlaylist(playlist)
  }, [playlist])

  const updatePlaylist = (updates: Partial<any>) => {
    const updated = { ...localPlaylist, ...updates }
    setLocalPlaylist(updated)
    onChange(updated)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>{isEdit ? 'Edit Playlist' : 'Create New Playlist'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Playlist Name"
            value={localPlaylist?.name || ''}
            onChange={(e) => updatePlaylist({ name: e.target.value })}
            fullWidth
          />
          <Stack direction="row" spacing={0} justifyContent={'space-between'}>
            <Box width="75%">
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Default Duration (seconds)"
                  type="number"
                  value={(localPlaylist?.default_duration_ms || 5000) / 1000}
                  onChange={(e) =>
                    updatePlaylist({
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
                    value={localPlaylist?.mode || 'sequence'}
                    onChange={(e) =>
                      updatePlaylist({
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
                        <GifPicker
                          mode="both"
                          value={
                            localPlaylist?.image?.replace('image:', '').replace('file:///', '') ||
                            ''
                          }
                          onChange={(filename) =>
                            updatePlaylist({
                              image:
                                filename.startsWith('builtin://') || filename.startsWith('http')
                                  ? `image:${filename}`
                                  : `image:file:///${filename}`
                            })
                          }
                        />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{ mt: 2 }}
                type="text"
                value={localPlaylist?.image || ''}
                onChange={(e) => updatePlaylist({ image: e.target.value })}
                fullWidth
              />
            </Box>
            <SceneImage
              iconName={localPlaylist?.image || 'QueueMusic'}
              sx={{ height: 128, width: 128 }}
            />
          </Stack>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              variant="outlined"
              sx={{ height: 56 }}
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  const sceneId = e.target.value as string
                  const newItem: PlaylistItem = {
                    scene_id: sceneId,
                    duration_ms: localPlaylist?.default_duration_ms || 5000
                  }
                  const currentItems = Array.isArray(localPlaylist?.items)
                    ? localPlaylist?.items
                    : []
                  updatePlaylist({
                    items: [...currentItems, newItem]
                  })
                }
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <Typography color="text.secondary">Select a scene to add...</Typography>
              </MenuItem>
              {Object.entries(scenes).map(([sceneId, scene]: [string, any]) => (
                <MenuItem key={sceneId} value={sceneId}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SceneImage
                      iconName={scene.scene_image || 'Wallpaper'}
                      list
                      sx={{ height: 50, width: 100 }}
                    />
                    <Typography>{scene?.name || sceneId}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            {Array.isArray(localPlaylist?.items) && localPlaylist?.items.length > 0 ? (
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List dense>
                  {localPlaylist.items.map((item: PlaylistItem, index: number) => {
                    const sceneData = scenes[item.scene_id]
                    return (
                      <ListItem key={`${item.scene_id}-${index}`} divider>
                        <ListItemIcon>
                          <Stack direction="column" spacing={0}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (index > 0) {
                                  const updatedItems = [...localPlaylist.items!]
                                  const temp = updatedItems[index]
                                  updatedItems[index] = updatedItems[index - 1]
                                  updatedItems[index - 1] = temp
                                  updatePlaylist({ items: updatedItems })
                                }
                              }}
                              disabled={index === 0}
                              sx={{
                                height: 20,
                                width: 20,
                                p: 0,
                                '&.Mui-disabled': { opacity: 0.3 }
                              }}
                            >
                              <KeyboardArrowUp fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                if (index < (localPlaylist?.items || []).length - 1) {
                                  const updatedItems = [...(localPlaylist?.items || [])]
                                  const temp = updatedItems[index]
                                  updatedItems[index] = updatedItems[index + 1]
                                  updatedItems[index + 1] = temp
                                  updatePlaylist({ items: updatedItems })
                                }
                              }}
                              disabled={index === localPlaylist.items!.length - 1}
                              sx={{
                                height: 20,
                                width: 20,
                                p: 0,
                                '&.Mui-disabled': { opacity: 0.3 }
                              }}
                            >
                              <KeyboardArrowDown fontSize="small" />
                            </IconButton>
                          </Stack>
                        </ListItemIcon>

                        <ListItemIcon sx={{ mr: 2 }}>
                          <SceneImage
                            iconName={sceneData?.scene_image || 'Wallpaper'}
                            list
                            sx={{ height: 50, width: 100 }}
                          />
                        </ListItemIcon>

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
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={
                              (item.duration_ms || localPlaylist.default_duration_ms || 5000) / 1000
                            }
                            onChange={(e) => {
                              const newDuration = Math.max(0.5, parseFloat(e.target.value)) * 1000
                              const updatedItems = [...localPlaylist.items!]
                              updatedItems[index] = { ...item, duration_ms: newDuration }
                              updatePlaylist({ items: updatedItems })
                            }}
                            InputProps={{
                              inputProps: { min: 0.5, step: 0.5 },
                              endAdornment: <Typography variant="caption">s</Typography>
                            }}
                            sx={{ width: 80 }}
                          />
                        </Box>

                        <ListItemSecondaryAction>
                          <Popover
                            size="small"
                            type="iconbutton"
                            color="error"
                            onConfirm={() => {
                              const updatedItems = (localPlaylist?.items || []).filter(
                                (_: any, i: number) => i !== index
                              )
                              updatePlaylist({ items: updatedItems })
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
                  No scenes selected
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  all availables scenes will be used
                </Typography>
              </Box>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                size="small"
                startIcon={<AddCircle />}
                onClick={() => {
                  const allSceneItems: PlaylistItem[] = Object.keys(scenes).map((sceneId) => ({
                    scene_id: sceneId,
                    duration_ms: localPlaylist.default_duration_ms || 5000
                  }))
                  updatePlaylist({ items: allSceneItems })
                }}
                variant="outlined"
              >
                Add All Scenes
              </Button>

              {!localPlaylist?.items || localPlaylist?.items.length === 0 ? null : (
                <Button
                  size="small"
                  startIcon={<RemoveCircle />}
                  onClick={() => updatePlaylist({ items: [] })}
                  variant="outlined"
                  color="error"
                >
                  Clear All
                </Button>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={localPlaylist?.timing?.jitter?.enabled || false}
                  onChange={(e) =>
                    updatePlaylist({
                      timing: {
                        ...localPlaylist.timing,
                        jitter: {
                          ...localPlaylist.timing?.jitter,
                          enabled: e.target.checked
                        }
                      }
                    })
                  }
                />
              }
              label="Enable Timing Jitter"
            />

            {localPlaylist?.timing?.jitter?.enabled && (
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Jitter Range</Typography>
                <Slider
                  value={[
                    localPlaylist.timing?.jitter?.factor_min || 0.8,
                    localPlaylist.timing?.jitter?.factor_max || 1.2
                  ]}
                  onChange={(_, value) => {
                    const [min, max] = value as number[]
                    updatePlaylist({
                      timing: {
                        ...localPlaylist.timing,
                        jitter: {
                          ...localPlaylist.timing?.jitter,
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
        <Button onClick={onClose}>
          <Close sx={{ mr: 1 }} />
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" disabled={!localPlaylist?.name}>
          <Save sx={{ mr: 1 }} />
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
