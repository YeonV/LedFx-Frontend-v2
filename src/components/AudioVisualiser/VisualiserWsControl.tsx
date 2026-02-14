import { useVStore, type VState } from '../../hooks/vStore'
import useStore from '../../store/useStore'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'

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
  const updateButterchurnConfig = useVStore((state: VState) => state.updateButterchurnConfig)
  const updateVisualizerConfig = useVStore((state: VState) => state.updateVisualizerConfig)

  useSubscription('client_broadcast', (d) => {
    if (d.sender_id !== clientIdentity?.clientId && d.payload?.category === 'visualiser') {
      // console.log(clientIdentity?.clientId, d.payload?.target_uuids)
      if (d.payload?.target_uuids.includes(clientIdentity?.clientId)) {
        // console.log('BOOOOM', d)
        switch (d.payload?.action) {
          case 'set_visual_type': {
            // Overwrite visual type
            if (d.payload?.visualizerId) setVisualType?.(d.payload.visualizerId)
            break
          }
          case 'set_visual_config': {
            // Overwrite config for the given visualizerId
            const { visualizerId, config } = d.payload || {}
            if (visualizerId && config) {
              if (visualizerId === 'butterchurn') {
                updateButterchurnConfig?.(config)
              } else {
                updateVisualizerConfig?.(visualizerId, config)
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
  })

  return null
}

export default VisualiserWsControl
