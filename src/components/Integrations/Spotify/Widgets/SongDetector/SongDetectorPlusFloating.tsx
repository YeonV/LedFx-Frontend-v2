import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import useStyle from './SdFloating.styles'
import SdPlusFloating from './SdPlusFloating'
import SongDetectorContent from './SongDetectorContent'

const SongDetectorPlusFloating = ({ close }: { close?: () => void }) => {
  const classes = useStyle()

  return (
    <Box component={SdPlusFloating}>
      <div className={classes.Widget} style={{ width: 1150, maxWidth: '95vw' }}>
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
          <Typography>Song Detector Plus</Typography>
          {close && (
            <IconButton onClick={() => close()}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <Box sx={{ p: 2, maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
          <SongDetectorContent />
        </Box>
      </div>
    </Box>
  )
}

export default SongDetectorPlusFloating
