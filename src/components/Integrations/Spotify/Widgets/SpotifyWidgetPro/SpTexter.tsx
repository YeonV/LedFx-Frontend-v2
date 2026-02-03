import { useState } from 'react'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material'
import BladeIcon from '../../../../Icons/BladeIcon/BladeIcon'
import useStore from '../../../../../store/useStore'
import SpTexterForm from './SpTexterForm'

const SpTexter = () => {
  const theme = useTheme()
  const integrations = useStore((state) => state.integrations)
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
  const sendSpotifyTrack = useStore((state) => state.spotify.sendSpotifyTrack)

  const [open, setOpen] = useState(false)

  if (!(integrations.spotify?.active && spAuthenticated)) return null

  return (
    <Box>
      <IconButton onClick={() => setOpen(!open)}>
        <BladeIcon
          name="Title"
          sx={[
            sendSpotifyTrack
              ? {
                  color: theme.palette.primary.main
                }
              : {
                  color: 'inherit'
                }
          ]}
        />
      </IconButton>
      <Dialog
        className="nodrag"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ onDrag: (e: any) => e.stopProagation() }}
        onDrag={(e: any) => e.stopProagation()}
      >
        <DialogTitle>Send songname to matrix</DialogTitle>
        <DialogContent>
          <SpTexterForm />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default SpTexter
