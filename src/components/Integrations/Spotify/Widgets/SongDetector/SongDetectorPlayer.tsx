import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  Collapse
} from '@mui/material'
import {
  Pause as PauseIcon,
  PlayArrow,
  Settings,
  BarChart,
  Lyrics as LyricsIcon
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
// Marquee delay state

import useStore from '../../../../../store/useStore'
import { formatTime } from '../../../../../utils/helpers'
import { generateSongHash } from '../../../../../store/ui/storeSongDectector'
import CleaningButtons from './CleaningButtons'
import Lyrics from './Lyrics'

const SongDetectorPlayer = ({
  settingsOpen,
  onToggleSettings,
  statsOpen,
  onToggleStats,
  lyricsOpen,
  onToggleLyrics
}: {
  settingsOpen?: boolean
  onToggleSettings?: () => void
  statsOpen?: boolean
  onToggleStats?: () => void
  lyricsOpen?: boolean
  onToggleLyrics?: () => void
}) => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const thumbnailPath = useStore((state) => state.thumbnailPath)
  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)
  const position = useStore((state) => state.position)
  const duration = useStore((state) => state.duration)
  const playing = useStore((state) => state.playing)
  const timestamp = useStore((state) => state.timestamp)
  const triggers = useStore((state) => state.triggers)
  const scenes = useStore((state) => state.scenes)

  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const [isSeekingBack, setIsSeekingBack] = useState(false)
  const previousPositionRef = useRef<number | null>(null)

  const [marqueeActive, setMarqueeActive] = useState(false)

  // Interpolate position for smooth updates
  useEffect(() => {
    if (!position || !timestamp || !playing) {
      // Detect backward seek (e.g., restart or seek back)
      if (
        previousPositionRef.current !== null &&
        position !== null &&
        position < previousPositionRef.current - 1
      ) {
        setIsSeekingBack(true)
        setTimeout(() => setIsSeekingBack(false), 50)
      }
      previousPositionRef.current = position
      setCurrentPosition(position)
      return
    }

    const updatePosition = () => {
      const elapsed = Date.now() / 1000 - timestamp!
      const interpolated = Math.min(position! + elapsed, duration || Infinity)

      // Detect backward seek (e.g., restart or seek back)
      if (previousPositionRef.current !== null && interpolated < previousPositionRef.current - 1) {
        setIsSeekingBack(true)
        setTimeout(() => setIsSeekingBack(false), 50)
      }
      previousPositionRef.current = interpolated
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

  // Electron-compatible default image path (relative path works with file:// protocol)
  const defaultImage = './icon.png'

  // Get triggers for current song
  const currentSongHash = currentTrack && duration ? generateSongHash(currentTrack, duration) : null
  const currentSongTriggers = currentSongHash
    ? triggers.filter((t) => t.songHash === currentSongHash)
    : []

  useEffect(() => {
    setMarqueeActive(false)
    if (title && title.length > 55) {
      const timer = setTimeout(() => setMarqueeActive(true), 2000) // 2s delay
      return () => clearTimeout(timer)
    }
  }, [title])

  return (
    <>
      <Card sx={{ width: '100%', position: 'relative' }}>
        {/* Cleaning toggle and config buttons */}
        <CleaningButtons />
        {onToggleLyrics && (
          <IconButton
            onClick={onToggleLyrics}
            sx={{
              position: 'absolute',
              top: 8,
              right: 72,
              zIndex: 1,
              color: statsOpen ? 'success.main' : 'text.secondary'
            }}
            size="small"
          >
            <LyricsIcon />
          </IconButton>
        )}
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
        <CardContent sx={{ pb: '16px !important' }}>
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
                src={
                  thumbnailPath
                    ? `${window.localStorage.getItem('ledfx-host') + '/api/assets/download?path=' + thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
                    : defaultImage
                }
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
              {title && title.length > 55 ? (
                <Box
                  sx={{
                    maxWidth: 620,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    position: 'relative'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      animation: marqueeActive ? 'marquee 12s linear infinite' : 'none',
                      '@keyframes marquee': {
                        '0%': { transform: 'translateX(0%)' },
                        '25%': { transform: 'translateX(0%)' },
                        '100%': { transform: 'translateX(-100%)' }
                      }
                    }}
                  >
                    <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {title}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', mb: 0.5, maxWidth: 620 }}>
                  {title || 'No track playing'}
                </Typography>
              )}
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
                          backgroundColor: 'success.main',
                          transition: isSeekingBack ? 'none' : undefined
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
      <Collapse in={lyricsOpen} timeout="auto" unmountOnExit>
        <Card sx={{ width: '100%', position: 'relative' }}>
          <CardContent>
            {duration && currentPosition && (
              <Lyrics
                currentTrack={currentTrack}
                position={currentPosition}
                duration={duration}
                playing={playing}
                artist={artist}
                title={title}
              />
            )}
          </CardContent>
        </Card>
      </Collapse>
    </>
  )
}

export default SongDetectorPlayer
