import { Box, Button, Select, MenuItem, Stack, Typography } from '@mui/material'
import {
  ArrowBackIos,
  ArrowForwardIos,
  Fullscreen,
  PlayArrow,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import BladeSchemaForm from '../../components/SchemaForm/SchemaForm/SchemaForm'
import { useVStore, type VState } from '../../hooks/vStore'

// Inner component that uses hooks - only rendered when store is ready
const VisualizerDevWidgetInner = () => {
  // All hooks are called unconditionally here
  const visualType = useVStore((state: VState) => state.visualType) || 'butterchurn'
  const showOverlays = useVStore((state: VState) => state.showOverlays) ?? true
  const butterchurnConfig = useVStore((state: VState) => state.butterchurnConfig) || {}
  const butterchurnPresetNames = useVStore((state: VState) => state.butterchurnPresetNames) || []
  const visualizerConfigs = useVStore((state: VState) => state.visualizerConfigs) || {}

  // Actions from store
  const setVisualType = useVStore((state: VState) => state.setVisualType)
  const updateButterchurnConfig = useVStore((state: VState) => state.updateButterchurnConfig)
  const updateVisualizerConfig = useVStore((state: VState) => state.updateVisualizerConfig)
  const togglePlay = useVStore((state: VState) => state.togglePlay)
  const toggleOverlays = useVStore((state: VState) => state.toggleOverlays)

  // Registry data (still needs window API)
  const api = (window as any).visualiserApi
  const registry = api?.getVisualizerRegistry?.() || {}
  const visualizerIds = api?.getVisualizerIds?.() || []

  const getUISchema = (visualizerId: string, config?: any) => {
    if (!registry[visualizerId]) return { properties: {}, permitted_keys: [] }
    const schema = registry[visualizerId].getUISchema(config)

    // Manually populate Butterchurn preset names from store
    if (
      visualizerId === 'butterchurn' &&
      schema?.properties?.currentPresetName &&
      butterchurnPresetNames.length > 0
    ) {
      schema.properties.currentPresetName.type = 'autocomplete'
      schema.properties.currentPresetName.enum = butterchurnPresetNames
      schema.properties.currentPresetName.full = true
      schema.properties.currentPresetName.freeSolo = true
    }

    return schema
  }

  const hasSchema = (visualizerId: string) => !!registry[visualizerId]

  // Get current config
  const currentConfig =
    visualType === 'butterchurn' ? butterchurnConfig : visualizerConfigs?.[visualType] || {}

  // Config change handler
  const handleConfigChange = (visualizerId: string, update: any) => {
    const fullUpdate = { ...update }

    // Butterchurn preset syncing
    if (visualizerId === 'butterchurn') {
      if ('currentPresetName' in update && butterchurnPresetNames.length > 0) {
        const index = butterchurnPresetNames.findIndex(
          (name: string) => name === update.currentPresetName
        )
        if (index !== -1) fullUpdate.currentPresetIndex = index
      }

      if ('currentPresetIndex' in update && butterchurnPresetNames.length > 0) {
        const name = butterchurnPresetNames[update.currentPresetIndex]
        if (name) fullUpdate.currentPresetName = name
      }
    }

    if (visualizerId === 'butterchurn') {
      updateButterchurnConfig?.(fullUpdate)
    } else {
      updateVisualizerConfig?.(visualizerId, fullUpdate)
    }
  }

  // Navigation
  const handlePrevVisual = () => {
    const currentIndex = visualizerIds.indexOf(visualType)
    const prevIndex = currentIndex <= 0 ? visualizerIds.length - 1 : currentIndex - 1
    if (visualizerIds[prevIndex]) setVisualType?.(visualizerIds[prevIndex])
  }

  const handleNextVisual = () => {
    const currentIndex = visualizerIds.indexOf(visualType)
    const nextIndex = currentIndex >= visualizerIds.length - 1 ? 0 : currentIndex + 1
    if (visualizerIds[nextIndex]) setVisualType?.(visualizerIds[nextIndex])
  }

  return (
    <Box
      sx={{
        ml: 0,
        mb: 2,
        p: 2,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 1
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Box sx={{ mb: 2 }}>
        <Stack direction="column" spacing={2}>
          <Stack key="buttons" direction="row" spacing={1} alignItems="center">
            <Button key="prev" color="inherit" onClick={handlePrevVisual}>
              <ArrowBackIos key="icon-prev" />
            </Button>
            <Button key="next" color="inherit" onClick={handleNextVisual}>
              <ArrowForwardIos key="icon-next" />
            </Button>
            <Button key="play" variant="outlined" size="small" onClick={togglePlay}>
              <PlayArrow key="icon-play" />
            </Button>
            <Button
              key="fullscreen"
              variant="outlined"
              size="small"
              onClick={() => window.visualiserApi?.toggleFullscreen?.()}
            >
              <Fullscreen key="icon-fullscreen" />
            </Button>
            <Button key="overlays" variant="outlined" size="small" onClick={toggleOverlays}>
              {showOverlays ? (
                <Visibility key="icon-visible" />
              ) : (
                <VisibilityOff key="icon-hidden" />
              )}
            </Button>
          </Stack>
          <Select
            key="visualizer-select"
            variant="outlined"
            value={visualType || 'butterchurn'}
            label="Visual Type"
            onChange={(e) => setVisualType?.(e.target.value)}
            sx={{ width: '100%' }}
            size="small"
          >
            {visualizerIds.map((id: string) => (
              <MenuItem key={id} value={id}>
                {registry[id]?.displayName || id}
              </MenuItem>
            ))}
          </Select>
          {hasSchema(visualType) && (
            <BladeSchemaForm
              key={`schema-${visualType}`}
              schema={getUISchema(visualType, currentConfig)}
              model={currentConfig}
              hideToggle
              onModelChange={(update) => handleConfigChange(visualType, update)}
            />
          )}
        </Stack>
      </Box>
    </Box>
  )
}

// Outer component that handles loading state
const VisualizerDevWidget = () => {
  const [apiReady, setApiReady] = useState(false)

  // Check if API is available
  useEffect(() => {
    const checkApi = () => {
      const api = (window as any).visualiserApi
      const YzModule = (window as any).YzAudioVisualiser
      if (api && api.getVisualizerIds && YzModule?.useStore) {
        setApiReady(true)
      }
    }

    // Check immediately
    checkApi()

    // Poll every 500ms until API is ready
    const interval = setInterval(() => {
      if (!apiReady) {
        checkApi()
      }
    }, 500)

    return () => clearInterval(interval)
  }, [apiReady])

  // Show loading state while API initializes
  if (!apiReady) {
    return (
      <Box
        sx={{
          ml: 0,
          mb: 2,
          p: 2,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Waiting for visualizer API to initialize...
        </Typography>
      </Box>
    )
  }

  // Once ready, render the inner component that uses hooks
  return <VisualizerDevWidgetInner />
}

export default VisualizerDevWidget
