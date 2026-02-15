import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react'
import Sockette from 'sockette'
import isElectron from 'is-electron'
import useStore from '../../store/useStore'
import { initialSubscriptions, handlerConfig } from './websocket.config'

export interface WebSocketApi {
  send: (_data: any) => void
  subscribe: (_eventName: string, _callback: (_data: any) => void) => () => void
  isConnected: boolean
  getSocket: () => Sockette | null
  errorState: string | null
}

const WebSocketContext = createContext<WebSocketApi>({
  send: () => console.error('WebSocketProvider not mounted'),
  subscribe: () => () => console.error('WebSocketProvider not mounted'),
  isConnected: false,
  getSocket: () => null,
  errorState: null
})

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<Sockette | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)
  const subscribers = useRef(new Map<string, Set<(_data: any) => void>>())

  const send = useCallback((data: any) => {
    ws.current?.send(JSON.stringify(data))
  }, [])

  const getSocket = useCallback(() => ws.current, [])

  const subscribe = useCallback((eventName: string, callback: (_data: any) => void) => {
    if (!subscribers.current.has(eventName)) {
      subscribers.current.set(eventName, new Set())
    }
    const eventSubscribers = subscribers.current.get(eventName)!
    eventSubscribers.add(callback)
    return () => {
      eventSubscribers.delete(callback)
    }
  }, [])

  useEffect(() => {
    const getDefaultHost = () => {
      if (isElectron()) {
        const sslEnabled = window.localStorage.getItem('ledfx-ssl-enabled') === 'true'
        return sslEnabled ? 'https://ledfx.local:8889' : 'http://localhost:8888'
      }
      return window.location.href.split('/#')[0].replace(/\/+$/, '')
    }

    const host = window.localStorage.getItem('ledfx-host') || getDefaultHost()
    const wsUrl = host.replace('https://', 'wss://').replace('http://', 'ws://') + '/api/websocket'

    // Check for mixed content - this will be caught in a separate effect if needed
    if (window.location.protocol === 'https:' && wsUrl.startsWith('ws://')) {
      console.error('Mixed Content Error Detected: Attempting to connect to ws:// from https://.')

      setErrorState('mixedContent')
    }

    const dispatchToSubscribers = (eventName: string, data: any) => {
      if (subscribers.current.has(eventName)) {
        subscribers.current.get(eventName)?.forEach((cb) => cb(data))
      }
    }

    ws.current = new Sockette(wsUrl, {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: () => {
        setIsConnected(true)
        setErrorState(null) // Clear any previous errors on a successful connection
        useStore.getState().setDisconnected(false)
        // Refresh schemas and colors on reconnect (backend may have restarted with new plugins/effects/colors)
        useStore.getState().getSchemas(true)
        useStore.getState().getColors()
        initialSubscriptions.forEach((sub) => {
          send({ ...sub, type: 'subscribe_event' })
        })
      },
      onmessage: (event) => {
        const data = JSON.parse(event.data)
        const eventType = data?.event_type
        if (!eventType) return

        // Capture client_id from server
        if (eventType === 'client_id' && data.client_id) {
          useStore.getState().setClientId(data.client_id)
        }

        // Sync client name/type from backend if updated (e.g., name conflict)
        if (eventType === 'client_info_updated' && data.client_id) {
          if (data.name) {
            useStore.getState().setClientName(data.name)
          }
          if (data.type) {
            useStore.getState().setClientType(data.type)
          }
          // Always update clientId in case it changed
          useStore.getState().setClientId(data.client_id)
        }

        // Handle colors_updated centrally to avoid duplicate calls from multiple component subscriptions
        if (eventType === 'colors_updated') {
          useStore.getState().getColors()
          // Don't dispatch to component subscribers - handled centrally
          return
        }

        const rule = handlerConfig[eventType as keyof typeof handlerConfig]
        let payload = data

        if (rule === true) {
          payload = data
        } else if (typeof rule === 'function') {
          payload = rule(data)
        } else if (rule !== undefined) {
          payload = rule
        }

        dispatchToSubscribers(eventType, payload)
      },
      onclose: () => {
        setIsConnected(false)
        useStore.getState().setDisconnected(true)
        window.localStorage.removeItem('core-init')
      },
      onerror: (e) => {
        console.error('WebSocket Error:', e)
        setErrorState('connectionError')
      }
    })

    return () => {
      ws.current?.close()
    }
  }, [send])

  const value = { send, subscribe, isConnected, getSocket, errorState }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export const useWebSocket = () => useContext(WebSocketContext)

export const useSubscription = (eventName: string, callback: (_data: any) => void) => {
  const { subscribe } = useWebSocket()
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    const handler = (data: any) => callbackRef.current(data)
    const unsubscribe = subscribe(eventName, handler)
    return unsubscribe
  }, [eventName, subscribe])
}
