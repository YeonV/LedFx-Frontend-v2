import { useState } from 'react'
import {
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack as MuiStack,
  IconButton
} from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import useStore from '../../../../../store/useStore'

const CleaningButtons = () => {
  const cleanTitles = useStore((s) => s.spotify.cleanTitles)
  const setCleanTitles = useStore((s) => s.setCleanTitles)
  const cleanTitleRegex = useStore((s) => s.spotify.cleanTitleRegex)
  const setCleanTitleRegex = useStore((s) => s.setCleanTitleRegex)
  const cleanTitleList = useStore((s) => s.spotify.cleanTitleList)
  const setCleanTitleList = useStore((s) => s.setCleanTitleList)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [regex, setRegex] = useState('')
  const [list, setList] = useState('')

  const handleSave = () => {
    setCleanTitleRegex(regex)
    setCleanTitleList(
      list
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
    setDialogOpen(false)
  }

  const handleOpenDialog = () => {
    setRegex(cleanTitleRegex)
    setList(cleanTitleList.join('\n'))
    setDialogOpen(true)
  }

  return (
    <>
      <Tooltip title={cleanTitles ? 'Disable Title Cleaning' : 'Enable Title Cleaning'}>
        <IconButton
          onClick={() => setCleanTitles(!cleanTitles)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 112,
            zIndex: 1,
            color: cleanTitles ? 'success.main' : 'text.secondary'
          }}
          size="small"
        >
          <CleaningServicesIcon />
        </IconButton>
      </Tooltip>
      {cleanTitles && (
        <Tooltip title="Edit Cleaning Regex & List">
          <IconButton
            onClick={handleOpenDialog}
            sx={{
              position: 'absolute',
              top: 8,
              right: 152,
              zIndex: 1,
              color: dialogOpen ? 'success.main' : 'text.secondary'
            }}
            size="small"
          >
            <TuneIcon />
          </IconButton>
        </Tooltip>
      )}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setRegex(cleanTitleRegex)
          setList(cleanTitleList.join('\n'))
        }}
      >
        <DialogTitle>Edit Cleaning Regex & List</DialogTitle>
        <DialogContent>
          <MuiStack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Regex (optional)"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              fullWidth
              size="small"
              helperText="If set, overrides the list."
            />
            <TextField
              label="Keyword List (one per line)"
              value={list}
              onChange={(e) => setList(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              size="small"
            />
          </MuiStack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CleaningButtons
