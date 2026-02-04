import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { ProgressBarProps } from './types'

export default function ProgressBar({
  progress,
  localElapsedMs,
  effectiveDurationMs,
  currentSceneIndex,
  totalScenes,
  isPlaying,
  isSceneChange
}: ProgressBarProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  return (
    <Box sx={{ mt: 2, mx: 3 }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          '& .MuiLinearProgress-bar': {
            transition: isSceneChange ? 'none' : 'transform 0.1s linear'
          }
        }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography variant="caption">
          {effectiveDurationMs ? formatTime(localElapsedMs) : ''}
        </Typography>
        <Typography variant="caption" color={isPlaying ? 'primary' : 'textDisabled'}>
          {isPlaying ? `Scene ${currentSceneIndex + 1} of ${totalScenes}` : 'not playing'}
        </Typography>
        <Typography variant="caption">
          {effectiveDurationMs ? formatTime(effectiveDurationMs) : ''}
        </Typography>
      </Stack>
    </Box>
  )
}
