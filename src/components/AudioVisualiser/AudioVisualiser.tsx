import { useState, useCallback, useEffect, useRef } from 'react'
import { useDynamicModule } from '@yz-dev/react-dynamic-module'
import { useTheme, Box } from '@mui/material'
import useStore from '../../store/useStore'
import { useWebSocket, useSubscription } from '../../utils/Websocket/WebSocketProvider'
import BladeSchemaForm from '../SchemaForm/SchemaForm/SchemaForm'
import VisualiserWsControl from './VisualiserWsControl'
import OffscreenVisualiserCapture from './OffscreenVisualiserCapture'
// import '../../fonts.css'
// import { useVStore, VState } from '../../hooks/vStore'

export interface AudioVisualiserProps {
  theme: any
  effects?: any
  backendAudioData?: number[]
  ConfigFormComponent?: React.ComponentType<any>
  onClose?: () => void
  configData?: any
  storageName?: string
}

// Exposed API from VisualiserIso (via window.visualiserApi)
// Matches VisualiserWindowApi from @mattallmighty/audio-visualiser
export interface VisualiserIsoRef {
  // Preset control (Butterchurn)
  loadPreset: (index: number) => void
  loadPresetByName: (name: string) => void
  getPresetNames: () => string[]
  getCurrentPreset: () => { name: string; index: number }

  // Navigation
  nextVisual: () => void
  prevVisual: () => void
  setVisual: (type: string) => void
  getCurrentVisual: () => string

  // Playback control
  togglePlay: () => void
  toggleFullscreen: () => void

  // UI state
  toggleOverlays: () => void
  getOverlaysVisible: () => boolean

  // Registry-driven API (schema-first architecture)
  getVisualizerConfig: (id: string) => any
  setVisualizerConfig: (id: string, config: any) => void
  getVisualizerIds: () => string[]
  getVisualizerMetadata: (id: string) => any
  getVisualizerRegistry: () => any
}

// Extend window to include visualiser API
declare global {
  interface Window {
    visualiserApi?: VisualiserIsoRef
    VISUALISER_STORAGE_NAME?: string
  }
}

const Visualiser = ({
  backgroundMode,
  storageName
}: {
  backgroundMode?: boolean
  storageName?: string
}) => {
  const [audioData, setAudioData] = useState<number[]>([])
  const setVisualizerInitialized = useStore((state) => state.ui.setVisualizerInitialized)
  const subscribedRef = useRef(false)
  // const togglePlay = useVStore((state: VState) => state.togglePlay)
  // Get data from store and theme
  const theme = useTheme()
  const effects = useStore((state) => state.schemas.effects)
  const { send, isConnected } = useWebSocket()
  const sendRef = useRef(send)

  // Offscreen capture settings
  const offscreenCaptureEnabled = useStore(
    (state) => state.uiPersist.offscreenCapture?.enabled ?? false
  )

  // Set storage name on window before module loads (fallback/convenience)
  if (storageName) {
    window.VISUALISER_STORAGE_NAME = storageName
  }

  // Keep sendRef up to date without triggering effects
  useEffect(() => {
    sendRef.current = send
  }, [send])

  // Subscribe to audio data from backend
  useEffect(() => {
    if (isConnected && !subscribedRef.current) {
      sendRef.current({ event_type: 'graph_update', id: 9100, type: 'subscribe_event' })
      subscribedRef.current = true
    } else if (!isConnected && subscribedRef.current) {
      sendRef.current({ event_type: 'graph_update', id: 9100, type: 'unsubscribe_event' })
      subscribedRef.current = false
    }

    return () => {
      if (subscribedRef.current) {
        sendRef.current({ event_type: 'graph_update', id: 9100, type: 'unsubscribe_event' })
        subscribedRef.current = false
      }
    }
  }, [isConnected])

  const handleGraphUpdate = useCallback((messageData: any) => {
    if (!messageData) return
    if (messageData.melbank && Array.isArray(messageData.melbank)) {
      setAudioData([...messageData.melbank])
    }
  }, [])

  useSubscription('graph_update', handleGraphUpdate)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0

  const { status, as: AudioVisualiser } = useDynamicModule<AudioVisualiserProps>({
    src: isCC ? 'modules/yz-audio-visualiser.js' : '/modules/yz-audio-visualiser.js',
    from: 'YzAudioVisualiser',
    import: 'default'
  })

  useEffect(() => {
    if (status === 'available') {
      setTimeout(() => {
        setVisualizerInitialized(true)
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  if (!AudioVisualiser || status !== 'available') {
    return null
  }

  const content = (
    <>
      <VisualiserWsControl />
      {offscreenCaptureEnabled && <OffscreenVisualiserCapture />}
      <AudioVisualiser
        theme={theme}
        effects={effects}
        backendAudioData={audioData}
        configData={{
          background: backgroundMode
        }}
        ConfigFormComponent={BladeSchemaForm}
        storageName={storageName}
      />
    </>
  )

  if (backgroundMode) {
    return (
      <Box
        data-background-visualizer="true"
        sx={{
          width: '100vw',
          height: 'calc(100vh - 64px)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      >
        {content}
      </Box>
    )
  }

  return content
}

export default Visualiser
