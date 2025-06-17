// DiagWidget.tsx

import { Card, CardContent, CardHeader, Typography, Grid, Box } from '@mui/material'

// We can reuse the same type definitions
interface DiagPacket {
  id: number
  type: string
  event_type: 'virtual_diag'
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

interface DiagWidgetProps {
  latestMessage: DiagMessage
}

// Helper function to determine the status color based on performance metrics
const getStatusColor = (packet: DiagPacket): 'success.main' | 'warning.main' | 'error.main' => {
  if (packet.fps < 30) {
    return 'error.main' // Critical FPS drop
  }
  if (packet.fps < 55 || packet.r_max > 0.005) {
    // 5ms max render time threshold
    return 'warning.main' // Warning for lower FPS or render spikes
  }
  return 'success.main' // Healthy
}

const formatMs = (seconds: number) => (seconds * 1000).toFixed(2)

export const DiagWidget = ({ latestMessage }: DiagWidgetProps) => {
  const { data, timestamp } = latestMessage

  // Calculate derived values
  const workload = data.cycle > 0 ? ((data.cycle - data.sleep) / data.cycle) * 100 : 0
  const statusColor = getStatusColor(data)

  return (
    <Card sx={{ minWidth: 340, flexGrow: 1 }}>
      <CardHeader
        avatar={
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: statusColor,
              alignSelf: 'center'
            }}
          />
        }
        title={data.virtual_id}
        subheader={`Last updated: ${timestamp.toLocaleTimeString()}`}
        titleTypographyProps={{ fontWeight: 'bold' }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={2} textAlign="center">
          {/* FPS */}
          <Grid size={{ xs: 4 }}>
            <Typography variant="caption" color="text.secondary">
              FPS
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {data.fps}
            </Typography>
          </Grid>

          {/* Cycle Time */}
          <Grid size={{ xs: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Cycle Time
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatMs(data.cycle)}
              <span style={{ fontSize: '0.8rem' }}>ms</span>
            </Typography>
          </Grid>

          {/* Workload */}
          <Grid size={{ xs: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Workload
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {workload.toFixed(1)}
              <span style={{ fontSize: '0.8rem' }}>%</span>
            </Typography>
          </Grid>

          {/* Render Times */}
          <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Render Time (min / avg / max)
            </Typography>
            <Typography variant="body1">
              {formatMs(data.r_min)} / <strong>{formatMs(data.r_avg)}</strong> /{' '}
              {formatMs(data.r_max)} ms
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
