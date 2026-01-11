import { useEffect, useRef } from 'react'
import { makeStyles } from '@mui/styles'
import { Alert, Collapse } from '@mui/material'
import useStore from '../../store/useStore'
import DeviceCard from './DeviceCard/DeviceCard.wrapper'
import NoYet from '../../components/NoYet'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'
import { IVirtualEventUpdate } from '../../store/api/storeVirtuals'

const useStyles = makeStyles(() => ({
  cardWrapper: {
    // padding: theme.spacing(1),
    paddingTop: 0,
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
    justifyContent: 'center'
  },
  '@media (max-width: 580px)': {
    cardWrapper: {
      justifyContent: 'center'
    }
  },
  '@media (max-width: 410px)': {
    cardWrapper: {
      padding: 0
    }
  }
}))

const Devices = () => {
  const classes = useStyles()
  const getDevices = useStore((state) => state.getDevices)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const virtuals = useStore((state) => state.virtuals)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
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

  useSubscription('devices_updated', getDevices)

  // Collect effect_set events with fallback timer
  useSubscription('effect_set', (data: IVirtualEventUpdate) => {
    if (pendingUpdates.current.length === 0) {
      performance.mark('effect_set_start')
    }

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

  // Apply batched updates when scene activates (single state update)
  useSubscription('scene_activated', () => {
    if (pendingUpdates.current.length > 0) {
      batchUpdateVirtuals(pendingUpdates.current)
      pendingUpdates.current = []
    }
  })

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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Collapse in={infoAlerts.devices}>
        <Alert
          severity="info"
          onClose={() => {
            setInfoAlerts('devices', false)
          }}
        >
          Use the + Button to add a new device or virtual.
          <br />
          Virtuals can be used to <strong>split</strong> or <strong> group</strong> segments of
          devices.
        </Alert>
      </Collapse>
      <div className={classes.cardWrapper}>
        {virtuals && Object.keys(virtuals).length ? (
          Object.keys(virtuals)
            .filter((v) =>
              showComplex
                ? v
                : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
            )
            .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
            .map((virtual, i) => <DeviceCard virtual={virtual} key={i} index={i} />)
        ) : (
          <NoYet type="Device" />
        )}
      </div>
    </div>
  )
}

export default Devices
