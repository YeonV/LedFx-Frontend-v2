import React from 'react'
import { Box } from '@mui/material'
import useStore from '../../../../../store/useStore'
import useSongDetector from '../../../../../hooks/useSongDetector'
import SongDetectorCard from './SongDetectorCard'
import SongDetectorTrackDisplay from './SongDetectorTrackDisplay'

const SongDetector = () => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const { standard, plus, startDetector, stopDetector, downloadDetector, deleteDetector } =
    useSongDetector()

  return (
    <Box sx={{ padding: 2, position: 'relative' }}>
      {/* Standard Detector */}
      <Box sx={{ mb: 3 }}>
        <SongDetectorCard
          type="standard"
          detector={standard}
          startDetector={startDetector}
          stopDetector={stopDetector}
          downloadDetector={downloadDetector}
          deleteDetector={deleteDetector}
          otherDetectorRunning={plus.isRunning}
        />
      </Box>

      <SongDetectorTrackDisplay currentTrack={currentTrack} />
    </Box>
  )
}

export default SongDetector
