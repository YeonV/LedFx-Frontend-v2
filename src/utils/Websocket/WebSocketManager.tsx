import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { useWebSocket, useSubscription } from './WebSocketProvider'

export const WebSocketManager = () => {
  const { send, isConnected } = useWebSocket()
  const clientIdentity = useStore((state) => state.clientIdentity)
  const virtuals = useStore((state) => state.virtuals)
  const pixelGraphs = useStore((state) => state.pixelGraphs)
  const getClients = useStore((state) => state.getClients)

  const hasSentInitialInfo = useRef(false)
  // Store the properties we actually sync to avoid reference-related loops
  const lastSyncRef = useRef({
    name: clientIdentity?.name,
    type: clientIdentity?.type
  })

  // Handle clients_updated event
  useSubscription('clients_updated', () => {
    getClients()
  })

  // Handle client_broadcast event
  useSubscription('client_broadcast', (data) => {
    // Dispatch custom event for components to handle broadcasts
    // console.log('YZ2', data)
    const event = new CustomEvent('ledfx:client_broadcast', { detail: data })
    window.dispatchEvent(event)
  })

  // Sync client info with backend
  useEffect(() => {
    if (!isConnected) {
      hasSentInitialInfo.current = false
      return
    }

    if (isConnected && clientIdentity) {
      const { name, type, deviceId } = clientIdentity

      if (!hasSentInitialInfo.current) {
        // Initial metadata registration
        console.log('WSM: set_client_info', name, type)
        send({
          id: 10001,
          type: 'set_client_info',
          data: {
            device_id: deviceId,
            name,
            type
          }
        })
        hasSentInitialInfo.current = true
        lastSyncRef.current = { name, type }
      } else if (name !== lastSyncRef.current.name || type !== lastSyncRef.current.type) {
        // Update metadata when identity changes in store
        console.log('WSM: update_client_info', name, type)
        send({
          id: 10002,
          type: 'update_client_info',
          data: {
            name,
            type
          }
        })
        lastSyncRef.current = { name, type }
      }
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
