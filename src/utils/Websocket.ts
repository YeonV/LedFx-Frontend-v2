/* eslint-disable array-callback-return */

import React, { useEffect, useLayoutEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import Sockette from 'sockette'
import isElectron from 'is-electron'
import useStore from '../store/useStore'

interface WebSockette extends Sockette {
  ws: WebSocket
}

// const ws = new WebSocket(`${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.localStorage.getItem('ledfx-host')?.split('https://')[0].split('http://')[0] || 'localhost:8888'}/api/websocket`);
// const ws = new WebSocket(`${(window.localStorage.getItem('ledfx-host') && window.localStorage.getItem('ledfx-host').startsWith('https')) ? 'wss' : 'ws'}://${window.localStorage.getItem('ledfx-host')?.split('https://')[0].split('http://')[0] || 'localhost:8888'}/api/websocket`);
// const ws = new WebSocket(`wss://${window.localStorage.getItem('ledfx-host')?.split('https://')[0].split('http://')[0].split(':')[0] || 'localhost:8888'}/api/websocket`);
// const ws = new WebSocket(`${window.localStorage.getItem('ledfx-ws') ? window.localStorage.getItem('ledfx-ws') : 'ws://localhost:8888'}/api/websocket`, (window.localStorage.getItem('ledfx-ws') && window.localStorage.getItem('ledfx-ws').startsWith('wss')) ? 'https' : 'http');
// const ws = new WebSocket(`wss://127.0.0.1/api/websocket`, 'wss');

function createSocket() {
  const _ws = new Sockette(
    `${(
      window.localStorage.getItem('ledfx-host') ||
      (isElectron()
        ? 'http://localhost:8888'
        : window.location.href.split('/#')[0].replace(/\/+$/, ''))
    )
      .replace('https://', 'wss://')
      .replace('http://', 'ws://')}/api/websocket`,
    {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e) => {
        // console.log('Connected!', e)
        document.dispatchEvent(
          new CustomEvent('disconnected', {
            detail: {
              isDisconnected: false
            }
          })
        )
        ws.ws = e.target as WebSocket
        const req = {
          event_type: 'devices_updated',
          id: 1,
          type: 'subscribe_event'
        }
        ws.send(JSON.stringify(++req.id && req))
        const requ = {
          event_type: 'device_created',
          id: 1,
          type: 'subscribe_event'
        }
        ws.send(JSON.stringify(++requ.id && requ))
        const reque = {
          event_type: 'graph_update',
          id: 1,
          type: 'subscribe_event'
        }
        ws.send(JSON.stringify(++reque.id && reque))
        const reqs = {
          event_type: 'scene_activated',
          id: 1,
          type: 'subscribe_event'
        }
        ws.send(JSON.stringify(++reqs.id && reqs))
        const reqst = {
          event_type: 'effect_set',
          id: 1,
          type: 'subscribe_event'
        }
        ws.send(JSON.stringify(++reqst.id && reqst))
      },
      onmessage: (event) => {
        if (JSON.parse(event.data).event_type === 'visualisation_update') {
          document.dispatchEvent(
            new CustomEvent('visualisation_update', {
              detail: {
                id: JSON.parse(event.data).vis_id,
                pixels: JSON.parse(event.data).pixels,
                shape: JSON.parse(event.data).shape
              }
            })
          )
        }
        if (JSON.parse(event.data).event_type === 'devices_updated') {
          document.dispatchEvent(
            new CustomEvent('devices_updated', {
              detail: 'devices_updated'
            })
          )
        }
        if (JSON.parse(event.data).event_type === 'device_created') {
          document.dispatchEvent(
            new CustomEvent('device_created', {
              detail: {
                id: 'device_created',
                device_name: JSON.parse(event.data).device_name
              }
            })
          )
        }
        if (JSON.parse(event.data).event_type === 'graph_update') {
          document.dispatchEvent(
            new CustomEvent('graph_update', {
              detail: JSON.parse(event.data)
            })
          )
        }
        if (JSON.parse(event.data).event_type === 'effect_set') {
          document.dispatchEvent(
            new CustomEvent('effect_set', {
              detail: JSON.parse(event.data)
            })
          )
        }
        if (JSON.parse(event.data).event_type === 'scene_activated') {
          // console.log('scene_activated', JSON.parse(event.data))
          document.dispatchEvent(
            new CustomEvent('scene_activated', {
              detail: {
                id: 'scene_activated',
                scene_id: JSON.parse(event.data).scene_id
              }
            })
          )
        }
      },
      // onreconnect: e => console.log('Reconnecting...', e),
      // onmaximum: e => console.log('Stop Attempting!', e),
      onclose: () => {
        // console.log('Closed!', e)
        window.localStorage.removeItem('core-init')
        document.dispatchEvent(
          new CustomEvent('disconnected', {
            detail: {
              isDisconnected: true
            }
          })
        )
      }
      // onerror: e => console.log('Error:', e)
    }
  ) as WebSockette
  return _ws
}
const ws = createSocket()
export default ws
export const WsContext = React.createContext(ws)

export const HandleWs = () => {
  const { pathname } = useLocation()
  const virtuals = useStore((state) => state.virtuals)
  const pixelGraphs = useStore((state) => state.pixelGraphs)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const [wsReady, setWsReady] = useState(false)

  useLayoutEffect(() => {
    if (!(pathname.startsWith('/Devices') || pathname.startsWith('/device'))) {
      setPixelGraphs([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useLayoutEffect(() => {
    if (!graphs || !graphsMulti) {
      setPixelGraphs([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphs, graphsMulti])

  useEffect(() => {
    if (pixelGraphs.length > 0 && wsReady) {
      pixelGraphs.map((d, i) => {
        const getWs = async () => {
          const request = {
            event_filter: {
              vis_id: d,
              is_device: !!virtuals[d]?.is_device
            },
            event_type: 'visualisation_update',
            id: i,
            type: 'subscribe_event'
          }
          // console.log("Send");
          ws.send(JSON.stringify(++request.id && request))
        }
        getWs()
      })

      return () => {
        pixelGraphs.map((d, i) => {
          const removeGetWs = async () => {
            const request = {
              id: i,
              type: 'unsubscribe_event',
              event_type: 'visualisation_update'
            }
            ws.send(JSON.stringify(++request.id && request))
          }
          // console.log("Clean Up");
          removeGetWs()
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsReady, pixelGraphs])

  useEffect(() => {
    const interval = setInterval(() => {
      if (ws.ws && ws.ws.readyState === WebSocket.OPEN) {
        setWsReady(true)
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return null
}
