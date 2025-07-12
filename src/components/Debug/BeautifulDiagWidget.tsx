// BeautifulDiagWidget.tsx

import { Card, Typography, Grid, Box } from '@mui/material'

// --- Icon Imports ---
import SpeedIcon from '@mui/icons-material/Speed'
import TimerIcon from '@mui/icons-material/Timer'
import BoltIcon from '@mui/icons-material/Bolt'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import { Line } from 'react-chartjs-2'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'

// --- Type definitions ---
interface DiagPacket {
  virtual_id: string
  fps: number
  r_avg: number
  r_min: number
  r_max: number
  cycle: number
  sleep: number
  phy: {
    fps: number
    ver: string
    n: number
    name: string
    rssi: number
    qual: number
  }
}

interface DiagMessage {
  data: DiagPacket
  timestamp: Date
}

interface BeautifulDiagWidgetProps {
  latestMessage: DiagMessage
  history: DiagMessage[]
}

const getStatusColor = (packet: DiagPacket): string => {
  if (packet.fps < 30) return '#f44336'
  if (packet.fps < 55 || packet.r_max > 0.005) return '#ff9800'
  return '#4caf50'
}

const formatMs = (seconds: number) => seconds * 1000

const sparklineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  },
  elements: {
    point: {
      radius: 0
    }
  },
  animation: {
    duration: 0
  }
}

export const BeautifulDiagWidget = ({ latestMessage, history }: BeautifulDiagWidgetProps) => {
  const { data } = latestMessage
  // const { data, timestamp } = latestMessage
  const statusColor = getStatusColor(data)
  const workload = data.cycle > 0 ? ((data.cycle - data.sleep) / data.cycle) * 100 : 0

  const reversedHistory = [...history].reverse()
  const labels = reversedHistory.map(() => '')

  const fpsChartData = {
    labels,
    datasets: [
      {
        data: reversedHistory.map((h) => h.data.fps),
        borderColor: statusColor,
        borderWidth: 2,
        tension: 0.4
      }
    ]
  }

  const renderChartData = {
    labels,
    datasets: [
      {
        data: reversedHistory.map((h) => formatMs(h.data.r_avg)),
        borderColor: '#8884d8',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  }

  return (
    <Card
      sx={{
        background: 'rgba(30, 30, 40, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        borderRadius: 2,
        p: 2,
        minWidth: 400,
        transition: 'box-shadow 0.3s ease-in-out',
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 4px 1px ${statusColor}`,
        '&:hover': {
          boxShadow: `0 8px 40px 0 rgba(0, 0, 0, 0.5), 0 0 6px 2px ${statusColor}`
        }
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* FPS Section */}
        <Grid container size={{ xs: 6 }} alignItems="center">
          <Grid size={{ xs: 6 }}>
            <Box display="flex" alignItems="center" color="rgba(255, 255, 255, 0.8)">
              <SpeedIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="body2">FPS</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
              {data.fps}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ height: 40 }}>
            {/* Using react-chartjs-2 Line component */}
            <Line options={sparklineOptions} data={fpsChartData} />
          </Grid>
        </Grid>

        {/* Render Time Section */}
        <Grid container size={{ xs: 6 }} alignItems="center">
          <Grid size={{ xs: 6 }}>
            <Box display="flex" alignItems="center" color="rgba(255, 255, 255, 0.8)">
              <TimerIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="body2">Render Avg</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
              {formatMs(data.r_avg).toFixed(2)}
              <span style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>ms</span>
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ height: 40 }}>
            <Line options={sparklineOptions} data={renderChartData} />
          </Grid>
        </Grid>

        {/* Lower Info Bar */}
        <Grid size={{ xs: 12 }} container spacing={1} mt={1} color="rgba(255, 255, 255, 0.9)">
          {data.phy && (
            <Grid size={{ xs: 3 }} display="flex" alignItems="center" justifyContent="flex-start">
              <BladeIcon name="wled" sx={{ mr: 1, fontSize: '0.9rem !important' }} />
              <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
                fps: {data.phy.fps}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 2 }} display="flex" alignItems="center" justifyContent="center">
            <BoltIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {formatMs(data.cycle).toFixed(2)}
              ms
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }} display="flex" alignItems="center" justifyContent="center">
            <WorkHistoryIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {workload.toFixed(4)}%
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
              min: {formatMs(data.r_min).toFixed(2)}
              ms
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
              max: {formatMs(data.r_max).toFixed(2)}
              ms
            </Typography>
          </Grid>
          {/* <Grid size={{ xs: 4 }} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
              {timestamp.toLocaleTimeString()}
            </Typography>
          </Grid> */}
        </Grid>
      </Grid>
    </Card>
  )
}
