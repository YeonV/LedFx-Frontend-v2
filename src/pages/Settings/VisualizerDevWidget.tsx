import { Autocomplete, Box, IconButton, Stack, TextField, Tooltip } from '@mui/material'
import {
  ArrowBackIos,
  ArrowForwardIos,
  AutoAwesome,
  AutoFixHigh,
  Fullscreen,
  OpenInNew,
  Pause,
  PlayArrow,
  Tune,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import BladeSchemaForm from '../../components/SchemaForm/SchemaForm/SchemaForm'
import { useVStore, type VState } from '../../hooks/vStore'

const VisualizerDevWidget = () => {
  const visualType = useVStore((state: VState) => state.visualType) || 'butterchurn'
  const showOverlays = useVStore((state: VState) => state.showOverlays) ?? true
  const isPlaying = useVStore((state: VState) => state.isPlaying) ?? false
  const autoChange = useVStore((state: VState) => state.autoChange) ?? false
  const fxEnabled = useVStore((state: VState) => state.fxEnabled) ?? false
  const showFxPanel = useVStore((state: VState) => state.showFxPanel) ?? false
  const butterchurnConfig = useVStore((state: VState) => state.butterchurnConfig) || {}
  const butterchurnPresetNames = useVStore((state: VState) => state.butterchurnPresetNames) || []
  const visualizerConfigs = useVStore((state: VState) => state.visualizerConfigs) || {}

  // Actions from store
  const setVisualType = useVStore((state: VState) => state.setVisualType)
  const updateButterchurnConfig = useVStore((state: VState) => state.updateButterchurnConfig)
  const updateVisualizerConfig = useVStore((state: VState) => state.updateVisualizerConfig)
  const togglePlay = useVStore((state: VState) => state.togglePlay)
  const toggleOverlays = useVStore((state: VState) => state.toggleOverlays)
  const setAutoChange = useVStore((state: VState) => state.setAutoChange)
  const setFxEnabled = useVStore((state: VState) => state.setFxEnabled)
  const setShowFxPanel = useVStore((state: VState) => state.setShowFxPanel)
  const visualizers = useVStore((state: VState) => state.visualizers) || []

  // Registry data from window API
  const api = (window as any).visualiserApi
  const registry = api?.getVisualizerRegistry?.() || {}

  // Get visualizer list from store (computed once at module load)
  const visualizerIds = visualizers.map((v: any) => v.id)

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

  // Generate URL with query parameters for current configuration
  const handleOpenInNewTab = () => {
    const params = new URLSearchParams()

    // Always add display mode and visual type
    params.append('display', 'true')
    params.append('visual', visualType)

    // Add global UI state parameters
    if (autoChange) params.append('autoChange', 'true')
    if (fxEnabled) params.append('fxEnabled', 'true')
    if (showFxPanel) params.append('showFxPanel', 'true')

    // Add configuration parameters
    const config = visualType === 'butterchurn' ? butterchurnConfig : currentConfig

    Object.entries(config).forEach(([key, value]) => {
      // Skip internal/runtime keys
      if (['initialPresetIndex', 'initialPresetName'].includes(key)) return

      // Convert value to string for URL
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value))
        } else {
          params.append(key, String(value))
        }
      }
    })

    // Build URL for current origin (supports any port/host)
    const url = `${window.location.origin}/#/visualiser?${params.toString()}`
    window.open(url, '_blank')
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
          <Stack key="buttons" direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Previous visualizer">
              <IconButton key="prev" size="large" onClick={handlePrevVisual}>
                <ArrowBackIos key="icon-prev" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next visualizer">
              <IconButton key="next" size="large" onClick={handleNextVisual}>
                <ArrowForwardIos key="icon-next" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
              <IconButton key="play" size="large" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause key="icon-pause" fontSize="medium" />
                ) : (
                  <PlayArrow key="icon-play" fontSize="medium" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton
                key="fullscreen"
                size="large"
                onClick={() => window.visualiserApi?.toggleFullscreen?.()}
              >
                <Fullscreen key="icon-fullscreen" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={showOverlays ? 'Hide overlays' : 'Show overlays'}>
              <IconButton key="overlays" size="large" onClick={toggleOverlays}>
                {showOverlays ? (
                  <Visibility key="icon-visible" fontSize="medium" />
                ) : (
                  <VisibilityOff key="icon-hidden" fontSize="medium" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title={autoChange ? 'Disable auto-change' : 'Enable auto-change'}>
              <IconButton
                key="auto-change"
                size="large"
                onClick={() => setAutoChange?.(!autoChange)}
                color={autoChange ? 'primary' : 'default'}
              >
                <AutoAwesome key="icon-auto" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={fxEnabled ? 'Disable FX' : 'Enable FX'}>
              <IconButton
                key="fx"
                size="large"
                onClick={() => setFxEnabled?.(!fxEnabled)}
                color={fxEnabled ? 'secondary' : 'default'}
              >
                <AutoFixHigh key="icon-fx" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={showFxPanel ? 'Hide FX panel' : 'Show FX panel'}>
              <IconButton
                key="fx-panel"
                size="medium"
                onClick={() => setShowFxPanel?.(!showFxPanel)}
                color={showFxPanel ? 'info' : 'default'}
              >
                <Tune key="icon-fx-panel" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open in new tab (bookmark-friendly)">
              <IconButton key="open-new" size="large" onClick={handleOpenInNewTab}>
                <OpenInNew key="icon-open-new" fontSize="medium" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Autocomplete
            key="visualizer-select"
            size="small"
            sx={{ width: '100%' }}
            options={visualizers}
            groupBy={(option: any) => option.category}
            getOptionLabel={(option: any) => option.displayName}
            value={visualizers.find((v: any) => v.id === visualType) || null}
            onChange={(_, newValue: any) => {
              if (newValue) setVisualType?.(newValue.id)
            }}
            renderInput={(params) => <TextField {...params} label="Visualization" />}
            isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
          />
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

export default VisualizerDevWidget
