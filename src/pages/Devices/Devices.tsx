import { useEffect, useRef } from 'react'
import { Alert, Collapse, Stack, Typography } from '@mui/material'
import useStore from '../../store/useStore'
import DeviceCard from './DeviceCard/DeviceCard.wrapper'
import NoYet from '../../components/NoYet'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'
import { IVirtualEventUpdate } from '../../store/api/storeVirtuals'
import VisualizerCard from '../Settings/VisualizerCard'

const Devices = () => {
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const clients = useStore((state) => state.clients)
  const virtuals = useStore((state) => state.virtuals)
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const clientOrder = useStore((state) => state.clientOrder)
  const setClientOrder = useStore((state) => state.setClientOrder)
  const layout = useStore((state) => state.uiPersist.layout)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const features = useStore((state) => state.features)
  const graphs = useStore((state) => state.graphsMulti)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const newBlender = useStore((state) => state.newBlender)
  const setNewBlender = useStore((state) => state.setNewBlender)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const batchUpdateVirtuals = useStore((state) => state.batchUpdateVirtuals)
  // const fPixels = useStore((state) => state.config.visualisation_maxlen)
  const navigate = useNavigate()

  // Batch effect_set updates to avoid blocking the main thread
  const pendingUpdates = useRef<Array<IVirtualEventUpdate>>([])
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Flush pending updates (called by timer or scene_activated)
  const flushPendingUpdates = () => {
    if (pendingUpdates.current.length > 0) {
      const updates = pendingUpdates.current
      pendingUpdates.current = []
      batchUpdateVirtuals(updates)
    }
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
      flushTimerRef.current = null
    }
  }

  useEffect(() => {
    if (blenderAutomagic && newBlender !== '') {
      setNewBlender('')
      navigate(`/device/${newBlender}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newBlender, blenderAutomagic])

  useEffect(() => {
    getDevices()
    getVirtuals()
  }, [getDevices, getVirtuals])

  useEffect(() => {
    // initial device order if not set
    if (Object.keys(virtuals).length > 0) {
      const v = [...(virtualOrder || [])]
      let changed = false
      Object.keys(virtuals).forEach((s) => {
        const virtId = virtuals[s].id
        if (!v.some((o) => o.virtId === virtId)) {
          v.push({ virtId, order: v.length })
          changed = true
        }
      })
      if (changed) {
        setVirtualOrder(v)
      }
    }
  }, [virtuals, setVirtualOrder, virtualOrder])

  useEffect(() => {
    // initial client order if not set
    if (Object.keys(clients).length > 0) {
      const c = [...(clientOrder || [])]
      let changed = false
      Object.keys(clients).forEach((s) => {
        if (!c.some((o) => o.virtId === s)) {
          c.push({ virtId: s, order: c.length })
          changed = true
        }
      })
      if (changed) {
        setClientOrder(c)
      }
    }
  }, [clients, setClientOrder, clientOrder])

  useSubscription('devices_updated', getDevices)

  // Collect effect_set events with fallback timer
  useSubscription('effect_set', (data: IVirtualEventUpdate) => {
    pendingUpdates.current.push({
      virtual_id: data.virtual_id,
      effect_name: data.effect_name,
      effect_type: data.effect_type,
      active: data.active,
      streaming: data.streaming
    })

    // Clear existing timer
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
    }

    // Set fallback timer: flush after 250ms if no scene_activated event
    flushTimerRef.current = setTimeout(() => {
      flushPendingUpdates()
    }, 250)
  })

  // Apply batched updates immediately when scene activates
  useSubscription('scene_activated', () => {
    flushPendingUpdates()
  })

  // Cleanup: flush pending updates and clear timer on unmount
  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current)
      }
      if (pendingUpdates.current.length > 0) {
        batchUpdateVirtuals(pendingUpdates.current)
      }
    }
  }, [batchUpdateVirtuals])

  useEffect(() => {
    if (graphs && graphsMulti) {
      setPixelGraphs(
        Object.keys(virtuals)
          .filter((v) =>
            showComplex
              ? v
              : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
          )
          .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
      )
    } else {
      setPixelGraphs([])
    }
    return () => {
      setPixelGraphs([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphs, graphsMulti, setPixelGraphs])

  const renderSection = (
    title: string,
    items: any[],
    renderItem: (item: any, index: number) => React.ReactNode
  ) => {
    if (!items.length) return null
    return (
      <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
        <Typography variant="overline" sx={{ width: '100%', textAlign: 'center', opacity: 0.7 }}>
          {title}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            flexDirection: layout.itemDirection
          }}
        >
          {items.map(renderItem)}
        </div>
      </Stack>
    )
  }

  const filteredVirtualOrder = (virtualOrder || []).filter((o) => {
    const virtual = virtuals[o.virtId]
    if (!virtual) return false
    const isComplex =
      o.virtId.endsWith('-mask') ||
      o.virtId.endsWith('-foreground') ||
      o.virtId.endsWith('-background')
    if (!showComplex && isComplex) return false
    if (!showGaps && o.virtId.startsWith('gap-')) return false
    return true
  })

  const virtuals1D = filteredVirtualOrder.filter((o) => {
    if (!layout.separate2DDevices) return true
    return (virtuals[o.virtId].config.rows || 1) <= 1
  })

  const virtuals2D = layout.separate2DDevices
    ? filteredVirtualOrder.filter((o) => (virtuals[o.virtId].config.rows || 1) > 1)
    : []

  const activeClients = (clientOrder || []).filter((o) => clients[o.virtId])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <Collapse in={infoAlerts.devices} sx={{ width: '100%' }}>
        <Alert
          severity="info"
          onClose={() => {
            setInfoAlerts('devices', false)
          }}
          sx={{ mb: 2 }}
        >
          Use the + Button to add a new device or virtual.
          <br />
          Virtuals can be used to <strong>split</strong> or <strong> group</strong> segments of
          devices.
        </Alert>
      </Collapse>

      <div
        style={{
          display: 'flex',
          flexDirection: layout.sectionDirection,
          gap: '2rem',
          width: '100%',
          justifyContent: 'center',
          alignItems: layout.sectionDirection === 'row' ? 'flex-start' : 'center'
        }}
      >
        {renderSection(layout.separate2DDevices ? '1D Devices' : 'Devices', virtuals1D, (o, i) => (
          <DeviceCard virtual={o.virtId} key={o.virtId} index={i} />
        ))}

        {layout.separate2DDevices &&
          renderSection('2D Devices', virtuals2D, (o, i) => (
            <DeviceCard virtual={o.virtId} key={o.virtId} index={i} />
          ))}

        {features.showVisualisersOnDevicesPage &&
          renderSection('Visualizers', activeClients, (o) => (
            <VisualizerCard
              key={o.virtId}
              selectedClients={[o.virtId]}
              name={clients[o.virtId]?.name}
              type={clients[o.virtId]?.type}
            />
          ))}
      </div>

      {!filteredVirtualOrder.length && !activeClients.length && <NoYet type="Device" />}
    </div>
  )
}

export default Devices
