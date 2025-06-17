// VirtualDiag.tsx

import { useEffect, useState } from 'react'
import ws from '../../utils/Websocket'
import { Box } from '@mui/material'
// import { DiagWidget } from './DiagWidget'
import { useParams } from 'react-router-dom'
import useStore from '../../store/useStore'
import { BeautifulDiagWidget } from './BeautifulDiagWidget'

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

const MAX_HISTORY = 50 //

const VirtualDiag = () => {
  const { virtId } = useParams()
  const virtuals = useStore((state) => state.virtuals)
  const diag = virtuals[virtId || '']?.effect?.config?.diag || false

  const [dataHistory, setDataHistory] = useState<DiagMessage[]>([])

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      const newPacket = e.detail.data as DiagPacket
      const newMessage = { data: newPacket, timestamp: new Date() }
      setDataHistory((prevHistory) => [newMessage, ...prevHistory].slice(0, MAX_HISTORY))
    }

    document.addEventListener('virtual_diag', handleWebsockets)
    return () => {
      document.removeEventListener('virtual_diag', handleWebsockets)
    }
  }, [])

  const latestData = dataHistory[0]

  useEffect(() => {
    if (diag) {
      const requestb = {
        event_type: 'virtual_diag',
        id: 9998,
        type: 'subscribe_event'
      }
      ;(ws as any).send(JSON.stringify(requestb))
    } else {
      setDataHistory([])
    }
  }, [diag])

  return (
    <>
      {/* {diag && (
        <Box sx={{ my: 2 }}>
          {latestData && <DiagWidget key={virtId} latestMessage={latestData} />}
        </Box>
      )} */}
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
