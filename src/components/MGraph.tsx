import { useEffect, useState } from 'react'
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
  useTheme
} from '@mui/material'
import BladeFrame from './SchemaForm/components/BladeFrame'
import { Tune } from '@mui/icons-material'
import ws from '../utils/Websocket'

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

const MGraph = () => {
  // const [data, setData] = useState({} as any)
  const [data1, setData1] = useState({} as any)
  const [data2, setData2] = useState({} as any)
  const [data3, setData3] = useState({} as any)
  const [showSettings, setShowSettings] = useState(false)
  const theme = useTheme()

  const [scaleType, setScaleType] = useState(false)

  const [animationDuration, setAnimationDuration] = useState<number>(10)
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAnimationDuration(typeof newValue === 'number' ? newValue : newValue[0])
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationDuration(
      event.target.value === '' ? 0 : Number(event.target.value)
    )
  }

  const [fillOpacity, setFillOpacity] = useState<number>(0)
  const handleFillOpacitySliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setFillOpacity(typeof newValue === 'number' ? newValue : newValue[0])
  }
  const handleFillOpacityInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFillOpacity(event.target.value === '' ? 0 : Number(event.target.value))
  }

  const [lineTension, setLineTension] = useState<number>(0.5)
  const handleLineTensionSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setLineTension(typeof newValue === 'number' ? newValue : newValue[0])
  }
  const handleLineTensionInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLineTension(event.target.value === '' ? 0 : Number(event.target.value))
  }

  interface MessageData {
    frequencies: any[]
    melbank: [number[], number[], number[]]
    graph_id?: string
  }

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      const messageData = e.detail as MessageData
      const chartData = {
        labels: messageData.frequencies,
        datasets: [
          {
            label: '',
            id: 1,
            lineTension,
            backgroundColor: `${theme.palette.primary.main}${fillOpacity.toString(16)}`,
            fill: true,
            borderColor: theme.palette.primary.main,
            pointRadius: 0,
            data: messageData.melbank
          }
        ]
      }

      // Adjust the axes based on the max
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: { enabled: false },
        hover: {
          animationDuration: 0,
          mode: null
        },
        animation: {
          duration: animationDuration
        },
        responsiveAnimationDuration: 0,
        scales: {
          xAxis: {
            display: false,
            maxTicksLimit: 3
          },
          x: {
            display: true,
            title: {
              display: true,
              text: 'Frequency'
            },
            ticks: {
              borderColor: '#fff',
              maxTicksLimit: 12,
              callback: (value: any, _index: number) => {
                // console.log('frequencies', messageData.frequencies)
                const frequency = messageData.frequencies[_index]
                return `${JSON.stringify(frequency)} Hz`
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0)'
            },
            ...(scaleType && { type: 'logarithmic' })
          },
          yAxis: {
            min: 0,
            max: 2.0
          },
          y: {
            title: {
              display: true,
              text: 'Melbank ' + messageData.graph_id?.split('_')[1]
            },
            ticks: {
              display: false,
              maxTicksLimit: 7,
              callback(value: any, _index: any, _values: any) {
                return `${parseFloat(value).toFixed(2)}`
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
      // setData({ chartData, chartOptions })
      switch (messageData.graph_id) {
        case 'melbank_0':
          setData1({ chartData, chartOptions })
          break
        case 'melbank_1':
          setData2({ chartData, chartOptions })
          break
        case 'melbank_2':
          setData3({ chartData, chartOptions })
          break
        default:
          break
      }
    }
    document.addEventListener('graph_update', handleWebsockets)
    return () => {
      document.removeEventListener('graph_update', handleWebsockets)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationDuration, fillOpacity, scaleType])

  useEffect(() => {
    const handleWebsockets = () => {
      const req = {
        event_type: 'graph_update',
        id: 9000,
        type: 'subscribe_event'
      }
      console.log('Send')
      ws.send(JSON.stringify(req.id && req))
    }
    setTimeout(() => {
      handleWebsockets()
    }, 500)

    document.addEventListener('subs_graph_update', handleWebsockets)

    return () => {
      const removeGetWs = async () => {
        const request = {
          id: 9000,
          type: 'unsubscribe_event',
          event_type: 'graph_update'
        }
        ws.send(JSON.stringify(request.id && request))
      }
      console.log('Clean Up')
      removeGetWs()
      document.removeEventListener('subs_graph_update', handleWebsockets)
    }
  }, [])

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
          margin: '3rem',
          // background: theme.palette.mode === 'dark' ? '#1c1c1e' : ''
          background: theme.palette.background.paper
          // border: theme.palette.background.paper === '#000000' ? '1px solid #333' : ''
        }}
      >
        <CardHeader title="Melbank Graph Settings" />
        <CardContent>
          <BladeFrame
            title="Animation Duration"
            style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}
          >
            <Slider
              value={
                typeof animationDuration === 'number' ? animationDuration : 0
              }
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
            />
            <TextField
              slotProps={{
                input: {
                  endAdornment: 'ms'
                }
              }}
              type="number"
              value={
                typeof animationDuration === 'number' ? animationDuration : 0
              }
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
              value={typeof fillOpacity === 'number' ? fillOpacity : 0}
              onChange={handleFillOpacitySliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <TextField
              slotProps={{
                input: {
                  endAdornment: '%'
                }
              }}
              type="number"
              value={typeof fillOpacity === 'number' ? fillOpacity : 0}
              onChange={handleFillOpacityInputChange}
              style={{
                marginLeft: '2rem',
                width: '130px',
                backgroundColor: theme.palette.background.paper
              }}
            />
          </BladeFrame>

          <BladeFrame
            title="LineTension"
            style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}
          >
            <Slider
              value={typeof lineTension === 'number' ? lineTension : 0}
              onChange={handleLineTensionSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
            <TextField
              slotProps={{
                input: {
                  endAdornment: ''
                }
              }}
              type="number"
              value={typeof lineTension === 'number' ? lineTension : 0}
              onChange={handleLineTensionInputChange}
              style={{
                marginLeft: '2rem',
                width: '130px',
                backgroundColor: theme.palette.background.paper
              }}
            />
          </BladeFrame>

          <BladeFrame
            title="Logarithmic"
            style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}
          >
            <Switch
              value={scaleType}
              onChange={() => setScaleType(!scaleType)}
            />
          </BladeFrame>
        </CardContent>
      </Card>
      <Grid container spacing={2} justifyContent={'center'}>
        {data1?.chartData &&
          data1?.chartOptions &&
          data1?.chartData?.labels && (
            <div
              style={{
                maxWidth: 700,
                width: '100%',
                height: 350,
                margin: '3rem'
              }}
            >
              <Line data={data1.chartData} options={data1.chartOptions} />
            </div>
          )}
        {data2?.chartData &&
          data2?.chartOptions &&
          data2?.chartData?.labels && (
            <div
              style={{
                maxWidth: 700,
                width: '100%',
                height: 350,
                margin: '3rem'
              }}
            >
              <Line data={data2.chartData} options={data2.chartOptions} />
            </div>
          )}
        {data3?.chartData &&
          data3?.chartOptions &&
          data3?.chartData?.labels && (
            <div
              style={{
                maxWidth: 700,
                width: '100%',
                height: 350,
                margin: '3rem'
              }}
            >
              <Line data={data3.chartData} options={data3.chartOptions} />
            </div>
          )}
      </Grid>
    </Stack>
  )
}
export default MGraph
