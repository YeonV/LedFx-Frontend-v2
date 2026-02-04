import { Box, TextField, Grid, Typography } from '@mui/material'
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
            <TextField
              label="Song"
              disabled
              value={currentTrack}
              multiline
              rows={2}
              sx={{ marginBottom: 2, minHeight: 83 }}
              fullWidth
            />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <SpTexterForm />
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
