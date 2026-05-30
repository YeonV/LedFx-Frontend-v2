import { useCallback, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Typography,
  Divider,
  Autocomplete,
  TextField
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import useStore from '../../store/useStore'
import type { Venue } from '../../store/api/storeVenues'
import ColorPadGrid from './ColorPadGrid'

interface Props {
  venue: Venue
  onLeave: () => void
}

export default function VenueView({ venue, onLeave }: Props) {
  const virtuals = useStore((state) => state.virtuals)
  const venues = useStore((state) => state.venues)
  const addVirtualToVenue = useStore((state) => state.addVirtualToVenue)
  const removeVirtualFromVenue = useStore((state) => state.removeVirtualFromVenue)
  const [adding, setAdding] = useState(false)

  // Compute which virtual IDs are already in ANY venue (for greying-out in picker)
  const occupiedVirtualIds = Object.values(venues).reduce<Set<string>>((acc, v) => {
    for (const vid of v.virtual_ids) acc.add(vid)
    return acc
  }, new Set())

  // Virtual options for autocomplete: exclude those already in another venue
  const availableVirtuals = Object.values(virtuals).filter(
    (v) => !occupiedVirtualIds.has(v.id) || venue.virtual_ids.includes(v.id)
  )

  const handleAddVirtual = useCallback(
    async (_: any, newValue: any) => {
      if (!newValue) return
      setAdding(true)
      await addVirtualToVenue(venue.id, newValue.id)
      setAdding(false)
    },
    [venue.id, addVirtualToVenue]
  )

  const handleRemoveVirtual = useCallback(
    async (virtualId: string) => {
      await removeVirtualFromVenue(venue.id, virtualId)
    },
    [venue.id, removeVirtualFromVenue]
  )

  const memberVirtuals = venue.virtual_ids
    .map((id) => virtuals[id])
    .filter(Boolean)

  const notYetAdded = availableVirtuals.filter((v) => !venue.virtual_ids.includes(v.id))

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={onLeave} variant="outlined" size="small">
          All Venues
        </Button>
        <Typography variant="h5">{venue.name}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Color Override Pad Grid */}
      <Typography variant="subtitle1" gutterBottom>
        Color Override Pads
      </Typography>
      <ColorPadGrid venue={venue} isEditMode={false} />

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
