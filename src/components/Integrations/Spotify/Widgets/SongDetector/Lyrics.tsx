import { Box, Typography, CircularProgress, IconButton } from '@mui/material'
import { Tune as TuneIcon } from '@mui/icons-material'
import { useEffect, useState, useRef, useMemo } from 'react'
import { Client, LyricLine } from 'lrclib-api'
import { findLyricsInCache, saveLyricsToCache } from './lyricsUtils'
import LyricsSettingsDialog from './LyricsSettingsDialog'

const Lyrics = ({
  position,
  duration,
  artist,
  title
}: {
  position: number
  duration: number
  artist: string
  title: string
}) => {
  const [loading, setLoading] = useState(false)
  const [syncedLyrics, setSyncedLyrics] = useState<LyricLine[] | null>(null)
  const [plainLyrics, setPlainLyrics] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [offset, setOffset] = useState(() => {
    const saved = localStorage.getItem('ledfx_lyrics_offset')
    return saved ? parseInt(saved, 10) : 500
  })

  // Auto-scroll control
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const client = useMemo(() => new Client(), [])
  const containerRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  const handleOffsetChange = (newOffset: number) => {
    setOffset(newOffset)
    localStorage.setItem('ledfx_lyrics_offset', newOffset.toString())
  }

  useEffect(() => {
    if (!artist || !title) return

    let isMounted = true

    const fetchLyrics = async () => {
      // 1. Check Cache
      const cached = findLyricsInCache(artist, title)
      if (cached) {
        setSyncedLyrics(cached.synced)
        setPlainLyrics(cached.plain)
        return
      }

      setLoading(true)
      setError(null)
      setSyncedLyrics(null)
      setPlainLyrics(null)

      try {
        const durationMs = Math.round(duration * 1000)

        // 2. Try to get synced lyrics from API
        const synced = await client.getSynced({
          artist_name: artist,
          track_name: title,
          duration: durationMs
        })

        if (isMounted) {
          if (synced && synced.length > 0) {
            setSyncedLyrics(synced)
            saveLyricsToCache(artist, title, synced, null)
          } else {
            // 3. Try to get plain lyrics from API
            const lyrics = await client.findLyrics({
              artist_name: artist,
              track_name: title,
              duration: durationMs
            })
            setPlainLyrics(lyrics.plainLyrics)
            saveLyricsToCache(artist, title, null, lyrics.plainLyrics)
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch lyrics:', err)
          setError('Lyrics not found')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchLyrics()

    return () => {
      isMounted = false
    }
  }, [artist, title, duration, client])

  // Find the current active line index
  const activeIndex = useMemo(() => {
    if (!syncedLyrics) return -1

    let index = -1
    const offsetSeconds = offset / 1000
    for (let i = 0; i < syncedLyrics.length; i++) {
      const line = syncedLyrics[i]
      const startTime = line.startTime || 0
      if (position + offsetSeconds >= startTime) {
        index = i
      } else {
        break
      }
    }
    return index
  }, [syncedLyrics, position, offset])

  // Scroll active line into view
  useEffect(() => {
    if (activeLineRef.current && !isUserScrolling) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [activeIndex, isUserScrolling])

  const handleScroll = () => {
    setIsUserScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 3000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <IconButton
        size="small"
        onClick={() => setSettingsOpen(true)}
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          zIndex: 10,
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' }
        }}
      >
        <TuneIcon fontSize="small" />
      </IconButton>

      <LyricsSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        offset={offset}
        onOffsetChange={handleOffsetChange}
        onCacheCleared={() => {
          // Optional: clear current state if we want immediate feedback
          // setSyncedLyrics(null); setPlainLyrics(null);
        }}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress size={32} color="success" />
        </Box>
      )}

      {error && !plainLyrics && !syncedLyrics && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
          <Typography variant="body1" color="text.secondary">
            {error}
          </Typography>
        </Box>
      )}

      {syncedLyrics && syncedLyrics.length > 0 && (
        <Box
          ref={containerRef}
          onWheel={handleScroll}
          onTouchStart={handleScroll}
          sx={{
            height: 400,
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            p: 4,
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <Box sx={{ height: '150px' }} />
          {syncedLyrics.map((line, index) => (
            <Typography
              key={index}
              ref={index === activeIndex ? activeLineRef : null}
              variant="h5"
              sx={{
                py: 2,
                transition: 'all 0.5s ease',
                color: index === activeIndex ? 'success.main' : 'text.secondary',
                fontWeight: index === activeIndex ? 'bold' : 'normal',
                transform: index === activeIndex ? 'scale(1.1)' : 'scale(1)',
                opacity: index === activeIndex ? 1 : 0.4,
                cursor: 'default',
                textAlign: 'center',
                filter: index === activeIndex ? 'none' : 'blur(0.5px)'
              }}
            >
              {line.text}
            </Typography>
          ))}
          <Box sx={{ height: '150px' }} />
        </Box>
      )}

      {plainLyrics && !syncedLyrics && !loading && (
        <Box
          sx={{
            p: 6,
            maxHeight: 400,
            overflowY: 'auto',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 2,
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '10px'
            }
          }}
        >
          <Typography
            variant="h6"
            sx={{
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              color: 'text.primary',
              fontWeight: 300,
              opacity: 0.9,
              animation: 'fadeIn 1s ease'
            }}
          >
            {plainLyrics}
          </Typography>
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 0.9; transform: translateY(0); }
              }
            `}
          </style>
        </Box>
      )}

      {!loading && !error && !syncedLyrics && !plainLyrics && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
          <Typography variant="body1" color="text.secondary">
            No lyrics available
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Lyrics
