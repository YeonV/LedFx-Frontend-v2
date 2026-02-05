import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import SpTexterForm from '../SpotifyWidgetPro/SpTexterForm'
import SongDetectorAlbumArtForm from './SongDetectorAlbumArtForm'

interface SongDetectorTrackDisplayProps {
  currentTrack: string
}

const SongDetectorTrackDisplay: React.FC<SongDetectorTrackDisplayProps> = ({ currentTrack }) => {
  if (!currentTrack || currentTrack.length <= 3) {
    return null
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Text Display
        </Typography>
        <Box
          sx={{
            textAlign: 'center',
            height: 150,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            mb: 2,
            mx: 2,
            fontSize: '1.2rem'
          }}
        >
          {currentTrack}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <SpTexterForm generalDetector={true} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Album Art
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <SongDetectorAlbumArtForm />
        </Box>
      </Grid>
    </Grid>
  )
}

export default SongDetectorTrackDisplay
