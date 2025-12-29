import { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import useStore from '../../store/useStore'
import { BeautifulDiagWidget } from './BeautifulDiagWidget'
import { useSubscription, useWebSocket } from '../../utils/Websocket/WebSocketProvider'

interface DiagPacket {
  id: number
  type: string
  event_type: 'virtual_diag'
  virtual_id: string
  r_avg: number
  r_min: number
  r_max: number
  cycle: number
  sleep: number
  fps: number
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
const MAX_HISTORY = 50

const VirtualDiag = () => {
  const { virtId } = useParams()
  const diag = useStore((state) => state.virtuals[virtId || '']?.effect?.config?.diag || false)

  const [dataHistory, setDataHistory] = useState<DiagMessage[]>([])
  const { send, isConnected } = useWebSocket()

  const handleDiagPacket = useCallback(
    (eventData: { data: DiagPacket }) => {
      if (eventData.data.virtual_id !== virtId) {
        return
      }
      const newMessage = { data: eventData.data, timestamp: new Date() }
      setDataHistory((prev) => [newMessage, ...prev.slice(0, MAX_HISTORY - 1)])
    },
    [virtId]
  )

  useSubscription('virtual_diag', handleDiagPacket)

  useEffect(() => {
    if (diag && isConnected) {
      const subscribeRequest = {
        event_type: 'virtual_diag',
        id: 9998,
        type: 'subscribe_event'
      }
      send(subscribeRequest)

      return () => {
        const unsubscribeRequest = {
          event_type: 'virtual_diag',
          id: 9998,
          type: 'unsubscribe_event'
        }
        send(unsubscribeRequest)
      }
    }
  }, [diag, isConnected, send])

  useEffect(() => {
    // Clear history when disconnected or diag is off
    if (!diag || !isConnected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDataHistory([])
    }
  }, [diag, isConnected])

  const latestData = dataHistory[0]

  return (
    <>
      {diag && (
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
          {latestData && (
            <BeautifulDiagWidget key={virtId} latestMessage={latestData} history={dataHistory} />
          )}
        </Box>
      )}
    </>
  )
}

export default VirtualDiag
