import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import SongDetectorStatusChips from './SongDetectorStatusChips'
import SongDetectorControls from './SongDetectorControls'

interface SongDetectorCardProps {
  type: 'standard' | 'plus'
  detector: {
    isAvailable: boolean
    isRunning: boolean
    isDownloading: boolean
    downloadProgress: number
    status: any
    updateAvailable: boolean
  }
  startDetector: (deviceName: string, isPlus: boolean) => void
  stopDetector: (isPlus: boolean) => void
  downloadDetector: (isPlus: boolean) => void
  deleteDetector: (isPlus: boolean) => void
  otherDetectorRunning: boolean
  children?: React.ReactNode
}

const SongDetectorCard: React.FC<SongDetectorCardProps> = ({
  type,
  detector,
  startDetector,
  stopDetector,
  downloadDetector,
  deleteDetector,
  otherDetectorRunning,
  children
}) => {
  const isPlus = type === 'plus'

  return (
    <Card
      sx={{
        border: '2px solid',
        borderColor: detector.isRunning ? 'success.main' : 'divider',
        mb: 2
      }}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isPlus ? 'Song Detector Plus' : 'Song Detector'}
            <SongDetectorStatusChips detector={detector} />
          </div>
          <SongDetectorControls
            detector={detector}
            isPlus={isPlus}
            startDetector={startDetector}
            stopDetector={stopDetector}
            downloadDetector={downloadDetector}
            deleteDetector={deleteDetector}
            otherDetectorRunning={otherDetectorRunning}
          >
            {children}
          </SongDetectorControls>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SongDetectorCard
