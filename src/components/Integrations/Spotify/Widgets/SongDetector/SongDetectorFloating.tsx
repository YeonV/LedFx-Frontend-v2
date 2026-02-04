import { Box, IconButton, Stack, Typography } from '@mui/material'

import useStyle from './SdFloating.styles'
import SdFloating from './SdFloating'
import { Close } from '@mui/icons-material'
import SongDetector from './SongDetector'

const SongDetectorFloating = ({ close }: { close?: () => void }) => {
  const classes = useStyle()

  return (
    <Box component={SdFloating}>
      <div className={classes.Widget}>
        <Stack
          direction={'row'}
          p={2}
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent={close ? 'space-between' : 'center'}
          display="flex"
        >
          {close && <span />}
          <Typography>Song Detector (CTRL+ALT+T)</Typography>
          {close && (
            <IconButton onClick={() => close()}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <SongDetector />
      </div>
    </Box>
  )
}

export default SongDetectorFloating
