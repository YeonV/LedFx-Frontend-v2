import { useEffect, useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Slider,
  Stack,
  Switch,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material'
import BladeFrame from './SchemaForm/components/BladeFrame'
import { Tune } from '@mui/icons-material'
import { useWebSocket, useSubscription } from '../utils/Websocket/WebSocketProvider'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartState {
  chartData: any
  chartOptions: any
}

const MGraph = () => {
  const [showSettings, setShowSettings] = useState(false)
  const theme = useTheme()
  const isAndroid = process.env.REACT_APP_LEDFX_ANDROID === 'true'
  const smallScreen = useMediaQuery('(max-width:768px)')

  const [scaleType, setScaleType] = useState(false)
  const [animationDuration, setAnimationDuration] = useState<number>(10)
  const [fillOpacity, setFillOpacity] = useState<number>(0)
  const [lineTension, setLineTension] = useState<number>(0.5)

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAnimationDuration(typeof newValue === 'number' ? newValue : newValue[0])
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationDuration(event.target.value === '' ? 0 : Number(event.target.value))
  }
  const handleFillOpacitySliderChange = (event: Event, newValue: number | number[]) => {
    setFillOpacity(typeof newValue === 'number' ? newValue : newValue[0])
  }
  const handleFillOpacityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFillOpacity(event.target.value === '' ? 0 : Number(event.target.value))
  }
  const handleLineTensionSliderChange = (event: Event, newValue: number | number[]) => {
    setLineTension(typeof newValue === 'number' ? newValue : newValue[0])
  }
  const handleLineTensionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLineTension(event.target.value === '' ? 0 : Number(event.target.value))
  }

  const [chartStates, setChartStates] = useState<{ [id: string]: ChartState }>({})
  const { send } = useWebSocket()

  useEffect(() => {
    const subscribeRequest = { event_type: 'graph_update', id: 9000, type: 'subscribe_event' }
    send(subscribeRequest)
    return () => {
      const unsubscribeRequest = { event_type: 'graph_update', id: 9000, type: 'unsubscribe_event' }
      send(unsubscribeRequest)
    }
  }, [send])

  const baseChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: true,
      hover: { animationDuration: 0 },
      animation: { duration: animationDuration },
      scales: {
        x: {
          display: true,
          title: { display: true, text: 'Frequency' },
          ticks: { maxTicksLimit: 12 },
          grid: { color: 'rgba(255, 255, 255, 0)' },
          ...(scaleType && { type: 'logarithmic' })
        },
        y: {
          title: { display: true },
          ticks: { display: false },
          min: 0,
          max: 2.0
        }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
  }, [animationDuration, scaleType])

  useSubscription('graph_update', (messageData: any) => {
    if (!messageData?.graph_id) return

    const chartData = {
      labels: messageData.frequencies,
      datasets: [
        {
          label: '',
          lineTension,
          backgroundColor: `${theme.palette.primary.main}${Math.round((fillOpacity / 100) * 255)
            .toString(16)
            .padStart(2, '0')}`,
          fill: true,
          borderColor: theme.palette.primary.main,
          pointRadius: 0,
          data: messageData.melbank
        }
      ]
    }

    const chartOptions = {
      ...baseChartOptions,
      scales: {
        ...baseChartOptions.scales,
        x: {
          ...baseChartOptions.scales.x,
          ticks: {
            ...baseChartOptions.scales.x.ticks,
            callback: (_value: any, index: number) => `${messageData.frequencies[index]} Hz`
          }
        },
        y: {
          ...baseChartOptions.scales.y,
          title: {
            ...baseChartOptions.scales.y.title,
            text: 'Melbank ' + messageData.graph_id.split('_')[1]
          }
        }
      }
    }

    setChartStates((prev) => ({
      ...prev,
      [messageData.graph_id]: { chartData, chartOptions }
    }))
  })

  return (
    <Stack alignItems={'center'} sx={{ position: 'relative', width: '100%' }}>
      <Fab
        color="primary"
        sx={{ position: 'absolute', top: '24px' }}
        onClick={() => setShowSettings(!showSettings)}
      >
        <Tune />
      </Fab>
      <Card
        style={{
          display: !showSettings ? 'none' : '',
          maxWidth: 720,
          width: '100%',
          margin: isAndroid || smallScreen ? 0 : '3rem',
          background: theme.palette.background.paper
        }}
      >
        <CardHeader title="Melbank Graph Settings" />
        <CardContent>
          <BladeFrame
            title="Animation Duration"
            style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}
          >
            <Slider
              value={animationDuration}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
            />
            <TextField
              slotProps={{ input: { endAdornment: 'ms' } }}
              type="number"
              value={animationDuration}
              onChange={handleInputChange}
              style={{
                marginLeft: '2rem',
                width: '130px',
                backgroundColor: theme.palette.background.paper
              }}
            />
          </BladeFrame>
          <BladeFrame
            title="Fill Opacity"
            style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}
          >
            <Slider
              value={fillOpacity}
              onChange={handleFillOpacitySliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <TextField
              slotProps={{ input: { endAdornment: '%' } }}
              type="number"
              value={fillOpacity}
              onChange={handleFillOpacityInputChange}
              style={{
                marginLeft: '2rem',
                width: '130px',
                backgroundColor: theme.palette.background.paper
              }}
            />
          </BladeFrame>
          <BladeFrame title="LineTension" style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <Slider
              value={lineTension}
              onChange={handleLineTensionSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
            <TextField
              slotProps={{ input: { endAdornment: '' } }}
              type="number"
              value={lineTension}
              onChange={handleLineTensionInputChange}
              style={{
                marginLeft: '2rem',
                width: '130px',
                backgroundColor: theme.palette.background.paper
              }}
            />
          </BladeFrame>
          <BladeFrame title="Logarithmic" style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <Switch checked={scaleType} onChange={() => setScaleType(!scaleType)} />
          </BladeFrame>
        </CardContent>
      </Card>
      <Grid container spacing={2} justifyContent={'center'} sx={{ width: '100%' }}>
        {Object.entries(chartStates)
          .sort(([idA], [idB]) => idA.localeCompare(idB))
          .map(([graphId, state]) =>
            state.chartData?.labels ? (
              <div
                key={graphId}
                style={{
                  maxWidth: 700,
                  width: '100%',
                  height: 350,
                  margin: smallScreen || isAndroid ? '0' : '3rem',
                  marginTop: '5rem'
                }}
              >
                <Line data={state.chartData} options={state.chartOptions} />
              </div>
            ) : null
          )}
      </Grid>
    </Stack>
  )
}
export default MGraph
