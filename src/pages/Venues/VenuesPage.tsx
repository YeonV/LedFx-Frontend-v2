import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material'
import { Add, Delete, Edit, MeetingRoom } from '@mui/icons-material'
import useStore from '../../store/useStore'
import VenueView from './VenueView'

interface CreateVenueDialogProps {
  open: boolean
  onClose: () => void
  onSave: (name: string, rows: number, cols: number) => void
  initial?: { name: string; rows: number; cols: number }
}

function CreateVenueDialog({ open, onClose, onSave, initial }: CreateVenueDialogProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [rows, setRows] = useState(initial?.rows ?? 4)
  const [cols, setCols] = useState(initial?.cols ?? 4)

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setRows(initial?.rows ?? 4)
      setCols(initial?.cols ?? 4)
    }
  }, [open, initial?.name, initial?.rows, initial?.cols])

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), rows, cols)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initial ? 'Edit Venue' : 'Create Venue'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Venue name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="dense"
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Override pad rows"
            type="number"
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            slotProps={{ htmlInput: { min: 1, max: 16 } }}
            size="small"
          />
          <TextField
            label="Override pad cols"
            type="number"
            value={cols}
            onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
            slotProps={{ htmlInput: { min: 1, max: 16 } }}
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
          {initial ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function VenuesPage() {
  const venues = useStore((state) => state.venues)
  const activeVenueId = useStore((state) => state.activeVenueId)
  const getVenues = useStore((state) => state.getVenues)
  const createVenue = useStore((state) => state.createVenue)
  const updateVenue = useStore((state) => state.updateVenue)
  const deleteVenue = useStore((state) => state.deleteVenue)
  const setActiveVenueId = useStore((state) => state.setActiveVenueId)
  const clearVenueOverride = useStore((state) => state.clearVenueOverride)

  const [createOpen, setCreateOpen] = useState(false)
  const [editVenue, setEditVenue] = useState<{ id: string; name: string; rows: number; cols: number } | null>(null)

  useEffect(() => {
    getVenues()
  }, [getVenues])

  const handleCreate = useCallback(
    async (name: string, rows: number, cols: number) => {
      await createVenue(name, rows, cols)
    },
    [createVenue]
  )

  const handleEdit = useCallback(
    async (name: string, rows: number, cols: number) => {
      if (!editVenue) return
      await updateVenue(editVenue.id, {
        name,
        color_pads: { ...venues[editVenue.id]?.color_pads, rows, cols }
      })
      setEditVenue(null)
    },
    [editVenue, updateVenue, venues]
  )

  const handleDelete = useCallback(
    async (venueId: string) => {
      if (activeVenueId === venueId) {
        await clearVenueOverride(venueId)
        setActiveVenueId(null)
      }
      await deleteVenue(venueId)
    },
    [activeVenueId, clearVenueOverride, setActiveVenueId, deleteVenue]
  )

  const handleEnter = useCallback(
    (venueId: string) => {
      setActiveVenueId(venueId)
    },
    [setActiveVenueId]
  )

  const handleLeave = useCallback(async () => {
    if (activeVenueId) {
      await clearVenueOverride(activeVenueId)
    }
    setActiveVenueId(null)
  }, [activeVenueId, clearVenueOverride, setActiveVenueId])

  if (activeVenueId && venues[activeVenueId]) {
    return <VenueView venue={venues[activeVenueId]} onLeave={handleLeave} />
  }

  const venueList = Object.values(venues)

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h5">Venues</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
          size="small"
        >
          New Venue
        </Button>
      </Box>

      {venueList.length === 0 ? (
        <Typography color="text.secondary">
          No venues yet. Create one to group your devices and use color override pads.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {venueList.map((venue) => (
            <Box key={venue.id} sx={{ minWidth: 240, maxWidth: 320, flex: '1 1 240px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {venue.virtual_ids.length} virtual
                    {venue.virtual_ids.length !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {venue.color_pads.rows}×{venue.color_pads.cols} override pad grid
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<MeetingRoom />}
                    onClick={() => handleEnter(venue.id)}
                  >
                    Enter
                  </Button>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setEditVenue({
                          id: venue.id,
                          name: venue.name,
                          rows: venue.color_pads.rows,
                          cols: venue.color_pads.cols
                        })
                      }
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(venue.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      <CreateVenueDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
      {editVenue && (
        <CreateVenueDialog
          open={!!editVenue}
          onClose={() => setEditVenue(null)}
          onSave={handleEdit}
          initial={editVenue}
        />
      )}
    </Box>
  )
}
