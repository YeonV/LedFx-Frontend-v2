import { Box, Container, Typography } from '@mui/material'
import BackendPlaylist from './BackendPlaylist/BackendPlaylist'

export default function BackendPlaylistPage() {
  return (
    <Container sx={{ py: 3, maxWidth: '1672px !important' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Backend Playlists
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Server-side playlist management with advanced timing controls and real-time playback
        </Typography>
      </Box>

      <BackendPlaylist cards />
    </Container>
  )
}
