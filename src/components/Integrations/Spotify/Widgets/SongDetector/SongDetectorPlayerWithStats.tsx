import { Box, Collapse, useMediaQuery } from '@mui/material'
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
  // The stats panel is a fixed 250px sibling in a row that never wraps, so on a
  // phone it hangs past the viewport and drags the whole page into horizontal
  // scrolling. It is dropped entirely there, toggle included - a control for a
  // panel that cannot be shown is just clutter.
  const xsmall = useMediaQuery('(max-width: 600px)')

  return (
    <Box sx={{ display: 'flex', mb: 2 }}>
      {/* minWidth: 0 or this flex item keeps its content's intrinsic width -
          a long, non-wrapping artist line then pushes the card wider than the
          screen instead of being ellipsised. */}
      <Box sx={{ flex: 1, minWidth: 0, transition: 'all 0.3s ease' }}>
        <SongDetectorPlayer
          settingsOpen={settingsOpen}
          onToggleSettings={onToggleSettings}
          statsOpen={statsOpen}
          onToggleStats={xsmall ? undefined : () => setStatsOpen(!statsOpen)}
          lyricsOpen={lyricsOpen}
          onToggleLyrics={onToggleLyrics}
        />
      </Box>
      {!xsmall && (
        <Collapse in={statsOpen} orientation="horizontal">
          <Box sx={{ width: '250px', ml: 2 }}>
            <SongDetectorStats />
          </Box>
        </Collapse>
      )}
    </Box>
  )
}

export default SongDetectorPlayerWithStats
