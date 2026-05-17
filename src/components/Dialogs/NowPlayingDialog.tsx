import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Slider,
  Button,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material'
import { Close, Save } from '@mui/icons-material'

import useStore from '../../store/useStore'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'
import type { NowPlayingConfig } from '../../store/api/storeNowPlaying'

const labelSx = {
  fontWeight: 700,
  color: 'common.white',
  backgroundColor: 'background.paper',
  px: 0.5,
  transform: 'translate(14px, -12px) scale(0.75)',

  '&.Mui-focused': {
    color: 'common.white'
  }
}

const formControlSx = {
  mt: 2,
  mb: 2
}

const NowPlayingDialog = () => {
  const open = useStore((state) => state.dialogs.nowPlayingManager?.open || false)
  const setDialogOpenNowPlayingManager = useStore((state) => state.setDialogOpenNowPlayingManager)
  const nowPlayingState = useStore((state) => state.nowPlayingState)
  const available = useStore((state) => state.nowPlayingAvailable)
  const getNowPlaying = useStore((state) => state.getNowPlaying)
  const updateNowPlayingConfig = useStore((state) => state.updateNowPlayingConfig)
  const virtuals = useStore((state) => state.virtuals)
  const getLedFxPresets = useStore((state) => state.getLedFxPresets)
  const userPresetsAll = useStore((state) => state.config?.user_presets)

  const config = nowPlayingState?.config
  const metadata = nowPlayingState?.metadata
  const artwork = nowPlayingState?.artwork

  // Local form state
  const [gradientEnabled, setGradientEnabled] = useState(true)
  const [gradientVariant, setGradientVariant] = useState<string>('led_punchy')
  const [gradientVirtuals, setGradientVirtuals] = useState<string[]>([])

  const [trackTextEnabled, setTrackTextEnabled] = useState(false)
  const [trackTextDuration, setTrackTextDuration] = useState(8)
  const [trackTextVirtuals, setTrackTextVirtuals] = useState<string[]>([])
  const [trackTextPreset, setTrackTextPreset] = useState('')

  const [albumArtEnabled, setAlbumArtEnabled] = useState(false)
  const [albumArtDuration, setAlbumArtDuration] = useState(10)
  const [albumArtVirtuals, setAlbumArtVirtuals] = useState<string[]>([])

  const [dirty, setDirty] = useState(false)

  // Texter2d presets for the Track Text preset dropdown
  const [ledfxTexterPresets, setLedfxTexterPresets] = useState<Record<string, { name: string }>>({})
  const userTexterPresets = (userPresetsAll as any)?.texter2d ?? {}

  // Sync local state from server config
  useEffect(() => {
    if (config) {
      setGradientEnabled(config.gradient.enabled)
      setGradientVariant(config.gradient.variant)
      setGradientVirtuals(config.gradient.virtual_ids)
      setTrackTextEnabled(config.track_text.enabled)
      setTrackTextDuration(config.track_text.duration)
      setTrackTextVirtuals(config.track_text.virtual_ids)
      setTrackTextPreset(config.track_text.preset)
      setAlbumArtEnabled(config.album_art.enabled)
      setAlbumArtDuration(config.album_art.duration)
      setAlbumArtVirtuals(config.album_art.virtual_ids)
      setDirty(false)
    }
  }, [config])

  // Fetch now-playing state whenever the dialog opens
  useEffect(() => {
    if (open) {
      getNowPlaying()
      getLedFxPresets().then((allPresets: any) => {
        setLedfxTexterPresets(allPresets?.texter2d ?? {})
      })
    }
  }, [open, getNowPlaying, getLedFxPresets])

  // Two-stage update: on track change start a 3s fallback timer; on gradient change
  // cancel the timer and update immediately (gradient_changed means artwork is ready).
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useSubscription('now_playing_track_changed', () => {
    if (!open) return
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current)
    fallbackTimerRef.current = setTimeout(() => {
      fallbackTimerRef.current = null
      getNowPlaying()
    }, 3000)
  })

  useSubscription('now_playing_gradient_changed', () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
    if (open) getNowPlaying()
  })

  // Clear any pending timer when the dialog closes
  useEffect(() => {
    if (!open && fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }, [open])

  const handleClose = () => {
    setDialogOpenNowPlayingManager(false)
    setDirty(false)
  }

  const handleSave = async () => {
    const newConfig: NowPlayingConfig = {
      gradient: {
        enabled: gradientEnabled,
        variant: gradientVariant,
        virtual_ids: gradientVirtuals
      },
      track_text: {
        enabled: trackTextEnabled,
        duration: trackTextDuration,
        virtual_ids: trackTextVirtuals,
        preset: trackTextPreset
      },
      album_art: {
        enabled: albumArtEnabled,
        duration: albumArtDuration,
        virtual_ids: albumArtVirtuals
      }
    }

    const ok = await updateNowPlayingConfig(newConfig)

    if (ok) {
      setDirty(false)
      getNowPlaying()
    }
  }

  const virtualIds = Object.keys(virtuals || {})

  // Only matrix virtuals (rows > 1) are valid for track text and album art
  const matrixVirtualIds = virtualIds.filter((id) => ((virtuals[id]?.config as any)?.rows ?? 1) > 1)

  // Derive available gradient variants from artwork response,
  // falling back to the configured variant so the dropdown is never empty
  const availableVariants = Array.from(
    new Set([
      ...Object.keys(artwork?.gradients ?? {}).filter((k) => k !== 'metadata'),
      ...(config?.gradient.variant ? [config.gradient.variant] : [])
    ])
  )

  const markDirty = () => setDirty(true)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Now Playing
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!available && (
          <Box sx={{ mb: 2 }}>
            <Chip color="warning" label="Now Playing service unavailable" />
          </Box>
        )}

        {/* Current track info */}
        {metadata && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {artwork?.url && (
                <Box
                  component="img"
                  src={artwork.url}
                  alt="Album art"
                  sx={{
                    width: 112,
                    height: 112,
                    borderRadius: 1,
                    objectFit: 'cover'
                  }}
                />
              )}

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {metadata.title ?? 'Unknown'}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {metadata.artist ?? 'Unknown'}
                  {metadata.album ? ` — ${metadata.album}` : ''}
                </Typography>
              </Box>
            </Box>

            {nowPlayingState?.current_gradient && (
              <Box
                sx={{
                  width: '100%',
                  height: 24,
                  borderRadius: 1,
                  background: nowPlayingState.current_gradient
                }}
              />
            )}
          </Box>
        )}

        {/* Gradient configuration */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Gradient Application
        </Typography>

        <Box sx={{ mb: 2, pl: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={gradientEnabled}
                onChange={(e) => {
                  setGradientEnabled(e.target.checked)
                  markDirty()
                }}
                disabled={!available}
              />
            }
            label="Apply extracted gradients on track change"
          />

          <FormControl size="small" fullWidth sx={formControlSx}>
            <InputLabel sx={labelSx}>Variant</InputLabel>

            <Select
              value={gradientVariant}
              label="Variant"
              disabled={!available || !gradientEnabled}
              onChange={(e) => {
                setGradientVariant(e.target.value as string)
                markDirty()
              }}
            >
              {availableVariants.map((variant) => (
                <MenuItem key={variant} value={variant}>
                  {variant}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth sx={formControlSx}>
            <InputLabel sx={labelSx}>Target Virtuals</InputLabel>

            <Select
              multiple
              value={gradientVirtuals}
              label="Target Virtuals"
              disabled={!available || !gradientEnabled}
              onChange={(e) => {
                setGradientVirtuals(e.target.value as string[])
                markDirty()
              }}
              renderValue={(selected) =>
                selected.length === 0 ? 'All virtuals' : selected.join(', ')
              }
            >
              {virtualIds.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary">
            Leave empty to apply to all virtuals with active effects.
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Track text configuration */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Track Text Display
        </Typography>

        <Box sx={{ mb: 2, pl: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={trackTextEnabled}
                onChange={(e) => {
                  setTrackTextEnabled(e.target.checked)
                  markDirty()
                }}
                disabled={!available}
              />
            }
            label="Switch to text effect on track change"
          />

          {trackTextEnabled && (
            <>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Duration: {trackTextDuration === 0 ? 'Permanent' : `${trackTextDuration}s`}
                </Typography>

                <Slider
                  size="small"
                  value={trackTextDuration}
                  min={0}
                  max={60}
                  disabled={!available}
                  onChange={(_, v) => {
                    setTrackTextDuration(v as number)
                    markDirty()
                  }}
                />

                <Typography variant="caption" color="text.secondary">
                  0 = permanent (no restore to previous effect)
                </Typography>
              </Box>

              <FormControl size="small" fullWidth sx={formControlSx}>
                <InputLabel sx={labelSx}>Target Virtuals (Matrix)</InputLabel>

                <Select
                  multiple
                  value={trackTextVirtuals}
                  label="Target Virtuals (Matrix)"
                  disabled={!available}
                  onChange={(e) => {
                    setTrackTextVirtuals(e.target.value as string[])
                    markDirty()
                  }}
                  renderValue={(selected) => (selected.length === 0 ? 'None' : selected.join(', '))}
                >
                  {matrixVirtualIds.map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth sx={formControlSx}>
                <InputLabel sx={labelSx}>
                  Preset - Ledfx or User Preset for Texter2d effect
                </InputLabel>

                <Select
                  displayEmpty
                  value={trackTextPreset}
                  label="Preset - Ledfx or User Preset for Texter2d effect"
                  disabled={!available}
                  onChange={(e) => {
                    setTrackTextPreset(e.target.value as string)
                    markDirty()
                  }}
                >
                  <MenuItem value="">
                    <em>Default</em>
                  </MenuItem>

                  {Object.keys(ledfxTexterPresets).length > 0 && (
                    <ListSubheader>LedFx Presets</ListSubheader>
                  )}

                  {Object.entries(ledfxTexterPresets).map(([id, p]) => (
                    <MenuItem key={`ledfx_${id}`} value={id}>
                      {p.name ?? id}
                    </MenuItem>
                  ))}

                  {Object.keys(userTexterPresets).length > 0 && (
                    <ListSubheader>My Presets</ListSubheader>
                  )}

                  {Object.entries(userTexterPresets).map(([id, p]: any) => (
                    <MenuItem key={`user_${id}`} value={id}>
                      {p.name ?? id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Album art configuration */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Album Art Display
        </Typography>

        <Box sx={{ mb: 2, pl: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={albumArtEnabled}
                onChange={(e) => {
                  setAlbumArtEnabled(e.target.checked)
                  markDirty()
                }}
                disabled={!available}
              />
            }
            label="Switch to image effect on artwork change"
          />

          {albumArtEnabled && (
            <>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Duration: {albumArtDuration === 0 ? 'Permanent' : `${albumArtDuration}s`}
                </Typography>

                <Slider
                  size="small"
                  value={albumArtDuration}
                  min={0}
                  max={60}
                  disabled={!available}
                  onChange={(_, v) => {
                    setAlbumArtDuration(v as number)
                    markDirty()
                  }}
                />

                <Typography variant="caption" color="text.secondary">
                  0 = permanent (no restore to previous effect)
                </Typography>
              </Box>

              <FormControl size="small" fullWidth sx={formControlSx}>
                <InputLabel sx={labelSx}>Target Virtuals (Matrix)</InputLabel>

                <Select
                  multiple
                  value={albumArtVirtuals}
                  label="Target Virtuals (Matrix)"
                  disabled={!available}
                  onChange={(e) => {
                    setAlbumArtVirtuals(e.target.value as string[])
                    markDirty()
                  }}
                  renderValue={(selected) => (selected.length === 0 ? 'None' : selected.join(', '))}
                >
                  {matrixVirtualIds.map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        {/* Save button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            disabled={!available || !dirty}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default NowPlayingDialog
