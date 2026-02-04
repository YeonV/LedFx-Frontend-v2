import { Box, IconButton, Stack, Typography, Tooltip, useTheme } from '@mui/material'
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  Shuffle,
  Repeat
} from '@mui/icons-material'
import SceneImage from '../ScenesImage'
import { PlaybackControlsProps } from './types'

export default function PlaybackControls({
  selectedPlaylist,
  playlistName,
  playlistImage,
  isPlaying,
  isPaused,
  playlistRuntimeState,
  runtimeMode,
  onPlayPause,
  onStop,
  onNext,
  onPrevious,
  onToggleMode
}: PlaybackControlsProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        p: 2
      }}
    >
      <Box
        sx={{
          height: 360,
          width: 360,
          margin: '16px auto'
        }}
      >
        <SceneImage
          iconName={selectedPlaylist ? playlistImage : 'yz:logo2'}
          sx={{
            height: '100%',
            color: selectedPlaylist ? theme.palette.text.primary : theme.palette.text.disabled
          }}
        />
      </Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        width={'100%'}
        mt={2}
      >
        <IconButton onClick={onPrevious} disabled={!selectedPlaylist || !playlistRuntimeState}>
          <SkipPrevious />
        </IconButton>

        <IconButton
          onClick={onPlayPause}
          disabled={!selectedPlaylist}
          sx={{
            bgcolor: theme.palette.primary.main + '20',
            '&:hover': { bgcolor: theme.palette.primary.main + '40' }
          }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        <IconButton onClick={onStop} disabled={!selectedPlaylist || !playlistRuntimeState}>
          <Stop />
        </IconButton>

        <IconButton onClick={onNext} disabled={!selectedPlaylist || !playlistRuntimeState}>
          <SkipNext />
        </IconButton>

        {playlistRuntimeState && (
          <Tooltip title={`Toggle Runtime Mode (Current: ${runtimeMode})`}>
            <span>
              <IconButton
                disabled={!selectedPlaylist || !playlistRuntimeState}
                onClick={onToggleMode}
                sx={{
                  bgcolor:
                    runtimeMode === 'shuffle'
                      ? theme.palette.warning.main + '20'
                      : theme.palette.info.main + '20',
                  '&:hover': {
                    bgcolor:
                      runtimeMode === 'shuffle'
                        ? theme.palette.warning.main + '40'
                        : theme.palette.info.main + '40'
                  }
                }}
              >
                {runtimeMode === 'shuffle' ? <Shuffle /> : <Repeat />}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mt: 1, mb: 0.5, fontWeight: 'bold' }}
        color={selectedPlaylist ? 'textPrimary' : 'textDisabled'}
      >
        {selectedPlaylist ? playlistName : 'No Playlist Selected'}
      </Typography>
    </Box>
  )
}
