// BeautifulDiagWidget.tsx

import { Card, Typography, Grid, Box } from '@mui/material'

// --- Icon Imports ---
import SpeedIcon from '@mui/icons-material/Speed'
import TimerIcon from '@mui/icons-material/Timer'
import BoltIcon from '@mui/icons-material/Bolt'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import { Line } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// } from 'chart.js'
// --- Type definitions ---
interface DiagPacket {
  virtual_id: string
  fps: number
  r_avg: number
  r_min: number
  r_max: number
  cycle: number
  sleep: number
}

interface DiagMessage {
  data: DiagPacket
  timestamp: Date
}

interface BeautifulDiagWidgetProps {
  latestMessage: DiagMessage
  history: DiagMessage[] // We now need history for the sparklines
}

const getStatusColor = (packet: DiagPacket): string => {
  if (packet.fps < 30) return '#f44336' // Red
  if (packet.fps < 55 || packet.r_max > 0.005) return '#ff9800' // Orange
  return '#4caf50' // Green
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
      radius: 0 // Hide the points on the line
    }
  },
  animation: {
    duration: 0 // Disable animations for sparklines
  }
}

export const BeautifulDiagWidget = ({ latestMessage, history }: BeautifulDiagWidgetProps) => {
  const { data, timestamp } = latestMessage
  const statusColor = getStatusColor(data)
  const workload = data.cycle > 0 ? ((data.cycle - data.sleep) / data.cycle) * 100 : 0

  // 2. Prepare data in the format Chart.js expects
  const reversedHistory = [...history].reverse() // Chart flows left-to-right (oldest to newest)
  const labels = reversedHistory.map(() => '') // Empty labels for a clean look

  const fpsChartData = {
    labels,
    datasets: [
      {
        data: reversedHistory.map((h) => h.data.fps),
        borderColor: statusColor,
        borderWidth: 2,
        tension: 0.4 // Makes the line smooth
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
        // --- The Glassmorphism Effect ---
        background: 'rgba(30, 30, 40, 0.6)',
        // backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        // --- End Effect ---
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {data.virtual_id}
        </Typography>
        <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
          {timestamp.toLocaleTimeString()}
        </Typography>
      </Box>

      {/* FPS Section */}
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
            {/* Using react-chartjs-2 Line component */}
            <Line options={sparklineOptions} data={renderChartData} />
          </Grid>
        </Grid>

        {/* Lower Info Bar */}
        <Grid size={{ xs: 12 }} container spacing={1} mt={1} color="rgba(255, 255, 255, 0.9)">
          <Grid size={{ xs: 4 }} display="flex" alignItems="center" justifyContent="center">
            <BoltIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {formatMs(data.cycle).toFixed(1)}
              ms
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }} display="flex" alignItems="center" justifyContent="center">
            <WorkHistoryIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {workload}%
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
              max: {formatMs(data.r_max).toFixed(1)}
              ms
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}
