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
  geometric: { sensitivity: 1.5, developer_mode: false }
}

const Visualiser = () => {
  const fullscreenHandle = useFullScreenHandle()
  const { send, isConnected } = useWebSocket()
  const getSchemas = useStore((state) => state.getSchemas)

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
     const types: WebGLVisualisationType[] = ['gif', 'matrix', 'terrain', 'geometric', 'concentric', 'particles', 'bars3d', 'radial3d', 'waveform3d', 'bleep']
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
    setConfig(DEFAULT_CONFIGS[type] || {})
    setActiveCustomShader(undefined)
    setShowCode(false)
  }

  const handleApplyShader = () => {
    setActiveCustomShader(shaderCode)
  }

  const activeAudioData = audioSource === 'mic' ? micData.normalizedFrequency : audioData
  const beatData = audioSource === 'mic' ? { isBeat: micData.isBeat, beatIntensity: micData.beatIntensity, bpm: micData.bpm } : undefined

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
               <BladeEffectSchemaForm
                  handleEffectConfig={handleEffectConfig}
                  virtId="visualiser"
                  schemaProperties={VISUALISER_SCHEMAS[visualType]}
                  model={config}
                  selectedType={visualType}
                  descriptions="Show"
               />
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