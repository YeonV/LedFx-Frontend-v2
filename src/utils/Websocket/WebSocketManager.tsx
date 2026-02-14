import { useEffect } from 'react'
import useStore from '../../store/useStore'
import { useWebSocket, useSubscription } from './WebSocketProvider'

export const WebSocketManager = () => {
  const { send, isConnected } = useWebSocket()
  const { virtuals, pixelGraphs, clientIdentity, getClients } = useStore()

  // Handle clients_updated event
  useSubscription('clients_updated', () => {
    getClients()
  })

  // Handle client_broadcast event
  useSubscription('client_broadcast', (data) => {
    // Dispatch custom event for components to handle broadcasts
    const event = new CustomEvent('ledfx:client_broadcast', { detail: data })
    window.dispatchEvent(event)
  })

  // Send client info on connection
  useEffect(() => {
    if (isConnected && clientIdentity) {
      send({
        id: 9999,
        type: 'set_client_info',
        device_id: clientIdentity.deviceId,
        name: clientIdentity.name,
        client_type: clientIdentity.type
      })
    }
  }, [isConnected, send, clientIdentity])

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
