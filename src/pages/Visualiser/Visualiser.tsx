import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Tooltip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  Fullscreen,
  FullscreenExit,
  ExpandMore,
  PlayArrow,
  Pause,
  SignalCellularAlt,
  Settings,
  Code,
  Mic,
  Cloud,
  AutoAwesome,
  MusicNote,
  BugReport
} from '@mui/icons-material'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import useStore from '../../store/useStore'
import { useWebSocket, useSubscription } from '../../utils/Websocket/WebSocketProvider'
import WebGLVisualiser, { WebGLVisualisationType } from './WebGLVisualiser'
import BladeEffectSchemaForm from '../../components/SchemaForm/EffectsSchemaForm/EffectSchemaForm'
import { gifFragmentShader } from './shaders'
import useAudioAnalyser from './useAudioAnalyser'

// --- Schemas for Visualiser Effects ---

const VISUALISER_SCHEMAS: Record<string, any[]> = {
  gif: [
    {
      id: 'rotate',
      title: 'Rotate',
      type: 'number',
      min: 0,
      max: 360,
      step: 1
    },
    {
      id: 'gif_fps',
      title: 'GIF FPS',
      type: 'integer',
      min: 1,
      max: 60,
      step: 1
    },
    {
      id: 'brightness',
      title: 'Brightness',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.05
    },
    {
      id: 'bounce',
      title: 'Bounce',
      type: 'boolean'
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    },
    {
      id: 'image_location',
      title: 'Image Location',
      type: 'string'
    }
  ],
  bleep: [
    {
      id: 'scroll_time',
      title: 'Scroll Speed',
      type: 'number',
      min: 0.1,
      max: 5.0,
      step: 0.1
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  concentric: [
    {
      id: 'gradient_scale',
      title: 'Gradient Scale',
      type: 'number',
      min: 0.1,
      max: 5.0,
      step: 0.1
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'invert',
      title: 'Invert',
      type: 'boolean'
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  bars3d: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'smoothing',
      title: 'Smoothing',
      type: 'number',
      min: 0,
      max: 0.95,
      step: 0.05
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  particles: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'smoothing',
      title: 'Smoothing',
      type: 'number',
      min: 0,
      max: 0.95,
      step: 0.05
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  waveform3d: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  radial3d: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  matrix: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  terrain: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  geometric: [
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  // --- NEW MATRIX EFFECTS ---
  gameoflife: [
    {
      id: 'cell_size',
      title: 'Cell Size',
      type: 'integer',
      min: 4,
      max: 32,
      step: 1
    },
    {
      id: 'speed',
      title: 'Speed',
      type: 'number',
      min: 0.1,
      max: 2.0,
      step: 0.1
    },
    {
      id: 'beat_inject',
      title: 'Beat Inject',
      type: 'boolean'
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  digitalrain: [
    {
      id: 'density',
      title: 'Density',
      type: 'number',
      min: 0.5,
      max: 2.0,
      step: 0.1
    },
    {
      id: 'speed',
      title: 'Speed',
      type: 'number',
      min: 0.5,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'tail_length',
      title: 'Tail Length',
      type: 'number',
      min: 0.2,
      max: 0.8,
      step: 0.05
    },
    {
      id: 'glow_intensity',
      title: 'Glow Intensity',
      type: 'number',
      min: 0.5,
      max: 2.0,
      step: 0.1
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  flame: [
    {
      id: 'intensity',
      title: 'Intensity',
      type: 'number',
      min: 0.5,
      max: 2.0,
      step: 0.1
    },
    {
      id: 'wobble',
      title: 'Wobble',
      type: 'number',
      min: 0.1,
      max: 1.0,
      step: 0.1
    },
    {
      id: 'low_color',
      title: 'Bass Color',
      type: 'color'
    },
    {
      id: 'mid_color',
      title: 'Mid Color',
      type: 'color'
    },
    {
      id: 'high_color',
      title: 'High Color',
      type: 'color'
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  plasma2d: [
    {
      id: 'density',
      title: 'Density',
      type: 'number',
      min: 0.5,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'twist',
      title: 'Twist',
      type: 'number',
      min: 0.01,
      max: 0.3,
      step: 0.01
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  equalizer2d: [
    {
      id: 'bands',
      title: 'Bands',
      type: 'integer',
      min: 8,
      max: 64,
      step: 4
    },
    {
      id: 'ring_mode',
      title: 'Ring Mode',
      type: 'boolean'
    },
    {
      id: 'center_mode',
      title: 'Center Mode',
      type: 'boolean'
    },
    {
      id: 'spin_enabled',
      title: 'Spin Enabled',
      type: 'boolean'
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  noise2d: [
    {
      id: 'zoom',
      title: 'Zoom',
      type: 'number',
      min: 0.5,
      max: 10.0,
      step: 0.5
    },
    {
      id: 'speed',
      title: 'Speed',
      type: 'number',
      min: 0.2,
      max: 2.0,
      step: 0.1
    },
    {
      id: 'audio_zoom',
      title: 'Audio Zoom',
      type: 'number',
      min: 0.0,
      max: 2.0,
      step: 0.1
    },
    {
      id: 'sensitivity',
      title: 'Sensitivity',
      type: 'number',
      min: 0.1,
      max: 3.0,
      step: 0.1
    },
    {
      id: 'developer_mode',
      title: 'Developer Mode',
      type: 'boolean'
    }
  ],
  // --- ADDITIONAL MATRIX EFFECTS ---
  blender: [
    { id: 'speed', title: 'Speed', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'blur', title: 'Blur', type: 'number', min: 0.0, max: 1.0, step: 0.1 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  clone: [
    { id: 'mirrors', title: 'Mirrors', type: 'number', min: 1, max: 8, step: 1 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  bands: [
    { id: 'bands', title: 'Bands', type: 'integer', min: 8, max: 64, step: 4 },
    { id: 'flip', title: 'Flip', type: 'boolean' },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  bandsmatrix: [
    { id: 'bands', title: 'Bands', type: 'integer', min: 8, max: 64, step: 4 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  blocks: [
    { id: 'block_size', title: 'Block Size', type: 'integer', min: 4, max: 30, step: 1 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  keybeat2d: [
    { id: 'keys', title: 'Keys', type: 'integer', min: 8, max: 32, step: 1 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  texter: [
    { id: 'density', title: 'Density', type: 'number', min: 0.5, max: 2.0, step: 0.1 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  plasmawled2d: [
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  radial: [
    { id: 'bands', title: 'Bands', type: 'integer', min: 8, max: 64, step: 4 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  soap: [
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  waterfall: [
    { id: 'bands', title: 'Bands', type: 'integer', min: 16, max: 128, step: 8 },
    { id: 'speed', title: 'Speed', type: 'number', min: 0.5, max: 3.0, step: 0.1 },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ],
  image: [
    { id: 'bg_color', title: 'BG Color', type: 'color' },
    { id: 'rotate', title: 'Rotate', type: 'number', min: 0, max: 360, step: 1 },
    { id: 'brightness', title: 'Brightness', type: 'number', min: 0, max: 1, step: 0.05 },
    { id: 'background_brightness', title: 'Background Brightness', type: 'number', min: 0, max: 1, step: 0.05 },
    { id: 'multiplier', title: 'Multiplier', type: 'number', min: 0, max: 1, step: 0.05 },
    { id: 'min_size', title: 'Min Size', type: 'number', min: 0, max: 1, step: 0.05 },
    { id: 'frequency_range', title: 'Frequency Range (0=lows, 1=mids, 2=highs)', type: 'integer', min: 0, max: 2, step: 1 },
    { id: 'clip', title: 'Clip', type: 'boolean' },
    { id: 'spin', title: 'Spin', type: 'boolean' },
    { id: 'sensitivity', title: 'Sensitivity', type: 'number', min: 0.1, max: 3.0, step: 0.1 },
    { id: 'developer_mode', title: 'Developer Mode', type: 'boolean' }
  ]
}

const DEFAULT_CONFIGS: Record<string, any> = {
  gif: { rotate: 0, gif_fps: 30, brightness: 1.0, bounce: false, developer_mode: false, image_location: '' },
  bleep: { scroll_time: 1.0, sensitivity: 1.5, developer_mode: false },
  concentric: { gradient_scale: 1.0, sensitivity: 1.0, invert: false, developer_mode: false },
  bars3d: { sensitivity: 1.5, smoothing: 0.7, developer_mode: false },
  particles: { sensitivity: 1.5, smoothing: 0.7, developer_mode: false },
  waveform3d: { sensitivity: 1.5, developer_mode: false },
  radial3d: { sensitivity: 1.5, developer_mode: false },
  matrix: { sensitivity: 1.5, developer_mode: false },
  terrain: { sensitivity: 1.5, developer_mode: false },
  geometric: { sensitivity: 1.5, developer_mode: false },
  // --- NEW MATRIX EFFECTS ---
  gameoflife: { cell_size: 8, speed: 1.0, beat_inject: true, sensitivity: 1.5, developer_mode: false },
  digitalrain: { density: 1.0, speed: 1.5, tail_length: 0.5, glow_intensity: 1.0, sensitivity: 1.5, developer_mode: false },
  flame: { intensity: 1.0, wobble: 0.5, low_color: '#FF4400', mid_color: '#FFAA00', high_color: '#FFFF00', sensitivity: 1.5, developer_mode: false },
  plasma2d: { density: 1.5, twist: 0.1, sensitivity: 1.5, developer_mode: false },
  equalizer2d: { bands: 32, ring_mode: false, center_mode: false, spin_enabled: false, sensitivity: 1.5, developer_mode: false },
  noise2d: { zoom: 3.0, speed: 0.5, audio_zoom: 1.0, sensitivity: 1.5, developer_mode: false },
  // --- ADDITIONAL MATRIX EFFECTS ---
  blender: { speed: 1.0, blur: 0.5, sensitivity: 1.5, developer_mode: false },
  clone: { mirrors: 2, sensitivity: 1.5, developer_mode: false },
  bands: { bands: 32, flip: false, sensitivity: 1.5, developer_mode: false },
  bandsmatrix: { bands: 32, sensitivity: 1.5, developer_mode: false },
  blocks: { block_size: 8, sensitivity: 1.5, developer_mode: false },
  keybeat2d: { keys: 16, sensitivity: 1.5, developer_mode: false },
  texter: { density: 1.0, sensitivity: 1.5, developer_mode: false },
  plasmawled2d: { sensitivity: 1.5, developer_mode: false },
  radial: { bands: 32, sensitivity: 1.5, developer_mode: false },
  soap: { sensitivity: 1.5, developer_mode: false },
  waterfall: { bands: 64, speed: 1.0, sensitivity: 1.5, developer_mode: false },
  image: {
    bg_color: '#000000',
    rotate: 0,
    brightness: 1.0,
    background_brightness: 1.0,
    multiplier: 0.5,
    min_size: 0.3,
    frequency_range: 0,
    clip: false,
    spin: false,
    sensitivity: 1.5,
    developer_mode: false
  }
}

// Map visualType to backend effect type keys
// These must match the keys in schemas.effects from /api/schema
const VISUAL_TO_BACKEND_EFFECT: Record<string, string> = {
  // Matrix Effects (use backend schemas)
  gameoflife: 'game_of_life',
  digitalrain: 'digital_rain',
  flame: 'flame2d',
  plasma2d: 'plasma2d',
  equalizer2d: 'equalizer2d',
  noise2d: 'noise2d',
  blender: 'blender',
  clone: 'clone',
  bands: 'bands',
  bandsmatrix: 'bands_matrix',
  blocks: 'blocks',
  keybeat2d: 'keybeat2d',
  texter: 'texter2d',
  plasmawled2d: 'plasmawled2d',
  radial: 'radial',
  soap: 'soap2d',
  waterfall: 'waterfall2d',
  image: 'imagespin',
  gif: 'gifplayer',
  bleep: 'bleep',
  concentric: 'concentric'
}

// Order effect properties same as EffectsComplex
const configOrder = ['color', 'number', 'integer', 'string', 'boolean']

const orderEffectProperties = (
  schema: any,
  hidden_keys?: string[],
  advanced_keys?: string[],
  advanced?: boolean
) => {
  if (!schema || !schema.properties) return []
  const properties: any[] = Object.keys(schema.properties)
    .filter((k) => {
      if (hidden_keys && hidden_keys.length > 0) {
        return hidden_keys?.indexOf(k) === -1
      }
      return true
    })
    .filter((ke) => {
      if (advanced_keys && advanced_keys.length > 0 && !advanced) {
        return advanced_keys?.indexOf(ke) === -1
      }
      return true
    })
    .map((sk) => ({
      ...schema.properties[sk],
      id: sk
    }))
  const ordered = [] as any[]
  configOrder.forEach((type) => {
    ordered.push(...properties.filter((x) => x.type === type))
  })
  ordered.push(...properties.filter((x) => !configOrder.includes(x.type)))
  return ordered
    .sort((a) => (a.id === 'advanced' ? 1 : -1))
    .sort((a) => (a.type === 'string' && a.enum && a.enum.length ? -1 : 1))
    .sort((a) => (a.type === 'number' ? -1 : 1))
    .sort((a) => (a.type === 'integer' ? -1 : 1))
    .sort((a) => (a.id === 'bg_color' ? -1 : 1))
    .sort((a) => (a.type === 'color' ? -1 : 1))
    .sort((a) => (a.id === 'color' ? -1 : 1))
    .sort((a) => (a.id === 'gradient' ? -1 : 1))
}

const Visualiser = () => {
  const fullscreenHandle = useFullScreenHandle()
  const { send, isConnected } = useWebSocket()
  const getSchemas = useStore((state) => state.getSchemas)
  const effects = useStore((state) => state.schemas.effects)

  // Audio Analyser (Mic)
  const { 
    data: micData, 
    startListening, 
    stopListening, 
    isListening,
    error: micError
  } = useAudioAnalyser()

  // Local state
  const [isPlaying, setIsPlaying] = useState(true)
  const [fullScreen, setFullScreen] = useState(false)
  const [visualType, setVisualType] = useState<WebGLVisualisationType>('gif')
  const [config, setConfig] = useState<Record<string, any>>(DEFAULT_CONFIGS['gif'])
  const [audioData, setAudioData] = useState<number[]>([])
  
  const [audioSource, setAudioSource] = useState<'backend' | 'mic'>('backend')
  const [autoChange, setAutoChange] = useState(false)
  
  // Shader Editor State
  const [showCode, setShowCode] = useState(false)
  const [shaderCode, setShaderCode] = useState(gifFragmentShader)
  const [activeCustomShader, setActiveCustomShader] = useState<string | undefined>(undefined)

  const subscribedRef = useRef(false)
  const lastAutoChangeRef = useRef(0)

  useEffect(() => {
    getSchemas()
  }, [getSchemas])

  // Audio Data Subscription (Backend)
  useEffect(() => {
    if (audioSource === 'backend' && isConnected && !subscribedRef.current) {
      send({ event_type: 'graph_update', id: 9100, type: 'subscribe_event' })
      subscribedRef.current = true
    } else if (audioSource !== 'backend' && subscribedRef.current) {
      send({ event_type: 'graph_update', id: 9100, type: 'unsubscribe_event' })
      subscribedRef.current = false
    }
    
    return () => {
      if (subscribedRef.current) {
        send({ event_type: 'graph_update', id: 9100, type: 'unsubscribe_event' })
        subscribedRef.current = false
      }
    }
  }, [isConnected, send, audioSource])

  const handleGraphUpdate = useCallback((messageData: any) => {
    if (!messageData || !isPlaying || audioSource !== 'backend') return
    if (messageData.melbank && Array.isArray(messageData.melbank)) {
      setAudioData(messageData.melbank)
    }
  }, [isPlaying, audioSource])

  useSubscription('graph_update', handleGraphUpdate)

  // Handle Source Switching
  const handleSourceChange = (
    event: React.MouseEvent<HTMLElement>,
    newSource: 'backend' | 'mic' | null,
  ) => {
    if (newSource !== null) {
      setAudioSource(newSource)
      if (newSource === 'mic') {
        startListening()
      } else {
        stopListening()
      }
    }
  }

  // Auto Change Logic
  useEffect(() => {
    if (!autoChange || !isPlaying) return

    const now = Date.now()
    if (now - lastAutoChangeRef.current < 5000) return // Min 5 seconds between changes

    // Only change on beat if using mic, otherwise random timer (handled by loop above effectively)
    if (audioSource === 'mic') {
       if (micData.isBeat && micData.beatIntensity > 0.8) {
          triggerRandomVisual()
       }
    } else {
       // For backend, just use the timer check
       if (Math.random() > 0.99) { // low chance per frame, effectively random
          triggerRandomVisual()
       }
    }

  }, [autoChange, isPlaying, micData.isBeat, audioSource])

  const triggerRandomVisual = () => {
     const types: WebGLVisualisationType[] = [
       // Original Effects
       'gif', 'matrix', 'terrain', 'geometric', 'concentric', 'particles', 'bars3d', 'radial3d', 'waveform3d', 'bleep',
       // 2D Effects
       'bands', 'bandsmatrix', 'blocks', 'equalizer2d',
       // Matrix Effects
       'blender', 'clone', 'digitalrain', 'flame', 'gameoflife', 'image', 'keybeat2d',
       'noise2d', 'plasma2d', 'plasmawled2d', 'radial', 'soap', 'texter', 'waterfall'
     ]
     const nextType = types[Math.floor(Math.random() * types.length)]
     if (nextType !== visualType) {
        handleTypeChange(nextType)
        lastAutoChangeRef.current = Date.now()
     }
  }

  const handleEffectConfig = (newConfig: any) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const handleTypeChange = (type: WebGLVisualisationType) => {
    setVisualType(type)

    // Try to get defaults from backend schema if available
    const backendEffectType = VISUAL_TO_BACKEND_EFFECT[type]
    const backendSchema = effects && backendEffectType && effects[backendEffectType]?.schema

    if (backendSchema?.properties) {
      // Build config from backend schema defaults
      const backendDefaults: Record<string, any> = {}
      Object.keys(backendSchema.properties).forEach((key) => {
        const prop = backendSchema.properties[key]
        if (prop.default !== undefined) {
          backendDefaults[key] = prop.default
        }
      })
      // Merge with our local defaults (local takes precedence for visualiser-specific settings)
      setConfig({ ...backendDefaults, ...(DEFAULT_CONFIGS[type] || {}), developer_mode: false })
    } else {
      setConfig(DEFAULT_CONFIGS[type] || {})
    }

    setActiveCustomShader(undefined)
    setShowCode(false)
  }

  const handleApplyShader = () => {
    setActiveCustomShader(shaderCode)
  }

  const activeAudioData = audioSource === 'mic' ? micData.normalizedFrequency : audioData
  const beatData = audioSource === 'mic' ? { isBeat: micData.isBeat, beatIntensity: micData.beatIntensity, bpm: micData.bpm } : undefined

  // Calculate frequency bands from backend audio data
  const calculateFrequencyBands = useCallback((data: number[]): { bass: number; mid: number; high: number } => {
    if (data.length === 0) return { bass: 0, mid: 0, high: 0 }

    const len = data.length
    const bassEnd = Math.floor(len * 0.1)    // ~0-10% = bass
    const midEnd = Math.floor(len * 0.5)     // ~10-50% = mids
    // ~50-100% = highs

    let bassSum = 0, midSum = 0, highSum = 0
    for (let i = 0; i < len; i++) {
      if (i < bassEnd) {
        bassSum += data[i]
      } else if (i < midEnd) {
        midSum += data[i]
      } else {
        highSum += data[i]
      }
    }

    return {
      bass: bassEnd > 0 ? bassSum / bassEnd : 0,
      mid: (midEnd - bassEnd) > 0 ? midSum / (midEnd - bassEnd) : 0,
      high: (len - midEnd) > 0 ? highSum / (len - midEnd) : 0
    }
  }, [])

  const frequencyBands = audioSource === 'mic'
    ? { bass: micData.bass, mid: micData.mid, high: micData.high }
    : calculateFrequencyBands(audioData)

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: 'center', paddingTop: '1rem', width: '100%', maxWidth: '1600px', margin: '0 auto' }}
    >
      {/* Top Row: Visualiser (Full Width) */}
      <Grid size={{ xs: 12 }}>
        <Card variant="outlined" sx={{ '& > .MuiCardContent-root': { pb: '0.25rem' } }}>
          <CardContent>
            {/* Header / Controls */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                gap: 2
              }}
            >
              <Box>
                  <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <MusicNote /> Audio Visualiser
                  </Typography>
                  <Typography variant="body2" color={micError ? "error" : "textSecondary"}>
                     {audioSource === 'mic' 
                        ? (micError ? `Error: ${micError}` : (isListening ? `Listening (BPM: ${micData.bpm})` : 'Microphone Inactive')) 
                        : (isConnected ? 'Connected to Backend' : 'Backend Disconnected')}
                  </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                 
                 <FormControl size="small" sx={{ minWidth: 200 }}>
                     <InputLabel>Visualization</InputLabel>
                     <Select
                        value={visualType}
                        label="Visualization"
                        onChange={(e) => handleTypeChange(e.target.value as WebGLVisualisationType)}
                     >
                        <MenuItem disabled sx={{ opacity: 0.5, fontSize: '0.75rem' }}>Original Effects</MenuItem>
                        <MenuItem value="gif">Kaleidoscope</MenuItem>
                        <MenuItem value="matrix">Matrix Rain</MenuItem>
                        <MenuItem value="terrain">Synthwave Terrain</MenuItem>
                        <MenuItem value="geometric">Geometric Pulse</MenuItem>
                        <MenuItem value="concentric">Concentric Rings</MenuItem>
                        <MenuItem value="particles">Particles</MenuItem>
                        <MenuItem value="bars3d">Spectrum Bars</MenuItem>
                        <MenuItem value="radial3d">Radial Spectrum</MenuItem>
                        <MenuItem value="waveform3d">Waveform</MenuItem>
                        <MenuItem value="bleep">Oscilloscope</MenuItem>
                        <MenuItem disabled sx={{ opacity: 0.5, fontSize: '0.75rem', mt: 1 }}>2D Effects</MenuItem>
                        <MenuItem value="bands">Bands</MenuItem>
                        <MenuItem value="bandsmatrix">Bands Matrix</MenuItem>
                        <MenuItem value="blocks">Blocks</MenuItem>
                        <MenuItem value="equalizer2d">Equalizer 2D</MenuItem>
                        <MenuItem disabled sx={{ opacity: 0.5, fontSize: '0.75rem', mt: 1 }}>Matrix Effects</MenuItem>
                        <MenuItem value="blender">Blender</MenuItem>
                        <MenuItem value="clone">Clone</MenuItem>
                        <MenuItem value="digitalrain">Digital Rain</MenuItem>
                        <MenuItem value="flame">Flame</MenuItem>
                        <MenuItem value="gameoflife">Game of Life</MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                        <MenuItem value="keybeat2d">Keybeat 2D</MenuItem>
                        <MenuItem value="noise2d">Noise</MenuItem>
                        <MenuItem value="plasma2d">Plasma 2D</MenuItem>
                        <MenuItem value="plasmawled2d">Plasma WLED</MenuItem>
                        <MenuItem value="radial">Radial</MenuItem>
                        <MenuItem value="soap">Soap</MenuItem>
                        <MenuItem value="texter">Texter</MenuItem>
                        <MenuItem value="waterfall">Waterfall</MenuItem>
                     </Select>
                  </FormControl>

                  <ToggleButtonGroup
                     value={audioSource}
                     exclusive
                     onChange={handleSourceChange}
                     size="small"
                  >
                     <ToggleButton value="backend">
                        <Cloud sx={{ mr: 1 }} /> Backend
                     </ToggleButton>
                     <ToggleButton value="mic">
                        <Mic sx={{ mr: 1 }} /> Mic
                     </ToggleButton>
                  </ToggleButtonGroup>

                  <Tooltip title="Auto-change visuals on beat">
                     <ToggleButton
                        value="auto"
                        selected={autoChange}
                        onChange={() => setAutoChange(!autoChange)}
                        size="small"
                        color="primary"
                     >
                        <AutoAwesome sx={{ mr: 1 }} /> Auto
                     </ToggleButton>
                  </Tooltip>

                  <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant="outlined"
                    color="inherit"
                    sx={{ minWidth: '40px' }}
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </Button>
                </Tooltip>
                <Tooltip title="Fullscreen">
                  <Button
                    onClick={fullscreenHandle.enter}
                    variant="outlined"
                    color="inherit"
                    sx={{ minWidth: '40px' }}
                  >
                    <Fullscreen />
                  </Button>
                </Tooltip>

              </Box>
            </Box>

            {/* Canvas Area */}
            <Box sx={{ position: 'relative', width: '100%', height: '60vh', minHeight: '400px', bgcolor: 'black', borderRadius: 1, overflow: 'hidden', '& .fullscreen-wrapper': { width: '100%', height: '100%' } }}>
              <FullScreen handle={fullscreenHandle} onChange={setFullScreen} className="fullscreen-wrapper">
                <Box
                  sx={{
                    width: fullScreen ? '100vw' : '100%',
                    height: fullScreen ? '100vh' : '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'black'
                  }}
                  onDoubleClick={fullScreen ? fullscreenHandle.exit : fullscreenHandle.enter}
                >
                  <WebGLVisualiser
                    audioData={activeAudioData}
                    isPlaying={isPlaying}
                    visualType={visualType}
                    config={config}
                    customShader={activeCustomShader}
                    beatData={beatData}
                    frequencyBands={frequencyBands}
                  />
                  
                                    {/* Debug Overlay */}
                                    {config.developer_mode && audioSource === 'mic' && (
                                       <Paper 
                                          sx={{ 
                                             position: 'absolute',                             top: 20, 
                           right: 20, 
                           p: 2, 
                           width: 250, 
                           bgcolor: 'rgba(0,0,0,0.8)', 
                           color: 'white',
                           zIndex: 10
                        }}
                     >
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#4fc3f7' }}>Audio Debug</Typography>
                        <TableContainer>
                           <Table size="small">
                              <TableBody>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>BPM</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{micData.bpm}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>Confidence</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{(micData.confidence * 100).toFixed(0)}%</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>Vol (RMS)</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{micData.overall.toFixed(3)}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>Bass</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{micData.bass.toFixed(2)}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>Mid</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{micData.mid.toFixed(2)}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>High</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{micData.high.toFixed(2)}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: '1px solid #333' }}>Brightness</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{micData.spectralCentroid.toFixed(2)}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell sx={{ color: '#aaa', borderBottom: 'none' }}>Noisiness</TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: 'none' }}>{micData.spectralFlatness.toFixed(2)}</TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </TableContainer>
                        {micData.isBeat && (
                           <Box sx={{ 
                              mt: 1, 
                              height: 4, 
                              width: '100%', 
                              bgcolor: '#4fc3f7',
                              boxShadow: '0 0 10px #4fc3f7' 
                           }} />
                        )}
                     </Paper>
                  )}
                  
                  {fullScreen && (
                     <Box sx={{ position: 'absolute', bottom: 20, left: 20 }}>
                        <IconButton onClick={fullscreenHandle.exit} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
                           <FullscreenExit />
                        </IconButton>
                     </Box>
                  )}
                </Box>
              </FullScreen>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Bottom Row */}
      <Grid size={{ xs: 12, md: 8 }}>
        {/* Effect Configuration OR Shader Editor */}
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
               <Typography variant="h6">Configuration</Typography>
               <Tooltip title="Edit Shader">
                  <IconButton onClick={() => setShowCode(!showCode)} color={showCode ? "primary" : "default"}>
                     <Code />
                  </IconButton>
               </Tooltip>
            </Box>
            
            {showCode ? (
              <Box sx={{ p: 0 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={10}
                  maxRows={15}
                  value={shaderCode}
                  onChange={(e) => setShaderCode(e.target.value)}
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', mb: 2 }}
                  inputProps={{ style: { fontFamily: 'monospace', fontSize: '12px' } }}
                />
                <Button variant="contained" onClick={handleApplyShader} fullWidth>
                  Apply Shader
                </Button>
              </Box>
            ) : (
               (() => {
                  // Get backend effect type name
                  const backendEffectType = VISUAL_TO_BACKEND_EFFECT[visualType]

                  // Get ordered properties from backend schema if available, otherwise fallback to local
                  const schemaProperties = effects && backendEffectType && effects[backendEffectType]
                    ? orderEffectProperties(
                        effects[backendEffectType].schema,
                        effects[backendEffectType].hidden_keys,
                        effects[backendEffectType].advanced_keys,
                        config.advanced
                      )
                    : VISUALISER_SCHEMAS[visualType] || []

                  return (
                     <BladeEffectSchemaForm
                        handleEffectConfig={handleEffectConfig}
                        virtId="visualiser"
                        schemaProperties={schemaProperties}
                        model={config}
                        selectedType={visualType}
                        descriptions="Show"
                     />
                  )
               })()
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
         {/* Presets */}
         <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
               <Typography variant="h6" gutterBottom>Presets</Typography>
               <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Quickly switch between different moods.
               </Typography>
               
               <Stack spacing={2}>
                  <Button onClick={() => handleTypeChange(visualType)} variant="outlined" fullWidth>DEFAULT</Button>
                  <Button onClick={() => setConfig(prev => ({ ...prev, sensitivity: 2.5, brightness: 1.2, smoothing: 0.2 }))} variant="outlined" fullWidth color="secondary">HIGH ENERGY</Button>
                  <Button onClick={() => setConfig(prev => ({ ...prev, sensitivity: 0.8, smoothing: 0.9, speed: 0.5 }))} variant="outlined" fullWidth color="info">CHILL</Button>
               </Stack>
               
               {audioSource === 'mic' && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                     <Typography variant="caption" display="block" gutterBottom>AUDIO STATS</Typography>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">BPM</Typography>
                        <Typography variant="caption" fontWeight="bold">{micData.bpm}</Typography>
                     </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Confidence</Typography>
                        <Typography variant="caption" fontWeight="bold">{Math.round(micData.confidence * 100)}%</Typography>
                     </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Beat Intensity</Typography>
                        <Typography variant="caption" fontWeight="bold">{micData.beatIntensity.toFixed(2)}</Typography>
                     </Box>
                  </Box>
               )}
            </CardContent>
         </Card>
      </Grid>
    </Grid>
  )
}

export default Visualiser