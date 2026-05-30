import { useCallback, useState, useRef } from 'react'
import { Box, Tooltip, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import useStore from '../../store/useStore'
import type { Venue, ColorPad } from '../../store/api/storeVenues'
import GradientPicker from '../../components/SchemaForm/components/GradientPicker/GradientPicker'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Return a CSS background string for a pad (solid color or gradient). */
function padBackground(pad: ColorPad): string {
  if (pad.gradient) return pad.gradient
  if (pad.color) return pad.color
  return '#444'
}

/** Return true if the color is visually dark (for text contrast). */
function isDark(cssColor: string): boolean {
  if (cssColor.startsWith('linear-gradient')) return true
  try {
    const c = cssColor.replace('#', '')
    if (c.length !== 6) return true
    const r = parseInt(c.slice(0, 2), 16)
    const g = parseInt(c.slice(2, 4), 16)
    const b = parseInt(c.slice(4, 6), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 < 128
  } catch {
    return true
  }
}

// ─── Pad editor dialog ───────────────────────────────────────────────────────

interface PadEditorProps {
  open: boolean
  pad: ColorPad
  onClose: () => void
  onSave: (pad: ColorPad) => void
}

function PadEditorDialog({ open, pad, onClose, onSave }: PadEditorProps) {
  const [currentColor, setCurrentColor] = useState<string>(pad.gradient ?? pad.color ?? '#ff0000')
  const colors = useStore((state) => state.colors)
  const getColors = useStore((state) => state.getColors)
  const addColor = useStore((state) => state.addColor)
  const showHex = useStore((state) => state.uiPersist.showHex)

  // Fetch colors on first open
  const fetchedRef = useRef(false)
  if (open && !fetchedRef.current) {
    fetchedRef.current = true
    if (!colors || Object.keys(colors).length === 0) getColors()
  }

  const handleColorChange = useCallback((value: string) => {
    setCurrentColor(value)
  }, [])

  const handleSave = () => {
    const isGradient = currentColor.includes('gradient')
    onSave(isGradient ? { gradient: currentColor } : { color: currentColor })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Edit Pad Color</DialogTitle>
      <DialogContent>
        <GradientPicker
          pickerBgColor={currentColor}
          isGradient={true}
          colors={colors}
          sendColorToVirtuals={handleColorChange}
          handleAddGradient={(name: string, color: string) => addColor({ [name]: color })}
          showHex={showHex}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Apply
        </Button>
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

  const { cols, pads } = venue.color_pads

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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 1,
          maxWidth: cols * 72,
          mb: 1
        }}
      >
        {pads.map((pad, i) => {
          const isActive = activeVenueId === venue.id && activeOverridePadIndex === i
          const bg = padBackground(pad)
          const textColor = isDark(bg) ? '#fff' : '#000'
          const row = Math.floor(i / cols) + 1
          const col = (i % cols) + 1
          return (
            <Tooltip
              key={i}
              title={isEditMode ? `Edit pad ${row}×${col}` : `Pad ${row}×${col}`}
              placement="top"
            >
              <Paper
                elevation={isActive ? 8 : 2}
                onClick={() => handleClick(i)}
                sx={{
                  width: 64,
                  height: 64,
                  background: bg,
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
                }}
              >
                {isActive && !isEditMode && (
                  <Typography variant="caption" sx={{ color: textColor, fontWeight: 'bold' }}>
                    ON
                  </Typography>
                )}
              </Paper>
            </Tooltip>
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
          onClose={() => setEditingPadIndex(null)}
          onSave={handlePadSave}
        />
      )}
    </>
  )
}
