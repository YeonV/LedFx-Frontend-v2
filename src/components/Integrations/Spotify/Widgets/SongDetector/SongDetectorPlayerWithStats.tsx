import { Box, Collapse } from '@mui/material'
import { useState } from 'react'
import SongDetectorPlayer from './SongDetectorPlayer'
import SongDetectorStats from './SongDetectorStats'

const SongDetectorPlayerWithStats = ({
  settingsOpen,
  onToggleSettings,
  lyricsOpen,
  onToggleLyrics
}: {
  settingsOpen?: boolean
  onToggleSettings?: () => void
  lyricsOpen?: boolean
  onToggleLyrics?: () => void
}) => {
  const [statsOpen, setStatsOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', mb: 2 }}>
      <Box sx={{ flex: 1, transition: 'all 0.3s ease' }}>
        <SongDetectorPlayer
          settingsOpen={settingsOpen}
          onToggleSettings={onToggleSettings}
          statsOpen={statsOpen}
          onToggleStats={() => setStatsOpen(!statsOpen)}
          lyricsOpen={lyricsOpen}
          onToggleLyrics={onToggleLyrics}
        />
      </Box>
      <Collapse in={statsOpen} orientation="horizontal">
        <Box sx={{ width: '250px', ml: 2 }}>
          <SongDetectorStats />
        </Box>
      </Collapse>
    </Box>
  )
}

export default SongDetectorPlayerWithStats
