import { Box, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState, useRef, useMemo } from 'react'
import { Client, LyricLine } from 'lrclib-api'

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

  // Auto-scroll control
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const client = useMemo(() => new Client(), [])
  const containerRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!artist || !title) return

    let isMounted = true

    const fetchLyrics = async () => {
      setLoading(true)
      setError(null)
      setSyncedLyrics(null)
      setPlainLyrics(null)

      try {
        // lrclib-api JS wrapper expects duration in milliseconds
        const durationMs = Math.round(duration * 1000)

        // Try to get synced lyrics first
        const synced = await client.getSynced({
          artist_name: artist,
          track_name: title,
          duration: durationMs
        })

        if (isMounted) {
          if (synced && synced.length > 0) {
            setSyncedLyrics(synced)
          } else {
            // If no synced lyrics, try to find any lyrics (plain)
            const lyrics = await client.findLyrics({
              artist_name: artist,
              track_name: title,
              duration: durationMs
            })
            setPlainLyrics(lyrics.plainLyrics)
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
    for (let i = 0; i < syncedLyrics.length; i++) {
      const line = syncedLyrics[i]
      // startTime is in seconds from lrclib-api (confirmed via source check)
      // position is also in seconds in SongDetector components
      const startTime = line.startTime || 0
      if (position >= startTime) {
        index = i
      } else {
        break
      }
    }
    return index
  }, [syncedLyrics, position])

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress size={32} color="success" />
      </Box>
    )
  }

  if (error && !plainLyrics && !syncedLyrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
      </Box>
    )
  }

  if (syncedLyrics && syncedLyrics.length > 0) {
    return (
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
    )
  }

  if (plainLyrics) {
    return (
      <Box
        sx={{
          p: 4,
          maxHeight: 400,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px'
          }
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 2 }}>
          {plainLyrics}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
      <Typography variant="body1" color="text.secondary">
        No lyrics available
      </Typography>
    </Box>
  )
}

export default Lyrics
