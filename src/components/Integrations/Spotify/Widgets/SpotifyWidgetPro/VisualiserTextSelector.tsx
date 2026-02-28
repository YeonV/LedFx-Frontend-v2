import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'

import useStore from '../../../../../store/useStore'
import { useWebSocket } from '../../../../../utils/Websocket/WebSocketProvider'
import { useVStore } from '../../../../../hooks/vStore'
import AutoApplySelector from './AutoApplySelector'

const VisualiserTextSelector = ({ generalDetector }: { generalDetector?: boolean }) => {
  const clients = useStore((state) => state.clients)
  const currentTrack = useStore((state) => state.spotify.currentTrack)

  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const { send, isConnected } = useWebSocket()
  const visualType = useVStore((state) => state.visualType)
  const updateButterchurnConfig = useVStore((state) => state.updateButterchurnConfig)
  const updateAstrofoxConfig = useVStore((state) => state.updateAstrofoxConfig)
  const updateVisualizerConfig = useVStore((state) => state.updateVisualizerConfig)

  // Visualiser selection state (Zustand store)
  const visualisersGlobal = useStore((state) => state.textVisualisers || [])
  const setTextVisualisers = useStore((state) => state.setTextVisualisers)
  // Local visualiser state for non-global mode
  const [visualisersLocal, setVisualisersLocal] = useState<string[]>([])

  // Use global or local state for visualisers
  const textVisualisers = generalDetector ? visualisersGlobal : visualisersLocal

  // Dedicated isActive and toggle for visualisers (from store)
  const isActiveVisualisersGlobal = useStore((state) => state.isActiveVisualisers)
  const setIsActiveVisualisersGlobal = useStore((state) => state.setIsActiveVisualisers)
  const [isActiveVisualisersLocal, setIsActiveVisualisersLocal] = useState(false)

  const isActiveVisualisers = generalDetector ? isActiveVisualisersGlobal : isActiveVisualisersLocal

  const toggleAutoApplyVisualisers = () => {
    if (generalDetector) {
      setIsActiveVisualisersGlobal(!isActiveVisualisersGlobal)
    } else {
      setIsActiveVisualisersLocal(!isActiveVisualisersLocal)
    }
  }

  // Build a name-to-id map for all current clients
  const nameToId = useMemo(
    () =>
      clients
        ? Object.entries(clients).reduce(
            (acc, [id, data]) => {
              if (data && data.name) acc[data.name] = id
              return acc
            },
            {} as Record<string, string>
          )
        : {},
    [clients]
  )

  const applyVisualiserConfig = useCallback(
    (selectedVisualisers: string[], visualizerId: string, update: Record<string, any>) => {
      const name = clientIdentity?.name || 'unknown-client'
      const selectedIds = selectedVisualisers.map((n) => nameToId[n]).filter(Boolean)
      const isCurrentClient = clientIdentity && selectedIds.includes(clientIdentity.clientId || '')

      if (isCurrentClient) {
        const targetId = visualizerId === 'active' ? visualType : visualizerId
        if (targetId) {
          if (targetId === 'butterchurn') {
            updateButterchurnConfig?.(update)
          } else if (targetId === 'astrofox') {
            updateAstrofoxConfig?.(update)
          } else {
            updateVisualizerConfig?.(targetId, update)
          }
          updateVisualizerConfigOptimistic(name, {
            configs: {
              [targetId]: update
            }
          })
        }
      }

      const otherClients = selectedIds.filter((id) => id !== clientIdentity?.clientId)
      if (otherClients.length && broadcastToClients && isConnected) {
        broadcastToClients(
          {
            broadcast_type: 'custom',
            target: { mode: 'uuids', uuids: otherClients },
            payload: {
              category: 'visualiser',
              action: 'set_visual_config',
              visualizerId,
              config: update
            }
          },
          send
        )
      }
    },
    [
      clientIdentity,
      broadcastToClients,
      isConnected,
      nameToId,
      visualType,
      updateVisualizerConfigOptimistic,
      updateButterchurnConfig,
      updateAstrofoxConfig,
      updateVisualizerConfig,
      send
    ]
  )

  const prevTrackRef = useRef<string>('')
  const prevIsActiveVisRef = useRef<boolean>(false)

  useEffect(() => {
    const hasChanges =
      currentTrack !== prevTrackRef.current || isActiveVisualisers !== prevIsActiveVisRef.current

    prevTrackRef.current = currentTrack
    prevIsActiveVisRef.current = isActiveVisualisers

    if (!hasChanges || currentTrack === '') return

    const timer = setTimeout(() => {
      if (isActiveVisualisers && textVisualisers.length > 0) {
        applyVisualiserConfig(textVisualisers, 'bladeTexter', {
          text: currentTrack.split(' - ')[0] || '',
          text2: currentTrack.split(' - ')[1] || currentTrack.split(' - ')[0] || currentTrack,
          height_percent: 10,
          width_percent: 200,
          speed_option_1: 0.1,
          offset_y2: 0.2,
          offset_y: -0.2,
          font: 'Stop',
          font2: 'technique'
        })
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [currentTrack, isActiveVisualisers, textVisualisers, applyVisualiserConfig])

  const filteredTextVisualisers = textVisualisers.filter((name: string) => nameToId[name])

  useEffect(() => {
    if (filteredTextVisualisers.length !== textVisualisers.length) {
      if (generalDetector) {
        setTextVisualisers(filteredTextVisualisers)
      } else {
        setVisualisersLocal(filteredTextVisualisers)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, textVisualisers, generalDetector])

  const handleTextVisualiserChangeByName = (event: any) => {
    const value = event.target.value
    if (generalDetector) {
      setTextVisualisers(typeof value === 'string' ? value.split(',') : value)
    } else {
      setVisualisersLocal(typeof value === 'string' ? value.split(',') : value)
    }
  }

  const visualizerInitialized = useStore((state) => state.ui.visualizerInitialized)
  if (!visualizerInitialized) {
    return null
  }

  return (
    <AutoApplySelector
      label="Text Visualisers"
      options={clients ? Object.entries(clients) : []}
      value={generalDetector ? filteredTextVisualisers : textVisualisers}
      onChange={handleTextVisualiserChangeByName}
      isActive={isActiveVisualisers}
      onToggle={toggleAutoApplyVisualisers}
      disabled={textVisualisers.length === 0}
      getOptionLabel={([, data]) => data?.name || ''}
      getOptionValue={([, data]) => data?.name || ''}
      renderValue={(selected) => selected.join(', ')}
    />
  )
}

export default React.memo(VisualiserTextSelector)
