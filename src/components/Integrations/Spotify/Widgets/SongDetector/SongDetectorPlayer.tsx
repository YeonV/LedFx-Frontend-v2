import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  Collapse,
  useMediaQuery
} from '@mui/material'
import { createPortal } from 'react-dom'
import {
  Pause as PauseIcon,
  PlayArrow,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lyrics as LyricsIcon
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
// Marquee delay state

import useStore from '../../../../../store/useStore'
import { formatTime } from '../../../../../utils/helpers'
import { generateSongHash } from '../../../../../store/ui/storeSongDectector'
import CleaningButtons from './CleaningButtons'
import Lyrics from './Lyrics'
// Imported, not a public/ path. The core serves the frontend from an explicit
// route allowlist (/static, /fonts, /modules, /favicon, index.html, ...) and
// icon.png is not on it - './icon.png' is 200 on the CRA dev server and 404 in
// the app a user actually runs. Importing makes webpack emit it under /static,
// which is served everywhere: dev server, core, and Electron's file://.
import defaultImage from '../../../../../app-icon.png'

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
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0

  // On phones the action icons live in the screen's toolbar; the slot is
  // resolved after mount because the toolbar renders above this component.
  const xsmall = useMediaQuery('(max-width: 600px)')
  const [toolbarSlot, setToolbarSlot] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setToolbarSlot(xsmall ? document.getElementById('now-playing-toolbar-actions') : null)
  }, [xsmall])
  const renderActions = (node: React.ReactNode) =>
    toolbarSlot ? createPortal(node, toolbarSlot) : node

  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  // True for one beat after a discontinuous position change: mount, a track
  // change, or a seek in either direction.
  //
  // The bar's 0.2s transition is what turns the 100ms interpolation ticks into
  // smooth motion instead of ten visible steps a second, so it has to stay for
  // ordinary playback. On a jump the bar is not travelling anywhere - it is
  // being told where it already was - and animating that misrepresents what
  // happened. Most visible on mount, where the value goes 0 -> real position
  // and the bar slides across the card for no reason.
  const [skipTransition, setSkipTransition] = useState(false)
  const previousPositionRef = useRef<number | null>(null)

  const [marqueeActive, setMarqueeActive] = useState(false)

  // Interpolate position for smooth updates
  useEffect(() => {
    // One second is the discontinuity test: the interval below advances the
    // bar ~0.1s per tick, so anything larger cannot have come from playback.
    // No previous value at all is the mount case, which is a jump too.
    const apply = (next: number | null) => {
      const previous = previousPositionRef.current
      if (next !== null && (previous === null || Math.abs(next - previous) > 1)) {
        setSkipTransition(true)
        // Released a beat later rather than in an effect: the flag has to
        // survive until the browser has painted the new value, or the
        // transition is back before it did any good.
        setTimeout(() => setSkipTransition(false), 50)
      }
      previousPositionRef.current = next
      setCurrentPosition(next)
    }

    if (!position || !timestamp || !playing) {
      apply(position)
      return
    }

    const updatePosition = () => {
      const elapsed = Date.now() / 1000 - timestamp!
      apply(Math.min(position! + elapsed, duration || Infinity))
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
        {renderActions(
          <Stack
            direction="row"
            spacing={0}
            sx={
              toolbarSlot
                ? { alignItems: 'center' }
                : { position: 'absolute', top: 8, right: 8, zIndex: 1 }
            }
          >
            <CleaningButtons />
            {onToggleLyrics && (
              <IconButton
                onClick={onToggleLyrics}
                sx={{ color: lyricsOpen ? 'success.main' : 'text.secondary' }}
                size="small"
              >
                <LyricsIcon />
              </IconButton>
            )}
            {onToggleStats && (
              <IconButton
                onClick={onToggleStats}
                sx={{ color: statsOpen ? 'success.main' : 'text.secondary' }}
                size="small"
              >
                {statsOpen ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            )}
            {isCC && onToggleSettings && (
              <IconButton
                onClick={onToggleSettings}
                sx={{ color: settingsOpen ? 'success.main' : 'text.secondary' }}
                size="small"
              >
                <Settings />
              </IconButton>
            )}
          </Stack>
        )}
        <CardContent
          sx={{ p: { xs: 1, sm: 2 }, pb: { xs: '8px !important', sm: '16px !important' } }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Album Art */}
            <Box
              sx={{
                width: { xs: 110, sm: 120 },
                height: { xs: 110, sm: 120 },
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
                  // Clear the handler before reassigning: without this, a
                  // fallback that itself fails re-enters onError and the
                  // browser retries several times a second, flickering its
                  // broken-image glyph forever.
                  const img = e.currentTarget
                  img.onerror = null
                  if (img.src !== defaultImage) img.src = defaultImage
                }}
              />
            </Box>

            {/* Track Info */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                // relative, not margin: a centred flex item re-centres its margin
                // box, so a negative margin only moves it by half
                position: 'relative',
                top: { xs: '-3px', sm: 0 }
              }}
            >
              {title && title.length > 55 ? (
                <Box
                  sx={{
                    maxWidth: '100%',
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
                <Typography
                  variant="h5"
                  noWrap
                  sx={{ fontWeight: 'bold', mb: 0.5, maxWidth: '100%' }}
                >
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
                          transition: skipTransition ? 'none' : undefined
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
            {duration && currentPosition !== null && (
              <Lyrics
                position={currentPosition}
                duration={duration}
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
