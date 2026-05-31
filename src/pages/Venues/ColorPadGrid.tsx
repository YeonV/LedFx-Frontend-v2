import { useCallback, useEffect, useRef, useState } from 'react'
import ReactGPicker from 'react-gcolor-picker'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import useStore from '../../store/useStore'
import type { ColorPad, Venue } from '../../store/api/storeVenues'

// ─── Helpers ────────────────────────────────────────────────────────────────

const PAD_SIZES = { S: 40, M: 56, L: 72, XL: 96 } as const
type PadSizeKey = keyof typeof PAD_SIZES

/** Normalize a gradient string to always include an explicit angle. */
function normalizeGradient(colorStr: string): string {
  if (!colorStr || !colorStr.includes('linear-gradient')) return colorStr
  // No angle specified — add 90deg (left-to-right)
  if (!colorStr.match(/linear-gradient\s*\(\s*\d+deg/)) {
    return colorStr.replace(/linear-gradient\s*\(/, 'linear-gradient(90deg, ')
  }
  return colorStr
}

/** Replace 180deg (ReactGPicker's first-time default) with 90deg. */
function fixDefaultAngle(colorStr: string): string {
  return colorStr.replace(/linear-gradient\s*\(\s*180deg/, 'linear-gradient(90deg')
}

/** Return the auto-palette default hex color for pad i of n (mirrors backend). */
function defaultPadColor(padIndex: number, totalPads: number): string {
  if (totalPads === 0) return '#ff0000'
  const h = (padIndex / totalPads) * 360
  const s = 1
  const l = 0.5
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  return '#' + [r + m, g + m, b + m].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')
}

/** Build the background sx props for a pad. Gradients require backgroundImage. */
function padSx(pad: ColorPad, padSize: number, isActive: boolean, isEditMode: boolean) {
  const isGrad = Boolean(pad.gradient)
  const bg = pad.gradient ?? pad.color ?? '#444'
  return {
    width: padSize,
    height: padSize,
    ...(isGrad ? { backgroundImage: bg, backgroundColor: 'transparent' } : { backgroundColor: bg }),
    backgroundClip: 'padding-box',
    cursor: 'pointer',
    border: isActive
      ? '3px solid white'
      : isEditMode
      ? '3px dashed rgba(255,255,255,0.4)'
      : '3px solid transparent',
    outline: isActive ? '2px solid rgba(255,255,255,0.5)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    transition: 'all 0.15s',
    '&:hover': { opacity: 0.85 }
  }
}

/** Return true if a background color is visually dark (for text contrast). */
function isDark(pad: ColorPad): boolean {
  if (pad.gradient) return true
  const c = (pad.color ?? '#000').replace('#', '')
  if (c.length !== 6) return true
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

// ─── Pad editor dialog ───────────────────────────────────────────────────────

interface PadEditorProps {
  open: boolean
  pad: ColorPad
  padIndex: number
  totalPads: number
  onClose: () => void
  onSave: (pad: ColorPad) => void
}

function PadEditorDialog({ open, pad, padIndex, totalPads, onClose, onSave }: PadEditorProps) {
  const initialColor = normalizeGradient(pad.gradient ?? pad.color ?? '#ff0000')
  const [currentColor, setCurrentColor] = useState<string>(initialColor)
  const [confirmReset, setConfirmReset] = useState(false)
  // Tracks whether the picker had a gradient value before the most recent onChange
  const wasGradientRef = useRef(Boolean(pad.gradient))

  const colors = useStore((state) => state.colors)
  const getColors = useStore((state) => state.getColors)

  useEffect(() => {
    if (open) {
      const c = normalizeGradient(pad.gradient ?? pad.color ?? '#ff0000')
      setCurrentColor(c)
      setConfirmReset(false)
      wasGradientRef.current = c.includes('gradient')
      if (!colors || Object.keys(colors).length === 0) getColors()
    }
  }, [open, pad, colors, getColors])

  const defaultColors: string[] = []
  if (colors?.gradients?.builtin) defaultColors.push(...Object.values(colors.gradients.builtin) as string[])
  if (colors?.gradients?.user) defaultColors.push(...Object.values(colors.gradients.user) as string[])
  if (colors?.colors?.builtin) defaultColors.push(...Object.values(colors.colors.builtin) as string[])
  if (colors?.colors?.user) defaultColors.push(...Object.values(colors.colors.user) as string[])

  const handleSave = () => {
    const isGradient = currentColor.includes('gradient')
    onSave(isGradient ? { gradient: currentColor } : { color: currentColor })
    onClose()
  }

  const handleChange = (c: string) => {
    let normalized = normalizeGradient(c)
    const isNowGradient = normalized.includes('gradient')
    // Fix ReactGPicker's 180deg default only on the first solid→gradient switch
    if (isNowGradient && !wasGradientRef.current) {
      normalized = fixDefaultAngle(normalized)
    }
    wasGradientRef.current = isNowGradient
    setCurrentColor(normalized)
  }

  const handleResetClick = () => {
    if (confirmReset) {
      const def = defaultPadColor(padIndex, totalPads)
      setCurrentColor(def)
      wasGradientRef.current = false
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Pad Color</DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 0 }}>
        {/* Override ReactGPicker's hardcoded white backgrounds to match app theme */}
        <Box
          sx={(theme) => ({
            '& .colorpicker, & .popup_tabs, & .popup_tabs-header, & .color-picker-panel': {
              backgroundColor: `${theme.palette.background.paper} !important`
            },
            '& .popup_tabs-header-label': {
              color: `${theme.palette.text.secondary} !important`
            },
            '& .popup_tabs-header-label-active': {
              color: `${theme.palette.text.primary} !important`,
              backgroundColor: `${theme.palette.background.paper} !important`
            },
            '& .gradient-result': { display: 'none' },
            '& .input_rgba': { display: 'none' }
          })}
        >
          <ReactGPicker
            colorBoardHeight={150}
            debounce
            debounceMS={200}
            format="hex"
            gradient
            solid
            showAlpha={false}
            popupWidth={288}
            value={currentColor}
            defaultColors={defaultColors}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        {confirmReset ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" color="warning.main">Reset to default?</Typography>
            <Button size="small" color="warning" onClick={handleResetClick}>Confirm</Button>
            <Button size="small" onClick={() => setConfirmReset(false)}>Cancel</Button>
          </Box>
        ) : (
          <Button size="small" color="inherit" onClick={handleResetClick}>
            Reset to Default
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Apply
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

// ─── Color Pad Grid ──────────────────────────────────────────────────────────

interface Props {
  venue: Venue
  isEditMode: boolean
}

export default function ColorPadGrid({ venue, isEditMode }: Props) {
  const activeVenueId = useStore((state) => state.activeVenueId)
  const activeOverridePadIndex = useStore((state) => state.activeOverridePadIndex)
  const activateVenueOverride = useStore((state) => state.activateVenueOverride)
  const clearVenueOverride = useStore((state) => state.clearVenueOverride)
  const updateVenuePad = useStore((state) => state.updateVenuePad)

  const [editingPadIndex, setEditingPadIndex] = useState<number | null>(null)
  const [padSizeKey, setPadSizeKey] = useState<PadSizeKey>('XL')
  const padSize = PAD_SIZES[padSizeKey]

  const { cols, pads } = venue.color_pads
  const gap = 8

  const handleClick = useCallback(
    (index: number) => {
      if (isEditMode) {
        setEditingPadIndex(index)
      } else {
        if (activeOverridePadIndex === index && activeVenueId === venue.id) {
          clearVenueOverride(venue.id)
        } else {
          activateVenueOverride(venue.id, index)
        }
      }
    },
    [isEditMode, activeOverridePadIndex, activeVenueId, venue.id, activateVenueOverride, clearVenueOverride]
  )

  const handlePadSave = useCallback(
    async (pad: ColorPad) => {
      if (editingPadIndex === null) return
      await updateVenuePad(venue.id, editingPadIndex, pad)
    },
    [editingPadIndex, venue.id, updateVenuePad]
  )

  return (
    <>
      {/* Size selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary">Size:</Typography>
        <ToggleButtonGroup
          size="small"
          value={padSizeKey}
          exclusive
          onChange={(_, v) => v && setPadSizeKey(v as PadSizeKey)}
        >
          {(Object.keys(PAD_SIZES) as PadSizeKey[]).map((k) => (
            <ToggleButton key={k} value={k} sx={{ px: 1, py: 0.25, fontSize: '0.7rem' }}>
              {k}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Pad grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${padSize}px)`,
          gap: `${gap}px`,
          mb: 1,
          width: 'fit-content'
        }}
      >
        {pads.map((pad, i) => {
          const isActive = activeVenueId === venue.id && activeOverridePadIndex === i
          const textColor = isDark(pad) ? '#fff' : '#000'
          return (
              <Paper
                key={i}
                elevation={isActive ? 8 : 2}
                onClick={() => handleClick(i)}
                sx={padSx(pad, padSize, isActive, isEditMode)}
              >
                {isActive && !isEditMode && (
                  <Typography variant="caption" sx={{ color: textColor, fontWeight: 'bold' }}>
                    ON
                  </Typography>
                )}
              </Paper>
          )
        })}
      </Box>

      <Typography variant="caption" color="text.secondary">
        {isEditMode
          ? 'Click a pad to change its color or gradient'
          : 'Tap a pad to activate color override · Tap again to clear'}
      </Typography>

      {editingPadIndex !== null && (
        <PadEditorDialog
          open
          pad={pads[editingPadIndex]}
          padIndex={editingPadIndex}
          totalPads={pads.length}
          onClose={() => setEditingPadIndex(null)}
          onSave={handlePadSave}
        />
      )}
    </>
  )
}
