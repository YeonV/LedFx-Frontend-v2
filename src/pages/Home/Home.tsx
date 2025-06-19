import { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import useStore from '../../store/useStore'
import Dashboard from './Dashboard'
import DashboardDetailed from './DashboardDetailed'
import IntroDialog from '../../components/Dialogs/IntroDialog'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Home() {
  const scanForDevices = useStore((state) => state.scanForDevices)
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)

  const [scanning, setScanning] = useState(-1)
  const [lastFound, setLastFound] = useState<string[]>([])
  const features = useStore((state) => state.features)
  const intro = useStore((state) => state.intro)

  const { enqueueSnackbar } = useSnackbar()

  const handleScan = () => {
    setScanning(0)
    scanForDevices()
      .then(async () => {
        for (let sec = 1; sec <= 30; sec++) {
          await sleep(1000).then(() => {
            getDevices()
            getVirtuals()
            setScanning(Math.round((100 / 30) * sec))
          })
        }
      })
      .then(() => {
        setScanning(-1)
      })
  }

  const handleDeviceCreated = useCallback(
    (eventData: any) => {
      if (eventData.id === 'device_created') {
        if (!lastFound.includes(eventData.device_name)) {
          enqueueSnackbar(`New Device added: ${eventData.device_name}`, {
            variant: 'info'
          })
          setLastFound((prev) => [...prev, eventData.device_name])
          getDevices()
        }
      }
    },
    [lastFound, enqueueSnackbar, getDevices]
  )

  useSubscription('device_created', handleDeviceCreated)

  return !intro ? (
    features.dashboardDetailed ? (
      <DashboardDetailed />
    ) : (
      <Dashboard />
    )
  ) : (
    <IntroDialog scanning={scanning} handleScan={handleScan} setScanning={setScanning} />
  )
}
