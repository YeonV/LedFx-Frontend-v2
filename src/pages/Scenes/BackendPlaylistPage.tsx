import { useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import useStore from '../../store/useStore'
import BackendPlaylist from './BackendPlaylist'

export default function BackendPlaylistPage() {
  // Store hooks
  const scenes = useStore((state) => state.scenes)
  const getScenes = useStore((state) => state.getScenes)
  const activateScene = useStore((state) => state.activateScene)

  // Initialize scenes on mount
  useEffect(() => {
    getScenes()
  }, [getScenes])

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

      <BackendPlaylist scenes={scenes} activateScene={activateScene} />
    </Container>
  )
}
