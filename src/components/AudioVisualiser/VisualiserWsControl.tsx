import { useEffect, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { useVStore, type VState } from '../../hooks/vStore'
import useStore from '../../store/useStore'
import { useSubscription, useWebSocket } from '../../utils/Websocket/WebSocketProvider'
import { useSongDetectorVisualisersAutoApply } from '../../hooks/useSongDetectorVisualisersAutoApply'
import { normalizeVisualizerId } from '../../utils/helpers'

const VisualiserWsControl = () => {
  const clientIdentity = useStore((state) => state.clientIdentity)
  const togglePlay = useVStore((state: VState) => state.togglePlay)
  const toggleOverlays = useVStore((state: VState) => state.toggleOverlays)
  const setAutoChange = useVStore((state: VState) => state.setAutoChange)
  const autoChange = useVStore((state: VState) => state.autoChange)
  const setFxEnabled = useVStore((state: VState) => state.setFxEnabled)
  const fxEnabled = useVStore((state: VState) => state.fxEnabled)
  const setShowFxPanel = useVStore((state: VState) => state.setShowFxPanel)
  const showFxPanel = useVStore((state: VState) => state.showFxPanel)
  const setVisualType = useVStore((state: VState) => state.setVisualType)
  const visualType = useVStore((state: VState) => state.visualType)
  const visualizers = useVStore((state: VState) => state.visualizers) || []
  const visualizerConfigs = useVStore((state: VState) => state.visualizerConfigs)
  const butterchurnConfig = useVStore((state: VState) => state.butterchurnConfig)
  const updateButterchurnConfig = useVStore((state: VState) => state.updateButterchurnConfig)
  const updateAstrofoxConfig = useVStore((state: VState) => state.updateAstrofoxConfig)
  const updateVisualizerConfig = useVStore((state: VState) => state.updateVisualizerConfig)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )

  const { send, isConnected } = useWebSocket()

  const configToSync = useMemo(
    () =>
      visualType === 'butterchurn' ? butterchurnConfig || {} : visualizerConfigs[visualType] || {},
    [visualType, butterchurnConfig, visualizerConfigs]
  )

  // Debounce the config sync to avoid flooding the network during slider drags
  const [debouncedConfig] = useDebounce(configToSync, 100)

  useSongDetectorVisualisersAutoApply()

  useEffect(() => {
    if (!isConnected || clientIdentity.clientId === undefined) return
    broadcastToClients(
      {
        broadcast_type: 'custom',
        target: { mode: 'all' },
        payload: {
          category: 'state-update',
          visualType,
          configs: {
            [visualType]: debouncedConfig
          }
        }
      },
      send
    )
  }, [isConnected, visualType, debouncedConfig, send, broadcastToClients, clientIdentity.clientId])

  useSubscription('client_broadcast', (d) => {
    // console.log('MAN', d, clientIdentity)
    if (d.sender_uuid !== clientIdentity?.clientId && d.payload?.category === 'visualiser') {
      // Correctly handle target modes: 'all' and 'type' should be processed by everyone
      // 'uuids' and 'names' should be filtered based on the local client
      const isTargetedToMe =
        d.target?.mode === 'all' ||
        (d.target?.mode === 'type' && d.target?.value === clientIdentity?.type) ||
        (d.target?.mode === 'uuids' && d.target?.uuids?.includes(clientIdentity?.clientId)) ||
        (d.target?.mode === 'names' && d.target?.names?.includes(clientIdentity?.name)) ||
        d.target_uuids?.includes(clientIdentity?.clientId) // Legacy support

      if (isTargetedToMe) {
        // console.log('BOOOOM', d)
        switch (d.payload?.action) {
          case 'set_visual_type': {
            // Overwrite visual type
            if (d.payload?.visualizerId) {
              const api = (window as any).visualiserApi
              const registry = api?.getVisualizerRegistry?.() || {}
              const normalizedId = normalizeVisualizerId(d.payload.visualizerId, registry)
              setVisualType?.(normalizedId)
            }
            break
          }
          case 'set_visual_config': {
            // Overwrite config for the given visualizerId
            const { visualizerId, config } = d.payload || {}
            let rawTargetId = visualizerId
            if (!rawTargetId || rawTargetId === 'active') {
              rawTargetId = visualType
            }

            if (rawTargetId && config) {
              const api = (window as any).visualiserApi
              const registry = api?.getVisualizerRegistry?.() || {}
              const targetId = normalizeVisualizerId(rawTargetId, registry)
              const schema = registry[targetId]?.getUISchema?.()

              // Only apply if the target effect supports the properties in the config
              // or if we explicitly provided a visualizerId (force update)
              const isPolymorphic = !visualizerId || visualizerId === 'active'

              if (isPolymorphic) {
                // Filter config to only include supported properties
                const supportedConfig = Object.keys(config).reduce(
                  (acc, key) => {
                    const hasProp =
                      schema?.properties?.[key] !== undefined ||
                      registry[targetId]?.defaultConfig?.[key] !== undefined ||
                      [
                        'gradient',
                        'gradient2',
                        'image_source',
                        'primaryColor',
                        'secondaryColor',
                        'tertiaryColor',
                        'low_band',
                        'bassColor',
                        'mid_band',
                        'midColor',
                        'high_band',
                        'highColor',
                        'sunColor',
                        'backgroundColor',
                        'peakColor',
                        'text',
                        'text2',
                        'font',
                        'font2',
                        'speed',
                        'speed_option_1',
                        'height_percent',
                        'width_percent',
                        'offset_y',
                        'offset_y2'
                      ].includes(key)

                    if (hasProp) {
                      acc[key] = config[key]
                    }
                    return acc
                  },
                  {} as Record<string, any>
                )

                if (Object.keys(supportedConfig).length > 0) {
                  if (targetId === 'butterchurn') {
                    updateButterchurnConfig?.(supportedConfig)
                  } else if (targetId === 'astrofox') {
                    updateAstrofoxConfig?.(supportedConfig)
                  } else {
                    updateVisualizerConfig?.(targetId, supportedConfig)
                  }
                }
              } else {
                // Force update as original
                if (targetId === 'butterchurn') {
                  updateButterchurnConfig?.(config)
                } else if (targetId === 'astrofox') {
                  updateAstrofoxConfig?.(config)
                } else {
                  updateVisualizerConfig?.(targetId, config)
                }
              }
            }
            break
          }
          case 'toggle_play':
            togglePlay()
            break
          case 'toggle_overlays':
            toggleOverlays()
            break
          case 'toggle_auto_change':
            setAutoChange?.(!autoChange)
            break
          case 'toggle_fx':
            setFxEnabled?.(!fxEnabled)
            break
          case 'toggle_fx_panel':
            setShowFxPanel?.(!showFxPanel)
            break
          case 'toggle_fullscreen':
            window.visualiserApi?.toggleFullscreen?.()
            break
          case 'next_visual': {
            const ids = visualizers.map((v: any) => v.id)
            const idx = ids.indexOf(visualType)
            const nextIdx = idx >= ids.length - 1 ? 0 : idx + 1
            if (ids[nextIdx]) setVisualType?.(ids[nextIdx])
            break
          }
          case 'prev_visual': {
            const ids = visualizers.map((v: any) => v.id)
            const idx = ids.indexOf(visualType)
            const prevIdx = idx <= 0 ? ids.length - 1 : idx - 1
            if (ids[prevIdx]) setVisualType?.(ids[prevIdx])
            break
          }
          default:
            // Unknown or unhandled action
            break
        }
      }
    }
    if (d.sender_uuid !== clientIdentity?.clientId && d.payload?.category === 'state-update') {
      updateVisualizerConfigOptimistic(d.sender_name, {
        visualType: d.payload?.visualType,
        configs: d.payload?.configs
      })
    }
  })

  return null
}

export default VisualiserWsControl
