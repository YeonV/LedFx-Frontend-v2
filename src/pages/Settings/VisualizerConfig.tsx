import {
  Autocomplete,
  Box,
  Chip,
  Collapse,
  IconButton,
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
  Close,
  ExpandMore,
  Fullscreen,
  OpenInNew,
  Pause,
  PlayArrow,
  Tune,
  Tv,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import BladeSchemaForm from '../../components/SchemaForm/SchemaForm/SchemaForm'
import { useVStore, type VState } from '../../hooks/vStore'
import useStore from '../../store/useStore'
import { useEffect, useState, useMemo } from 'react' // useState only for newVisName/showConfig
import { defaultVisualizerConfigOptimistic } from '../../store/ui-persist/storeVisualizerConfigOptimistic'
import Popover from '../../components/Popover/Popover'
import { ClientType } from '../../store/ui/storeClientIdentity'
import ClientEdit from './ClientEdit'
import { useWebSocket } from '../../utils/Websocket/WebSocketProvider'

interface VisualizerConfigProps {
  selectedClients?: string[]
  single?: boolean
  name?: string
  type?: ClientType
}

const VisualizerConfig = ({ selectedClients = [], single, name, type }: VisualizerConfigProps) => {
  // Zustand store values
  const globalVisualType = useVStore((state: VState) => state.visualType) || 'butterchurn'
  const globalIsPlaying = useVStore((state: VState) => state.isPlaying) ?? false
  const globalShowOverlays = useVStore((state: VState) => state.showOverlays) ?? true
  const globalAutoChange = useVStore((state: VState) => state.autoChange) ?? false
  const globalFxEnabled = useVStore((state: VState) => state.fxEnabled) ?? false
  const globalShowFxPanel = useVStore((state: VState) => state.showFxPanel) ?? false
  const butterchurnPresetNames = useVStore((state: VState) => state.butterchurnPresetNames) || []
  const butterchurnConfigRaw = useVStore((state: VState) => state.butterchurnConfig)
  const butterchurnConfig = useMemo(() => butterchurnConfigRaw || {}, [butterchurnConfigRaw])
  const visualizerConfigsRaw = useVStore((state: VState) => state.visualizerConfigs)
  const visualizerConfigs = useMemo(() => visualizerConfigsRaw || {}, [visualizerConfigsRaw])
  const clientIdentity = useStore((state) => state.clientIdentity)
  const coreParams = useStore((state) => state.coreParams)

  // Zustand optimistic state for sub-instances in single mode
  const visualizerConfigOptimistic = useStore((state) => state.visualizerConfigOptimistic)
  const setVisualizerConfigOptimistic = useStore((state) => state.setVisualizerConfigOptimistic)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  useEffect(() => {
    // Always use the 'name' prop as the key for the main instance
    const instance = typeof name === 'string' ? name : clientIdentity?.name || 'unknown-client'
    // If this is the main instance, never fall back to 'unknown-client'
    const key = typeof name === 'string' ? name : instance
    if (!visualizerConfigOptimistic || !visualizerConfigOptimistic[key]) {
      setVisualizerConfigOptimistic({
        ...(visualizerConfigOptimistic || {}),
        ...defaultVisualizerConfigOptimistic(
          globalVisualType,
          key,
          globalVisualType === 'butterchurn'
            ? butterchurnConfig
            : visualizerConfigs?.[globalVisualType] || {}
        )
      })
    }
  }, [
    visualizerConfigOptimistic,
    setVisualizerConfigOptimistic,
    globalVisualType,
    butterchurnConfig,
    visualizerConfigs,
    name,
    clientIdentity?.name
  ])

  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const { send, isConnected } = useWebSocket()
  // Helper: are we the main instance in single mode?
  const isCurrentClient =
    !!clientIdentity &&
    Array.isArray(selectedClients) &&
    selectedClients.length === 1 &&
    selectedClients[0] === clientIdentity.clientId

  // Use correct state for UI display
  // Always use the 'name' prop as the key for the main instance
  const instanceKey = typeof name === 'string' ? name : 'unknown-client'
  const localState = visualizerConfigOptimistic?.[instanceKey]
  // MAIN: use global state for UI/config, but always set optimistic value on update
  // SUB: use per-instance optimistic state
  const visualType = single
    ? isCurrentClient
      ? globalVisualType
      : localState?.visualType || globalVisualType
    : globalVisualType
  const isPlaying = single
    ? isCurrentClient
      ? globalIsPlaying
      : (localState?.isPlaying ?? false)
    : globalIsPlaying
  const showOverlays = single
    ? isCurrentClient
      ? globalShowOverlays
      : (localState?.showOverlays ?? true)
    : globalShowOverlays
  const autoChange = single
    ? isCurrentClient
      ? globalAutoChange
      : (localState?.autoChange ?? false)
    : globalAutoChange
  const fxEnabled = single
    ? isCurrentClient
      ? globalFxEnabled
      : (localState?.fxEnabled ?? false)
    : globalFxEnabled
  const showFxPanel = single
    ? isCurrentClient
      ? globalShowFxPanel
      : (localState?.showFxPanel ?? false)
    : globalShowFxPanel

  // For config/model: main uses global, sub uses optimistic
  // Only declare vtKey/optimisticConfig once, at the top
  const vtKey = typeof visualType === 'string' ? visualType : visualType[instanceKey]
  const optimisticConfig = localState?.configs?.[vtKey] || {}

  // (removed duplicate broadcastToClients and clientIdentity)
  const [newVisName, setNewVisName] = useState('')
  const [showConfig, setShowConfig] = useState(false)

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
  const visualizerIds = Array.isArray(visualizers) ? visualizers.map((v: any) => v.id) : []

  // Place helper just before return, after all hooks/vars
  const handleMultiClientAction = (
    localAction: (() => void) | null,
    remoteAction: string,
    extraPayload: Record<string, any> = {}
  ) => {
    if (!clientIdentity || !clientIdentity.clientId || !Array.isArray(selectedClients)) return
    // Local for current instance
    if (selectedClients.includes(clientIdentity.clientId) && localAction) {
      localAction()
    }
    // Broadcast for others
    const otherClients = selectedClients.filter((id: string) => id !== clientIdentity.clientId)
    if (otherClients && otherClients.length && broadcastToClients && isConnected) {
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
        send
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
  // Use per-instance config if available, fallback to global config
  // (vtKey and optimisticConfig already declared above)

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

    // Get all clients from the store for correct logic
    const allClients = useStore.getState().clients || {}
    const totalClients = Object.keys(allClients).length

    // // Debug logging
    // console.debug('[VisualizerConfig] handleConfigChange called', {
    //   visualizerId,
    //   update,
    //   fullUpdate,
    //   selectedClients,
    //   clientIdentity,
    //   clientId: clientIdentity?.clientId,
    //   totalClients,
    //   allClients
    // })

    // Only execute local action if there is only one client in the system, or if the current instance is selected
    const isLocal =
      totalClients < 2 ||
      (clientIdentity && selectedClients.includes(clientIdentity.clientId || ''))

    // console.debug('[VisualizerConfig] Local action decision', {
    //   isLocal,
    //   reason:
    //     totalClients < 2
    //       ? 'totalClients < 2'
    //       : clientIdentity && selectedClients.includes(clientIdentity.clientId || '')
    //         ? 'current instance selected'
    //         : 'not selected'
    // })

    if (isLocal) {
      // console.debug('[VisualizerConfig] Executing local update', { visualizerId, fullUpdate })
      if (visualizerId === 'butterchurn') {
        updateButterchurnConfig?.(fullUpdate)
      } else {
        updateVisualizerConfig?.(visualizerId, fullUpdate)
      }
      // Always update optimistic store for main client as well
      if (single && isCurrentClient && typeof name === 'string') {
        updateVisualizerConfigOptimistic(name, {
          configs: {
            ...localState?.configs,
            [visualizerId]: {
              ...localState?.configs?.[visualizerId],
              ...fullUpdate
            }
          }
        })
      }
    } else {
      // console.debug('[VisualizerConfig] Skipping local update (not selected)')
    }

    // // Broadcast full config to other clients
    // console.debug('[VisualizerConfig] Broadcasting to other clients (if any)', {
    //   selectedClients,
    //   clientIdentity,
    //   clientId: clientIdentity?.clientId
    // })
    handleMultiClientAction(null, 'set_visual_config', { visualizerId, config: fullUpdate })
  }

  // Multi-client aware navigation with optimistic update for single mode
  // In single mode, update store for main instance, Zustand slice for subs
  // (removed duplicate isCurrentClient declaration)

  const handlePrevVisual = () => {
    const currentIndex = visualizerIds.indexOf(
      single
        ? isCurrentClient
          ? globalVisualType
          : visualizerConfigOptimistic?.[instanceKey]?.visualType || globalVisualType
        : globalVisualType
    )
    const prevIndex = currentIndex <= 0 ? visualizerIds.length - 1 : currentIndex - 1
    if (single) {
      if (isCurrentClient) {
        if (visualizerIds[prevIndex]) {
          setVisualType?.(visualizerIds[prevIndex])
          // Also update optimistic state for main instance
          updateVisualizerConfigOptimistic(instanceKey, {
            visualType: visualizerIds[prevIndex]
          })
        }
      } else {
        if (visualizerIds[prevIndex]) {
          updateVisualizerConfigOptimistic(instanceKey, {
            visualType: visualizerIds[prevIndex]
          })
        }
      }
      handleMultiClientAction(null, 'prev_visual')
    } else {
      handleMultiClientAction(() => {
        if (visualizerIds[prevIndex]) setVisualType?.(visualizerIds[prevIndex])
      }, 'prev_visual')
    }
  }

  const handleNextVisual = () => {
    const currentIndex = visualizerIds.indexOf(
      single
        ? isCurrentClient
          ? globalVisualType
          : visualizerConfigOptimistic?.[instanceKey]?.visualType || globalVisualType
        : globalVisualType
    )
    const nextIndex = currentIndex >= visualizerIds.length - 1 ? 0 : currentIndex + 1
    if (single) {
      if (isCurrentClient) {
        if (visualizerIds[nextIndex]) {
          setVisualType?.(visualizerIds[nextIndex])
          // Also update optimistic state for main instance
          updateVisualizerConfigOptimistic(instanceKey, {
            visualType: visualizerIds[nextIndex]
          })
        }
      } else {
        if (visualizerIds[nextIndex]) {
          updateVisualizerConfigOptimistic(instanceKey, {
            visualType: visualizerIds[nextIndex]
          })
        }
      }
      handleMultiClientAction(null, 'next_visual')
    } else {
      handleMultiClientAction(() => {
        if (visualizerIds[nextIndex]) setVisualType?.(visualizerIds[nextIndex])
      }, 'next_visual')
    }
  }

  // Generate URL with query parameters for current configuration
  const handleOpenInNewTab = () => {
    const params = new URLSearchParams()

    // Always add display mode and visual type
    params.append('display', 'true')
    params.append(
      'visual',
      typeof visualType === 'string' ? visualType : visualType[instanceKey] || ''
    )

    // Add global UI state parameters
    if (autoChange) params.append('autoChange', 'true')
    if (fxEnabled) params.append('fxEnabled', 'true')
    if (showFxPanel) params.append('showFxPanel', 'true')
    if (newVisName) params.append('clientName', newVisName)

    // Add configuration parameters
    // Use per-instance config for URL export as well
    // (vtKey and optimisticConfig already declared above)
    // Use global config for main, optimistic for subs
    const config =
      single && isCurrentClient
        ? vtKey === 'butterchurn'
          ? butterchurnConfig
          : visualizerConfigs?.[vtKey] || {}
        : vtKey === 'butterchurn'
          ? optimisticConfig && Object.keys(optimisticConfig).length > 0
            ? optimisticConfig
            : butterchurnConfig
          : optimisticConfig && Object.keys(optimisticConfig).length > 0
            ? optimisticConfig
            : visualizerConfigs?.[vtKey] || {}

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

    // Build URL for current origin (supports any port/host) open-external-link
    const url = `${window.location.origin}/#/visualiser?${params.toString()}`
    const isCC = coreParams && Object.keys(coreParams).length > 0

    if (isCC) {
      window.api.send('toMain', { command: 'open-external-link', url })
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <Box
      sx={{
        ml: 0,
        mb: single ? 0 : 2,
        p: single ? 1 : 2,
        pl: 2,
        mt: single ? 0 : 2,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 1,
        position: 'relative'
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Stack direction="row" spacing={2}>
        {single && <Tv sx={{ fontSize: '50px' }} />}
        <Stack direction="row" spacing={2} flexGrow={1} alignItems={'flex-start'}>
          <Stack direction="column" sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {name} {name && type && isCurrentClient && <ClientEdit name={name} type={type} />}
              {name && showConfig && (
                <Chip
                  color={clientIdentity?.name === name ? 'primary' : 'default'}
                  variant="filled"
                  size="small"
                  label={type}
                  sx={{ mb: 0.5 }}
                />
              )}
            </Typography>
            <Stack direction="column" spacing={2}>
              <Stack
                key="buttons"
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ opacity: 0.7, height: 30 }}
              >
                <Tooltip title="Previous visualizer">
                  <IconButton
                    key="prev"
                    size={single ? 'small' : 'medium'}
                    onClick={handlePrevVisual}
                  >
                    <ArrowBackIos key="icon-prev" fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Next visualizer">
                  <IconButton
                    key="next"
                    size={single ? 'small' : 'medium'}
                    onClick={handleNextVisual}
                  >
                    <ArrowForwardIos key="icon-next" fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                  <IconButton
                    key="play"
                    size={single ? 'small' : 'medium'}
                    onClick={() =>
                      handleMultiClientAction(() => {
                        if (single && !isCurrentClient && typeof name === 'string') {
                          updateVisualizerConfigOptimistic(instanceKey, {
                            isPlaying: !isPlaying
                          })
                        } else {
                          togglePlay()
                        }
                      }, 'toggle_play')
                    }
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
                    size={single ? 'small' : 'medium'}
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
                    size={single ? 'small' : 'medium'}
                    onClick={() =>
                      handleMultiClientAction(() => {
                        if (single && !isCurrentClient && typeof name === 'string') {
                          updateVisualizerConfigOptimistic(instanceKey, {
                            showOverlays: !showOverlays
                          })
                        } else {
                          toggleOverlays()
                        }
                      }, 'toggle_overlays')
                    }
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
                    size={single ? 'small' : 'medium'}
                    onClick={() =>
                      handleMultiClientAction(() => {
                        if (single && !isCurrentClient && typeof name === 'string') {
                          updateVisualizerConfigOptimistic(instanceKey, {
                            autoChange: !autoChange
                          })
                        } else {
                          setAutoChange?.(!autoChange)
                        }
                      }, 'toggle_auto_change')
                    }
                    color={autoChange ? 'primary' : 'default'}
                  >
                    <AutoAwesome key="icon-auto" fontSize="medium" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={fxEnabled ? 'Disable FX' : 'Enable FX'}>
                  <IconButton
                    key="fx"
                    size={single ? 'small' : 'medium'}
                    onClick={() =>
                      handleMultiClientAction(() => {
                        if (single && !isCurrentClient && typeof name === 'string') {
                          updateVisualizerConfigOptimistic(instanceKey, {
                            fxEnabled: !fxEnabled
                          })
                        } else {
                          setFxEnabled?.(!fxEnabled)
                        }
                      }, 'toggle_fx')
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
                      handleMultiClientAction(() => {
                        if (single && !isCurrentClient && typeof name === 'string') {
                          updateVisualizerConfigOptimistic(instanceKey, {
                            showFxPanel: !showFxPanel
                          })
                        } else {
                          setShowFxPanel?.(!showFxPanel)
                        }
                      }, 'toggle_fx_panel')
                    }
                    color={showFxPanel ? 'info' : 'default'}
                  >
                    <Tune key="icon-fx-panel" fontSize="medium" />
                  </IconButton>
                </Tooltip>
                {!single && (
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
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Collapse in={showConfig} sx={{ mt: showConfig ? 3 : '0 !important' }}>
        <Autocomplete
          key="visualizer-select"
          size="medium"
          sx={{ width: '100%', mb: 2 }}
          options={[...visualizers].sort((a, b) => {
            if (a.category < b.category) return -1
            if (a.category > b.category) return 1
            if (a.displayName < b.displayName) return -1
            if (a.displayName > b.displayName) return 1
            return 0
          })}
          groupBy={(option: any) => option.category}
          getOptionLabel={(option: any) => option.displayName}
          value={
            visualizers.find((v: any) => v.id === (single ? visualType : globalVisualType)) || null
          }
          onChange={(_, newValue: any) => {
            if (newValue) {
              if (single) {
                if (isCurrentClient) {
                  setVisualType?.(newValue.id)
                }
                updateVisualizerConfigOptimistic(instanceKey, {
                  visualType: newValue.id
                })
                handleMultiClientAction(null, 'set_visual_type', {
                  visualizerId: newValue.id
                })
              } else {
                // Get all clients from the store for correct logic
                const allClients = useStore.getState().clients || {}
                const totalClients = Object.keys(allClients).length
                const clientIdentity = useStore.getState().clientIdentity
                const isLocal =
                  totalClients < 2 ||
                  (clientIdentity &&
                    Array.isArray(selectedClients) &&
                    selectedClients.includes(clientIdentity.clientId || ''))
                if (isLocal) {
                  setVisualType?.(newValue.id)
                }
                // Broadcast to others
                handleMultiClientAction(null, 'set_visual_type', {
                  visualizerId: newValue.id
                })
              }
            }
          }}
          renderInput={(params) => <TextField {...params} label="Visualization" />}
          isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
        />
        {hasSchema(single ? visualType : globalVisualType) && (
          <BladeSchemaForm
            key={`schema-${single ? vtKey : globalVisualType}`}
            schema={getUISchema(
              single ? vtKey : globalVisualType,
              single && isCurrentClient
                ? vtKey === 'butterchurn'
                  ? butterchurnConfig
                  : visualizerConfigs?.[vtKey] || {}
                : vtKey === 'butterchurn'
                  ? optimisticConfig && Object.keys(optimisticConfig).length > 0
                    ? optimisticConfig
                    : butterchurnConfig
                  : optimisticConfig && Object.keys(optimisticConfig).length > 0
                    ? optimisticConfig
                    : visualizerConfigs?.[vtKey] || {}
            )}
            model={
              single && isCurrentClient
                ? vtKey === 'butterchurn'
                  ? butterchurnConfig
                  : visualizerConfigs?.[vtKey] || {}
                : optimisticConfig && Object.keys(optimisticConfig).length > 0
                  ? optimisticConfig
                  : vtKey === 'butterchurn'
                    ? butterchurnConfig
                    : visualizerConfigs?.[vtKey] || {}
            }
            hideToggle
            onModelChange={(update) => {
              if (single && !isCurrentClient && typeof name === 'string') {
                updateVisualizerConfigOptimistic(instanceKey, {
                  configs: {
                    ...localState?.configs,
                    [vtKey]: {
                      ...localState?.configs?.[vtKey],
                      ...update
                    }
                  }
                })
                // Also send config to remote instance
                handleMultiClientAction(null, 'set_visual_config', {
                  visualizerId: vtKey,
                  config: {
                    ...localState?.configs?.[vtKey],
                    ...update
                  }
                })
              } else {
                handleConfigChange(single ? vtKey : globalVisualType, update)
              }
            }}
          />
        )}
      </Collapse>
      <Tooltip
        sx={{ position: 'absolute', top: single ? 0 : 12, right: single ? 0 : 8 }}
        title={showConfig ? 'Hide Config panel' : 'Show Config panel'}
      >
        <IconButton
          key="config-panel"
          size="medium"
          onClick={() => setShowConfig(!showConfig)}
          color={showConfig ? 'info' : 'default'}
        >
          {showConfig ? (
            <Close key="close-config-panel" fontSize="medium" />
          ) : (
            <ExpandMore key="show-config-panel" fontSize="medium" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default VisualizerConfig
