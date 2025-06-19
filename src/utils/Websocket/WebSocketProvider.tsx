import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react'
import Sockette from 'sockette'
import isElectron from 'is-electron'
import useStore from '../../store/useStore'
import { initialSubscriptions, handlerConfig } from './websocket.config'

interface WebSocketApi {
  send: (data: any) => void
  subscribe: (eventName: string, callback: (data: any) => void) => () => void
  isConnected: boolean
  getSocket: () => Sockette | null
  errorState: string | null // NEW: To hold error states like 'mixedContent'
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
  const subscribers = useRef(new Map<string, Set<(data: any) => void>>())

  const send = useCallback((data: any) => {
    ws.current?.send(JSON.stringify(data))
  }, [])

  const getSocket = useCallback(() => ws.current, [])

  const subscribe = useCallback((eventName: string, callback: (data: any) => void) => {
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
    const host =
      window.localStorage.getItem('ledfx-host') ||
      (isElectron()
        ? 'http://localhost:8888'
        : window.location.href.split('/#')[0].replace(/\/+$/, ''))
    const wsUrl = host.replace('https://', 'wss://').replace('http://', 'ws://') + '/api/websocket'

    // This logic now sets the error state instead of returning a string.
    if (window.location.protocol === 'https:' && wsUrl.startsWith('ws://')) {
      console.error('Mixed Content Error Detected: Attempting to connect to ws:// from https://.')
      setErrorState('mixedContent')
      // We stop here. We don't even try to connect.
      return
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
        initialSubscriptions.forEach((sub) => {
          send({ ...sub, type: 'subscribe_event' })
        })
      },
      onmessage: (event) => {
        const data = JSON.parse(event.data)
        const eventType = data?.event_type
        if (!eventType) return

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
        setErrorState('connectionError') // A generic error state
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

export const useSubscription = (eventName: string, callback: (data: any) => void) => {
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
