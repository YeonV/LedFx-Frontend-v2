import { Box, Grid, Typography, Chip, Stack, Fab, Tooltip, CircularProgress } from '@mui/material'
import useStore from '../../../../../store/useStore'
import SpTexterForm from '../SpotifyWidgetPro/SpTexterForm'
import SongDetectorAlbumArtForm from './SongDetectorAlbumArtForm'
import useSongDetector from '../../../../../hooks/useSongDetector'
import { PlayArrow, Stop, Delete, Download } from '@mui/icons-material'

const SongDetector = () => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const {
    isAvailable,
    isRunning,
    isDownloading,
    downloadProgress,
    status,
    startDetector,
    stopDetector,
    downloadDetector,
    deleteDetector
  } = useSongDetector()

  return (
    <Box sx={{ padding: 2, position: 'relative' }}>
      {/* Status and Controls */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {isAvailable ? (
            <>
              <Chip label="Detector Available" color="success" size="small" />
              <Chip
                label={isRunning ? 'Running' : 'Stopped'}
                color={isRunning ? 'success' : 'default'}
                size="small"
              />
            </>
          ) : (
            <Chip label="Detector Not Found" color="warning" size="small" />
          )}
          {status && (
            <Chip label={`Platform: ${status.platform}`} size="small" variant="outlined" />
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          {isAvailable && (
            <Tooltip title="Delete Song Detector">
              <Fab
                size="small"
                color="error"
                onClick={deleteDetector}
                disabled={isRunning}
                sx={{ width: 40, height: 40, minHeight: 40 }}
              >
                <Delete />
              </Fab>
            </Tooltip>
          )}

          {!isAvailable && (
            <Tooltip title="Download Song Detector">
              <Fab
                size="small"
                color="success"
                onClick={downloadDetector}
                disabled={isDownloading}
                sx={{ width: 40, height: 40, minHeight: 40 }}
              >
                {isDownloading ? (
                  <CircularProgress
                    size={20}
                    variant="determinate"
                    value={downloadProgress}
                    sx={{ color: 'white' }}
                  />
                ) : (
                  <Download />
                )}
              </Fab>
            </Tooltip>
          )}

          {isAvailable && (
            <Tooltip title={isRunning ? 'Stop Song Detector' : 'Start Song Detector'}>
              <Fab
                size="small"
                color={isRunning ? 'error' : 'primary'}
                onClick={() => (isRunning ? stopDetector() : startDetector())}
                sx={{ width: 40, height: 40, minHeight: 40 }}
              >
                {isRunning ? <Stop /> : <PlayArrow />}
              </Fab>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Current Track Display */}
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
