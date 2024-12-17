import { Box, TextField } from '@mui/material'
import useStore from '../../../../../store/useStore'
import SpTexterForm from '../SpotifyWidgetPro/SpTexterForm'

const SongDetector = () => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Song"
        size="small"
        disabled
        value={currentTrack}
        sx={{ marginBottom: 2 }}
        fullWidth
      />
      {currentTrack && currentTrack.length > 3 && <SpTexterForm />}
    </Box>
  )
}

export default SongDetector
