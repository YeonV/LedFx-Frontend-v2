import { useEffect, useLayoutEffect } from 'react'
import useStore from '../../store/useStore'
import { useWebSocket } from './WebSocketProvider'

export const WebSocketManager = () => {
  const { send, isConnected } = useWebSocket()
  const { virtuals, pixelGraphs, setPixelGraphs, graphs, graphsMulti, showComplex, showGaps } =
    useStore()

  useLayoutEffect(() => {
    if (!graphs || !graphsMulti) {
      setPixelGraphs([])
    } else {
      setPixelGraphs(
        Object.keys(virtuals)
          .filter((v) =>
            showComplex
              ? v
              : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
          )
          .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
      )
    }
  }, [graphs, graphsMulti, virtuals, setPixelGraphs, showComplex, showGaps])

  useEffect(() => {
    if (isConnected && pixelGraphs.length > 0) {
      pixelGraphs.forEach((d, i) => {
        const request = {
          event_filter: { vis_id: d, is_device: !!virtuals[d]?.is_device },
          event_type: 'visualisation_update',
          id: i,
          type: 'subscribe_event'
        }
        send(request)
      })

      return () => {
        pixelGraphs.forEach((d, i) => {
          const request = {
            id: i,
            type: 'unsubscribe_event',
            event_type: 'visualisation_update'
          }
          send(request)
        })
      }
    }
  }, [isConnected, pixelGraphs, send, virtuals])

  return null
}
