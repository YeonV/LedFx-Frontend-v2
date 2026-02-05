import React from 'react'
import { Stack, Chip } from '@mui/material'

interface SongDetectorStatusChipsProps {
  detector: {
    isAvailable: boolean
    isRunning: boolean
    status: any
  }
}

const SongDetectorStatusChips: React.FC<SongDetectorStatusChipsProps> = ({ detector }) => {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
      {detector.isAvailable ? (
        <>
          <Chip label="Available" color="success" size="small" />
          <Chip
            label={detector.isRunning ? 'Running' : 'Stopped'}
            color={detector.isRunning ? 'success' : 'default'}
            size="small"
          />
        </>
      ) : (
        <Chip label="Not Installed" color="warning" size="small" />
      )}
      {detector.status && (
        <Chip label={`Platform: ${detector.status.platform}`} size="small" variant="outlined" />
      )}
    </Stack>
  )
}

export default SongDetectorStatusChips
