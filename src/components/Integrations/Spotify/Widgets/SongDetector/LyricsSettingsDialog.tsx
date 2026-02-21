import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  TextField,
  Typography,
  Stack,
  Box,
  IconButton
} from '@mui/material'
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { clearLyricsCache } from './lyricsUtils'

interface LyricsSettingsDialogProps {
  open: boolean
  onClose: () => void
  offset: number
  onOffsetChange: (newOffset: number) => void
  onCacheCleared: () => void
}

const LyricsSettingsDialog = ({
  open,
  onClose,
  offset,
  onOffsetChange,
  onCacheCleared
}: LyricsSettingsDialogProps) => {
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onOffsetChange(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value)
    if (value >= -2000 && value <= 2000) {
      onOffsetChange(value)
    }
  }

  const handleResetOffset = () => {
    onOffsetChange(500)
  }

  const handleClearCache = () => {
    clearLyricsCache()
    onCacheCleared()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Lyrics Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" gutterBottom>
              Sync Offset (ms)
            </Typography>
            <IconButton size="small" onClick={handleResetOffset} title="Reset to default (500ms)">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Adjust the timing of synced lyrics. Positive values make lyrics appear earlier.
          </Typography>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Slider
              value={offset}
              min={-2000}
              max={2000}
              step={50}
              onChange={handleSliderChange}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              value={offset}
              size="small"
              onChange={handleInputChange}
              inputProps={{
                step: 50,
                min: -2000,
                max: 2000,
                type: 'number'
              }}
              sx={{ width: 80 }}
            />
          </Stack>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Cache Management
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearCache}
            fullWidth
          >
            Clear Lyrics Cache
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LyricsSettingsDialog
