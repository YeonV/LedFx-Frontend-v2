import { Box, Grid, Typography } from '@mui/material'
import useStore from '../../../../../store/useStore'
import SpTexterForm from '../SpotifyWidgetPro/SpTexterForm'
import SongDetectorAlbumArtForm from './SongDetectorAlbumArtForm'

const SongDetector = () => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)

  return (
    <Box sx={{ padding: 2 }}>
      {currentTrack && currentTrack.length > 3 && (
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Text Display
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                mx: 2,
                fontSize: '1.2rem'
              }}
            >
              {currentTrack}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 256 }}>
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
      )}
    </Box>
  )
}

export default SongDetector
