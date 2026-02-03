import { useState } from 'react'
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import BladeIcon from '../../../../Icons/BladeIcon/BladeIcon'
import useStore from '../../../../../store/useStore'
import SpAlbumArtForm from './SpAlbumArtForm'

const SpAlbumArt = () => {
  const integrations = useStore((state) => state.integrations)
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)

  const [open, setOpen] = useState(false)

  if (!(integrations.spotify?.active && spAuthenticated)) return null

  return (
    <Box>
      <IconButton onClick={() => setOpen(!open)}>
        <BladeIcon
          name="Image"
          sx={[
            {
              color: 'inherit'
            }
          ]}
        />
      </IconButton>
      <Dialog
        className="nodrag"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ onDrag: (e: any) => e.stopPropagation() }}
        onDrag={(e: any) => e.stopPropagation()}
      >
        <DialogTitle>Album Art Colors</DialogTitle>
        <DialogContent>
          <SpAlbumArtForm />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default SpAlbumArt
