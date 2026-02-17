import { useState, useEffect } from 'react'
import { Box, Grid, Collapse } from '@mui/material'
import useSongDetector from '../../../../../hooks/useSongDetector'
import SpTexterForm from '../SpotifyWidgetPro/SpTexterForm'
import SongDetectorAlbumArtForm from './SongDetectorAlbumArtForm'
import SongDetectorSceneTriggerTable from './SongDetectorSceneTriggerTable'
import SongDetectorCard from './SongDetectorCard'
import SongDetectorPlayerWithStats from './SongDetectorPlayerWithStats'

const SongDetectorContent = () => {
  const { standard, plus, startDetector, stopDetector, downloadDetector, deleteDetector } =
    useSongDetector()
  const [settingsOpen, setSettingsOpen] = useState(!(plus.isAvailable && plus.isRunning))
  const [lyricsOpen, setLyricsOpen] = useState(false)

  // Auto-open settings when detector is not available or not running
  useEffect(() => {
    if (!plus.isAvailable || !plus.isRunning) {
      setSettingsOpen(true)
    }
  }, [plus.isAvailable, plus.isRunning])

  return (
    <>
      <Collapse in={settingsOpen}>
        <SongDetectorCard
          type="plus"
          detector={plus}
          startDetector={startDetector}
          stopDetector={stopDetector}
          downloadDetector={downloadDetector}
          deleteDetector={deleteDetector}
          otherDetectorRunning={standard.isRunning}
        />
      </Collapse>
      {/* Player and Stats */}
      <SongDetectorPlayerWithStats
        settingsOpen={settingsOpen}
        onToggleSettings={() => setSettingsOpen(!settingsOpen)}
        lyricsOpen={lyricsOpen}
        onToggleLyrics={() => setLyricsOpen(!lyricsOpen)}
      />

      {/* Scene Trigger Table */}
      <Box sx={{ mt: 3 }}>
        <SongDetectorSceneTriggerTable />
      </Box>

      {/* Configuration forms */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SpTexterForm generalDetector={true} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SongDetectorAlbumArtForm preview={false} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default SongDetectorContent
