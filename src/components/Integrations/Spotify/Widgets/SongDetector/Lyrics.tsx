import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

const Lyrics = ({
  currentTrack,
  position,
  duration,
  playing,
  artist,
  title
}: {
  currentTrack: string
  position: number
  duration: number
  playing: boolean
  artist: string
  title: string
}) => {
  const [lyrics, setLyrics] = useState('Scrolling lyrics will appear here...')

  useEffect(() => {
    console.log(currentTrack, artist, title, position, duration, playing)
  }, [currentTrack, artist, title, position, duration, playing])

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {position}
      {lyrics}
    </Box>
  )
}

export default Lyrics
