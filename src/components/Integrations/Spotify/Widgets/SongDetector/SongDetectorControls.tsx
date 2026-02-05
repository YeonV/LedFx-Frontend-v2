import React from 'react'
import { Stack, Fab, Tooltip, CircularProgress } from '@mui/material'
import { PlayArrow, Stop, Delete, Download } from '@mui/icons-material'

interface SongDetectorControlsProps {
  detector: {
    isAvailable: boolean
    isRunning: boolean
    isDownloading: boolean
    downloadProgress: number
  }
  isPlus: boolean
  startDetector: (deviceName: string, isPlus: boolean) => void
  stopDetector: (isPlus: boolean) => void
  downloadDetector: (isPlus: boolean) => void
  deleteDetector: (isPlus: boolean) => void
  otherDetectorRunning: boolean
  children?: React.ReactNode
}

const SongDetectorControls: React.FC<SongDetectorControlsProps> = ({
  detector,
  isPlus,
  startDetector,
  stopDetector,
  downloadDetector,
  deleteDetector,
  otherDetectorRunning,
  children
}) => {
  return (
    <Stack direction="row" spacing={1}>
      {detector.isAvailable ? (
        <>
          <Tooltip title={detector.isRunning ? 'Stop Detector' : 'Start Detector'}>
            <Fab
              size="small"
              color={detector.isRunning ? 'error' : isPlus ? 'success' : 'primary'}
              onClick={() =>
                detector.isRunning ? stopDetector(isPlus) : startDetector('ledfxcc', isPlus)
              }
              disabled={otherDetectorRunning}
              sx={{ width: 40, height: 40, minHeight: 40 }}
            >
              {detector.isRunning ? <Stop /> : <PlayArrow />}
            </Fab>
          </Tooltip>
          <Tooltip title="Delete Detector">
            <Fab
              size="small"
              color="error"
              onClick={() => deleteDetector(isPlus)}
              disabled={detector.isRunning}
              sx={{ width: 40, height: 40, minHeight: 40 }}
            >
              <Delete />
            </Fab>
          </Tooltip>
          {children}
        </>
      ) : (
        <Tooltip title="Download Detector">
          <Fab
            size="small"
            color="success"
            onClick={() => downloadDetector(isPlus)}
            disabled={detector.isDownloading}
            sx={{ width: 40, height: 40, minHeight: 40 }}
          >
            {detector.isDownloading ? (
              <CircularProgress
                size={20}
                variant="determinate"
                value={detector.downloadProgress}
                sx={{ color: 'white' }}
              />
            ) : (
              <Download />
            )}
          </Fab>
        </Tooltip>
      )}
    </Stack>
  )
}

export default SongDetectorControls
