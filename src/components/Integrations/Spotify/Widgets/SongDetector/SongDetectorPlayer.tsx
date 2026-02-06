import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
  IconButton
} from '@mui/material'
import { Pause as PauseIcon, PlayArrow, Settings, BarChart } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import useStore from '../../../../../store/useStore'
import { formatTime } from '../../../../../utils/helpers'
import { generateSongHash } from '../../../../../store/ui/storeSongDectector'

const SongDetectorPlayer = ({
  settingsOpen,
  onToggleSettings,
  statsOpen,
  onToggleStats
}: {
  settingsOpen?: boolean
  onToggleSettings?: () => void
  statsOpen?: boolean
  onToggleStats?: () => void
}) => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const thumbnailPath = useStore((state) => state.thumbnailPath)
  const position = useStore((state) => state.position)
  const duration = useStore((state) => state.duration)
  const playing = useStore((state) => state.playing)
  const timestamp = useStore((state) => state.timestamp)
  const triggers = useStore((state) => state.triggers)
  const scenes = useStore((state) => state.scenes)

  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const [cacheBuster, setCacheBuster] = useState(() => Date.now())

  // Update cache buster when track changes
  useEffect(() => {
    setCacheBuster(Date.now())
  }, [currentTrack])

  // Interpolate position for smooth updates
  useEffect(() => {
    if (!position || !timestamp || !playing) {
      setCurrentPosition(position)
      return
    }

    const updatePosition = () => {
      const elapsed = Date.now() / 1000 - timestamp!
      const interpolated = Math.min(position! + elapsed, duration || Infinity)
      setCurrentPosition(interpolated)
    }

    updatePosition()
    const interval = setInterval(updatePosition, 100)

    return () => clearInterval(interval)
  }, [position, timestamp, playing, duration])

  // Parse artist and title from "Artist - Title" format
  const parseTrack = (track: string) => {
    const parts = track.split(' - ')
    if (parts.length >= 2) {
      return {
        artist: parts[0].trim(),
        title: parts.slice(1).join(' - ').trim()
      }
    }
    return { artist: 'Unknown Artist', title: track }
  }

  const { artist, title } = currentTrack ? parseTrack(currentTrack) : { artist: '', title: '' }

  const defaultImage = '/icon.png'

  // Get triggers for current song
  const currentSongHash = currentTrack && duration ? generateSongHash(currentTrack, duration) : null
  const currentSongTriggers = currentSongHash
    ? triggers.filter((t) => t.songHash === currentSongHash)
    : []

  return (
    <Card sx={{ width: '100%', mb: 2, position: 'relative' }}>
      {onToggleStats && (
        <IconButton
          onClick={onToggleStats}
          sx={{
            position: 'absolute',
            top: 8,
            right: 40,
            zIndex: 1,
            color: statsOpen ? 'success.main' : 'text.secondary'
          }}
          size="small"
        >
          <BarChart />
        </IconButton>
      )}
      {onToggleSettings && (
        <IconButton
          onClick={onToggleSettings}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            color: settingsOpen ? 'success.main' : 'text.secondary'
          }}
          size="small"
        >
          <Settings />
        </IconButton>
      )}
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Album Art */}
          <Box
            sx={{
              width: 120,
              height: 120,
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <img
              src={thumbnailPath ? `${thumbnailPath}?t=${cacheBuster}` : defaultImage}
              alt="Album Art"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = defaultImage
              }}
            />
          </Box>

          {/* Track Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {title || 'No track playing'}
            </Typography>
            <Typography variant="body1" noWrap sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              {artist}
            </Typography>

            {/* Playback Controls */}
            {duration && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  {playing ? (
                    <PlayArrow sx={{ fontSize: '1.2rem', color: 'success.main' }} />
                  ) : (
                    <PauseIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {formatTime((currentPosition || 0) * 1000)} / {formatTime(duration * 1000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    {Math.round(((currentPosition || 0) / duration) * 100)}%
                  </Typography>
                </Stack>
                <Box sx={{ position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(((currentPosition || 0) / duration) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: 'success.main'
                      }
                    }}
                  />
                  {/* Trigger markers */}
                  {currentSongTriggers.map((trigger) => {
                    const positionPercent = (trigger.position / duration) * 100
                    return (
                      <Box
                        key={trigger.id}
                        sx={{
                          position: 'absolute',
                          left: `${positionPercent}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: trigger.sceneId ? 'primary.main' : 'warning.main',
                          zIndex: 2,
                          opacity: 0.8,
                          '&:hover': {
                            opacity: 1,
                            width: '3px'
                          }
                        }}
                        title={`${formatTime(trigger.position * 1000)} - ${trigger.sceneId ? scenes?.[trigger.sceneId]?.name || trigger.sceneId : 'No Scene'}`}
                      />
                    )
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SongDetectorPlayer
