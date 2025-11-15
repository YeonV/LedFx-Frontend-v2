import { Box, Container, Typography } from '@mui/material'
import BackendPlaylist from './BackendPlaylist'

export default function BackendPlaylistPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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
