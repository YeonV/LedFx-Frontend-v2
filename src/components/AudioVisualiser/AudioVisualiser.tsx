import { useState, useCallback, useEffect, useRef } from 'react'
import { useDynamicModule } from '@yz-dev/react-dynamic-module'
import { useTheme } from '@mui/material'
import useStore from '../../store/useStore'
import { useWebSocket, useSubscription } from '../../utils/Websocket/WebSocketProvider'
import BladeEffectSchemaForm from '../SchemaForm/EffectsSchemaForm/EffectSchemaForm'

export interface AudioVisualiserProps {
  theme: any
  effects?: any
  backendAudioData?: number[]
  ConfigFormComponent?: React.ComponentType<any>
  onClose?: () => void
  configData?: any
}

const Visualiser = ({ backgroundMode }: { backgroundMode?: boolean }) => {
  const [audioData, setAudioData] = useState<number[]>([])
  const audioDataRef = useRef<number[]>([])
  const lastUpdateRef = useRef(0)
  const subscribedRef = useRef(false)

  // Get data from store and theme
  const theme = useTheme()
  const effects = useStore((state) => state.schemas.effects)
  const { send, isConnected } = useWebSocket()
  const sendRef = useRef(send)

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

  // Handle graph updates - throttle to max 10 updates/sec to prevent infinite loop
  const handleGraphUpdate = useCallback((messageData: any) => {
    if (!messageData) return
    if (messageData.melbank && Array.isArray(messageData.melbank)) {
      audioDataRef.current = messageData.melbank

      const now = Date.now()
      if (now - lastUpdateRef.current >= 100) {
        // Max 10 updates per second
        lastUpdateRef.current = now
        setAudioData([...messageData.melbank])
      }
    }
  }, [])

  useSubscription('graph_update', handleGraphUpdate)

  const { status, as: AudioVisualiser } = useDynamicModule<AudioVisualiserProps>({
    src: '/modules/yz-audio-visualiser.js',
    from: 'YzAudioVisualiser',
    import: 'AudioVisualiser'
  })

  // Only log once when dialog opens with audio data
  const hasLoggedRef = useRef(false)
  useEffect(() => {
    if (audioData.length > 0 && !hasLoggedRef.current) {
      console.log('AudioVisualiser opened with audio data:', {
        audioDataLength: audioData.length,
        audioDataMax: audioData.length > 0 ? Math.max(...audioData) : 0,
        effects: effects ? Object.keys(effects).length : 0,
        isConnected
      })
      hasLoggedRef.current = true
    } else if (audioData.length === 0) {
      hasLoggedRef.current = false
    }
  }, [audioData, effects, isConnected])

  if (!AudioVisualiser || status !== 'available') {
    return null
  }

  return (
    <AudioVisualiser
      theme={theme}
      effects={effects}
      backendAudioData={audioData}
      configData={{
        background: backgroundMode
      }}
      ConfigFormComponent={BladeEffectSchemaForm}
    />
  )
}

export default Visualiser
