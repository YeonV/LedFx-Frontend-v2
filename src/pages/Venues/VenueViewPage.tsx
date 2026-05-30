import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  CircularProgress,
  ToggleButton
} from '@mui/material'
import { ArrowBack, Edit, EditOff, FlashOn } from '@mui/icons-material'
import useStore from '../../store/useStore'
import ColorPadGrid from './ColorPadGrid'
import PixelGraph from '../../components/PixelGraph/PixelGraph'

export default function VenueViewPage() {
  const { venueId } = useParams<{ venueId: string }>()
  const navigate = useNavigate()

  const venue = useStore((state) => (venueId ? state.venues[venueId] : undefined))
  const virtuals = useStore((state) => state.virtuals)
  const venues = useStore((state) => state.venues)
  const getVenues = useStore((state) => state.getVenues)
  const addVirtualToVenue = useStore((state) => state.addVirtualToVenue)
  const removeVirtualFromVenue = useStore((state) => state.removeVirtualFromVenue)
  const clearVenueOverride = useStore((state) => state.clearVenueOverride)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const activeVenueId = useStore((state) => state.activeVenueId)
  const activeOverridePadIndex = useStore((state) => state.activeOverridePadIndex)

  const [adding, setAdding] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (!venue) {
      getVenues()
    }
  }, [venue, getVenues])

  // Subscribe to WebSocket pixel updates for all venue virtuals
  useEffect(() => {
    if (!venue) return
    setPixelGraphs(venue.virtual_ids)
    return () => {
      setPixelGraphs([])
    }
  }, [venue?.virtual_ids, setPixelGraphs])

  const handleBack = useCallback(async () => {
    if (venueId) await clearVenueOverride(venueId)
    navigate('/venues')
  }, [venueId, clearVenueOverride, navigate])

  const handleAddVirtual = useCallback(
    async (_: any, newValue: any) => {
      if (!newValue || !venueId) return
      setAdding(true)
      await addVirtualToVenue(venueId, newValue.id)
      setAdding(false)
    },
    [venueId, addVirtualToVenue]
  )

  const handleRemoveVirtual = useCallback(
    async (virtualId: string) => {
      if (!venueId) return
      await removeVirtualFromVenue(venueId, virtualId)
    },
    [venueId, removeVirtualFromVenue]
  )

  if (!venue) {
    return (
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading venue…</Typography>
      </Box>
    )
  }

  const overrideActive = activeVenueId === venueId && activeOverridePadIndex !== null

  const occupiedVirtualIds = Object.values(venues).reduce<Set<string>>((acc, v) => {
    for (const vid of v.virtual_ids) acc.add(vid)
    return acc
  }, new Set())

  const availableVirtuals = Object.values(virtuals).filter(
    (v) => !occupiedVirtualIds.has(v.id) || venue.virtual_ids.includes(v.id)
  )

  const memberVirtuals = venue.virtual_ids.map((id) => virtuals[id]).filter(Boolean)
  const notYetAdded = availableVirtuals.filter((v) => !venue.virtual_ids.includes(v.id))

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} variant="outlined" size="small">
          All Venues
        </Button>
        <Typography variant="h5">{venue.name}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Color Override Pad Grid */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="subtitle1">Color Override Pads</Typography>
        <ToggleButton
          value="edit"
          selected={isEditMode}
          onChange={() => setIsEditMode((v) => !v)}
          size="small"
          color="primary"
        >
          {isEditMode ? <EditOff fontSize="small" /> : <Edit fontSize="small" />}
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
            {isEditMode ? 'Done' : 'Edit Grid'}
          </Box>
        </ToggleButton>
      </Box>
      <ColorPadGrid venue={venue} isEditMode={isEditMode} />

      <Divider sx={{ my: 3 }} />

      {/* Live Preview */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle1">Live Preview</Typography>
        {overrideActive && (
          <Chip
            icon={<FlashOn fontSize="small" />}
            label="Override Active"
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
      </Box>
      {memberVirtuals.length === 0 ? (
        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
          Add virtuals to see a live preview.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
          {memberVirtuals.map((v) => {
            const effectName = v.effect?.name ?? v.effect?.type ?? null
            return (
              <Box key={v.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {v.config?.name ?? v.id}
                  </Typography>
                  {effectName ? (
                    <Chip label={effectName} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                  ) : (
                    <Chip label="No effect" size="small" variant="outlined" color="default" sx={{ height: 18, fontSize: '0.65rem', opacity: 0.5 }} />
                  )}
                </Box>
                <PixelGraph virtId={v.id} active={v.active} db />
              </Box>
            )
          })}
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Virtual membership */}
      <Typography variant="subtitle1" gutterBottom>
        Virtuals in this venue
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {memberVirtuals.length === 0 && (
          <Typography color="text.secondary" variant="body2">
            No virtuals assigned yet.
          </Typography>
        )}
        {memberVirtuals.map((v) => (
          <Chip
            key={v.id}
            label={v.config?.name ?? v.id}
            onDelete={() => handleRemoveVirtual(v.id)}
          />
        ))}
      </Box>
      <Autocomplete
        options={notYetAdded}
        getOptionLabel={(v) => v.config?.name ?? v.id}
        onChange={handleAddVirtual}
        value={null}
        disabled={adding}
        renderInput={(params) => (
          <TextField {...params} label="Add virtual to venue" size="small" sx={{ maxWidth: 320 }} />
        )}
        isOptionEqualToValue={(a, b) => a.id === b.id}
      />
    </Box>
  )
}
