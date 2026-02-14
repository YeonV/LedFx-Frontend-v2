import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
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
import useStore from '../../store/useStore'
import { useEffect, useState } from 'react'
import Popover from '../../components/Popover/Popover'

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

  const getClients = useStore((state) => state.getClients)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const [selectedClients, setSelectedClients] = useState<string[]>([clientIdentity?.clientId || ''])
  const [newVisName, setNewVisName] = useState('')

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

  // Place helper just before return, after all hooks/vars
  const handleMultiClientAction = (
    localAction: (() => void) | null,
    remoteAction: string,
    extraPayload: Record<string, any> = {}
  ) => {
    if (!clientIdentity || !clientIdentity.clientId) return
    // Local for current instance
    if (selectedClients.includes(clientIdentity.clientId) && localAction) {
      localAction()
    }
    // Broadcast for others
    const otherClients = selectedClients.filter((id: string) => id !== clientIdentity.clientId)
    if (otherClients.length && broadcastToClients) {
      broadcastToClients(
        {
          broadcast_type: 'custom',
          target: { mode: 'uuids', uuids: otherClients },
          payload: {
            category: 'visualiser',
            action: remoteAction,
            ...extraPayload
          }
        },
        clientIdentity.clientId
      )
    }
  }

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

  // Config change handler (multi-client: push and overwrite)
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

    // Local update
    if (visualizerId === 'butterchurn') {
      updateButterchurnConfig?.(fullUpdate)
    } else {
      updateVisualizerConfig?.(visualizerId, fullUpdate)
    }

    // Broadcast full config to other clients
    handleMultiClientAction(null, 'set_visual_config', { visualizerId, config: fullUpdate })
  }

  // Multi-client aware navigation
  const handlePrevVisual = () => {
    const currentIndex = visualizerIds.indexOf(visualType)
    const prevIndex = currentIndex <= 0 ? visualizerIds.length - 1 : currentIndex - 1
    handleMultiClientAction(() => {
      if (visualizerIds[prevIndex]) setVisualType?.(visualizerIds[prevIndex])
    }, 'prev_visual')
  }

  const handleNextVisual = () => {
    const currentIndex = visualizerIds.indexOf(visualType)
    const nextIndex = currentIndex >= visualizerIds.length - 1 ? 0 : currentIndex + 1
    handleMultiClientAction(() => {
      if (visualizerIds[nextIndex]) setVisualType?.(visualizerIds[nextIndex])
    }, 'next_visual')
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
    if (newVisName) params.append('clientName', newVisName)

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

  useEffect(() => {
    getClients()
  }, [getClients])

  console.log(clients)

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
        {clients && Object.keys(clients).length > 1 && (
          <>
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Instances</InputLabel>
                <Select
                  multiple
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 200 }}
                  fullWidth
                  label="Instances"
                  value={selectedClients}
                  onChange={(e) => setSelectedClients(e.target.value as string[])}
                  renderValue={(selected) => {
                    // Type assertion to ensure 'selected' is treated as string[]
                    const selectedArray = selected as string[]
                    if (selectedArray.length === 1) {
                      return (
                        <Stack
                          direction="row"
                          justifyContent={'space-between'}
                          alignItems="center"
                          width={'100%'}
                        >
                          <Typography>{clients[selectedArray[0]].name}</Typography>
                          <Chip label={clients[selectedArray[0]].type} size="small" />
                        </Stack>
                      )
                    }
                    if (selectedArray.length === Object.keys(clients).length) {
                      return 'Sending to All ' + selectedArray.length
                    }
                    return `${selectedArray.length} Visualisers selected`
                  }}
                >
                  {Object.entries(clients)
                    // .filter(([clientId]) => clientId !== clientIdentity?.clientId)
                    .map(([clientId, client]) => (
                      <MenuItem key={clientId} value={clientId} sx={{ width: '100%' }}>
                        <Stack
                          direction="row"
                          justifyContent={'space-between'}
                          alignItems="center"
                          width={'100%'}
                        >
                          <Typography>
                            {client.name}
                            {clientId === clientIdentity.clientId ? ' (This instance)' : ''}
                          </Typography>
                          <Chip label={client.type} size="small" />
                        </Stack>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          </>
        )}
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
              <IconButton
                key="play"
                size="large"
                onClick={() => handleMultiClientAction(togglePlay, 'toggle_play')}
              >
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
                onClick={() =>
                  handleMultiClientAction(
                    () => window.visualiserApi?.toggleFullscreen?.(),
                    'toggle_fullscreen'
                  )
                }
              >
                <Fullscreen key="icon-fullscreen" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={showOverlays ? 'Hide overlays' : 'Show overlays'}>
              <IconButton
                key="overlays"
                size="large"
                onClick={() => handleMultiClientAction(toggleOverlays, 'toggle_overlays')}
              >
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
                onClick={() =>
                  handleMultiClientAction(() => setAutoChange?.(!autoChange), 'toggle_auto_change')
                }
                color={autoChange ? 'primary' : 'default'}
              >
                <AutoAwesome key="icon-auto" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={fxEnabled ? 'Disable FX' : 'Enable FX'}>
              <IconButton
                key="fx"
                size="large"
                onClick={() =>
                  handleMultiClientAction(() => setFxEnabled?.(!fxEnabled), 'toggle_fx')
                }
                color={fxEnabled ? 'secondary' : 'default'}
              >
                <AutoFixHigh key="icon-fx" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title={showFxPanel ? 'Hide FX panel' : 'Show FX panel'}>
              <IconButton
                key="fx-panel"
                size="medium"
                onClick={() =>
                  handleMultiClientAction(() => setShowFxPanel?.(!showFxPanel), 'toggle_fx_panel')
                }
                color={showFxPanel ? 'info' : 'default'}
              >
                <Tune key="icon-fx-panel" fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open in new tab (bookmark-friendly)">
              <Popover
                icon={<OpenInNew />}
                variant="text"
                color="inherit"
                onConfirm={handleOpenInNewTab}
                content={
                  <TextField
                    value={newVisName}
                    onChange={(e) => setNewVisName(e.target.value)}
                    label="Visualizer Name"
                  />
                }
              />
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
              if (newValue) {
                // Local update
                setVisualType?.(newValue.id)
                // Broadcast to others
                handleMultiClientAction(null, 'set_visual_type', { visualizerId: newValue.id })
              }
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
