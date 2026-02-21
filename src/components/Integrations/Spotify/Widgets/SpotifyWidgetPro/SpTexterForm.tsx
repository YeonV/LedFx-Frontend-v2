import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'

import useStore from '../../../../../store/useStore'
import { useWebSocket } from '../../../../../utils/Websocket/WebSocketProvider'
import { Ledfx } from '../../../../../api/ledfx'
import { useVStore, type VState } from '../../../../../hooks/vStore'
import AutoApplySelector from './AutoApplySelector'
import CardStack from '../SongDetector/CardStack'

const SpTexterForm = ({ generalDetector }: { generalDetector?: boolean }) => {
  const schemas = useStore((state) => state.schemas)
  const virtuals = useStore((state) => state.virtuals)
  const clients = useStore((state) => state.clients)
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const spotifyTexter = useStore((state) => state.spotify.spotifyTexter)
  const sendSpotifyTrack = useStore((state) => state.spotify.sendSpotifyTrack)
  const colors = useStore((state) => state.colors)

  const setSpTexterTextColor = useStore((state) => state.setSpTexterTextColor)
  const setSpTexterFlipVertical = useStore((state) => state.setSpTexterFlipVertical)
  const setSpTexterFlipHorizontal = useStore((state) => state.setSpTexterFlipHorizontal)
  const setSpTexterUseGradient = useStore((state) => state.setSpTexterUseGradient)
  const setSpTexterAlpha = useStore((state) => state.setSpTexterAlpha)
  const setSpTexterBackground = useStore((state) => state.setSpTexterBackground)
  const setSpTexterGradient = useStore((state) => state.setSpTexterGradient)
  const setSpTexterGradientRoll = useStore((state) => state.setSpTexterGradientRoll)
  const setSpTexterRotate = useStore((state) => state.setSpTexterRotate)
  const setSpTexterHeightPercent = useStore((state) => state.setSpTexterHeightPercent)
  const setSpTexterBrightness = useStore((state) => state.setSpTexterBrightness)
  const setSpTexterSpeed = useStore((state) => state.setSpTexterSpeed)
  const setSpTexterBackgroundBrightness = useStore((state) => state.setSpTexterBackgroundBrightness)
  const setSpTexterFont = useStore((state) => state.setSpTexterFont)
  const setSpTexterTextEffect = useStore((state) => state.setSpTexterTextEffect)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  // VStore actions for global/main instance
  const updateVisualizerConfig = useVStore((state: VState) => state.updateVisualizerConfig)
  // Use global state for song detector
  const textAutoApplyGlobal = useStore((state) => state.textAutoApply)
  const textVirtualsGlobal = useStore((state) => state.textVirtuals)
  const setTextAutoApply = useStore((state) => state.setTextAutoApply)
  const setTextVirtuals = useStore((state) => state.setTextVirtuals)

  // Local state for non-song-detector mode
  const [textVirtualsLocal, setTextVirtualsLocal] = useState<string[]>([])
  const [isActiveLocal, setIsActiveLocal] = useState(false)

  // Visualiser selection state (Zustand store)
  const visualisersGlobal = useStore((state) => state.textVisualisers || [])
  const setTextVisualisers = useStore((state) => state.setTextVisualisers)
  // Local visualiser state for non-global mode
  const [visualisersLocal, setVisualisersLocal] = useState<string[]>([])

  // Use global or local state for visualisers
  const textVisualisers = generalDetector ? visualisersGlobal : visualisersLocal

  // Dedicated isActive and toggle for visualisers (from store)
  const isActiveVisualisers = useStore((state) => state.isActiveVisualisers)
  const setIsActiveVisualisers = useStore((state) => state.setIsActiveVisualisers)
  const toggleAutoApplyVisualisers = () => {
    setIsActiveVisualisers(!isActiveVisualisers)
  }

  // Determine which state to use based on generalDetector prop
  const textVirtuals = generalDetector ? textVirtualsGlobal : textVirtualsLocal
  const isActive = generalDetector ? textAutoApplyGlobal : isActiveLocal

  const matrix = Object.keys(virtuals).filter((v: string) => (virtuals[v].config.rows || 1) > 1)

  useEffect(() => {
    // Only apply if visualiser auto-apply is active
    if (isActiveVisualisers && currentTrack !== '' && textVirtuals.length > 0) {
      setTimeout(() => {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global_effect',
          type: 'texter2d',
          config: { ...spotifyTexter, text: currentTrack },
          fallback: spotifyTexter.fallback,
          virtuals: textVirtuals
        }).then(() => getVirtuals())
        // Map selected names to IDs for isCurrentClient
        // For each selected visualiser, update config (main and subs)
        textVisualisers.forEach((name) => {
          const id = nameToId[name]
          const isCurrent = clientIdentity?.clientId === id
          applyTextVisualiser(
            { text: currentTrack, height_percent: 10, width_percent: 200 },
            true,
            isCurrent,
            'texter',
            'texter',
            {
              configs: {}
            }
          )
        })
      }, 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentTrack,
    sendSpotifyTrack,
    spotifyTexter,
    textVirtuals,
    isActiveVisualisers,
    textVisualisers
  ])

  const handleTextVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    if (generalDetector) {
      setTextVirtuals(selected)
    } else {
      setTextVirtualsLocal(selected)
    }
  }

  const applyText = async () => {
    if (textVirtuals.length > 0 && currentTrack) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'texter2d',
        config: { ...spotifyTexter, text: currentTrack },
        fallback: spotifyTexter.fallback,
        virtuals: textVirtuals
      })
      getVirtuals()
    }
  }
  // Apply effect to selected visualisers (clients) using multi-client aware logic

  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const { send, isConnected } = useWebSocket()

  const handleMultiClientAction = (
    localAction: (() => void) | null,
    remoteAction: string,
    extraPayload: Record<string, any> = {}
  ) => {
    if (!clientIdentity || !clientIdentity.clientId) return
    // Map selected names to IDs for all usages
    const selectedIds = textVisualisers.map((name: string) => nameToId[name]).filter(Boolean)
    // Local for current instance
    if (selectedIds.includes(clientIdentity.clientId) && localAction) {
      localAction()
    }
    // Broadcast for others
    const otherClients = selectedIds.filter((id: string) => id !== clientIdentity.clientId)

    if (otherClients.length && broadcastToClients && isConnected) {
      broadcastToClients(
        {
          broadcast_type: 'custom',
          // target: { mode: 'all' },
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

  // Apply effect to selected visualisers (clients)
  // Apply effect to selected visualisers (clients)
  const applyTextVisualiser = (
    update: Record<string, any>,
    single: boolean,
    isCurrentClient: boolean,
    visualType: string,
    globalVisualType: string,
    localState: any
  ) => {
    // Get the current name and id
    const name = clientIdentity?.name || 'unknown-client'
    // Main (current/global): use vstore for config update
    if (single && isCurrentClient) {
      updateVisualizerConfig(visualType, update)
      // Always update optimistic config for main instance as well
      updateVisualizerConfigOptimistic(name, {
        configs: {
          ...localState?.configs,
          [visualType]: {
            ...localState?.configs?.[visualType],
            ...update
          }
        }
      })
    } else if (single && typeof name === 'string') {
      // Sub: only update optimistic config and broadcast
      updateVisualizerConfigOptimistic(name, {
        configs: {
          ...localState?.configs,
          [visualType]: {
            ...localState?.configs?.[visualType],
            ...update
          }
        }
      })
      handleMultiClientAction(null, 'set_visual_config', {
        visualizerId: visualType,
        config: {
          ...localState?.configs?.[visualType],
          ...update
        }
      })
    }
  }

  // Config change handler for main/global instance (not used, handled in applyTextVisualiser)
  // const handleConfigChange = (visualizerId: string, update: any) => {}

  const toggleAutoApply = () => {
    if (isActive) {
      if (generalDetector) {
        setTextAutoApply(false)
      } else {
        setIsActiveLocal(false)
      }
    } else {
      applyText()
      // applyTextVisualiser()
      if (generalDetector) {
        setTextAutoApply(true)
      } else {
        setIsActiveLocal(true)
      }
    }
  }

  // Build a name-to-id map for all current clients
  const nameToId = clients
    ? Object.entries(clients).reduce(
        (acc, [id, data]) => {
          if (data && data.name) acc[data.name] = id
          return acc
        },
        {} as Record<string, string>
      )
    : {}

  // textVisualisers now stores names instead of IDs
  // Filter out stale names not in current clients
  const filteredTextVisualisers = textVisualisers.filter((name: string) => nameToId[name])

  // Auto-cleanup state if stale names are present
  useEffect(() => {
    if (filteredTextVisualisers.length !== textVisualisers.length) {
      setTextVisualisers(filteredTextVisualisers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, textVisualisers])

  // Handler: convert selected names to state
  const handleTextVisualiserChangeByName = (event: any) => {
    const value = event.target.value
    if (generalDetector) {
      setTextVisualisers(typeof value === 'string' ? value.split(',') : value)
    } else {
      setVisualisersLocal(typeof value === 'string' ? value.split(',') : value)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        flex: 1
      }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Text Configuration (virtuals only)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                '& .color-picker-panel, & .popup_tabs-header, & .popup_tabs, & .colorpicker, & .colorpicker .color-picker-panel, & .popup_tabs-header .popup_tabs-header-label-active':
                  { backgroundColor: 'transparent' }
              }}
            >
              {spotifyTexter.use_gradient ? (
                <GradientPicker
                  isGradient={true}
                  colors={colors}
                  title={'Gradient'}
                  pickerBgColor={spotifyTexter.gradient}
                  sendColorToVirtuals={(v: string) => setSpTexterGradient(v)}
                />
              ) : (
                <GradientPicker
                  isGradient={false}
                  colors={colors}
                  title={'Text Color'}
                  pickerBgColor={spotifyTexter.text_color}
                  sendColorToVirtuals={(v: string) => setSpTexterTextColor(v)}
                />
              )}
              <GradientPicker
                isGradient={false}
                colors={colors}
                title={'BG Color'}
                pickerBgColor={spotifyTexter.background_color}
                sendColorToVirtuals={(v: string) => setSpTexterBackground(v)}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <BladeFrame title="Brightness" style={{ width: '50%' }}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  valueLabelDisplay="auto"
                  value={spotifyTexter.brightness}
                  onChange={(_e, v) => typeof v === 'number' && setSpTexterBrightness(v)}
                />
              </BladeFrame>
              <BladeFrame title="BG Brightness" style={{ width: '50%' }}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  valueLabelDisplay="auto"
                  value={spotifyTexter.background_brightness}
                  onChange={(_e, v) => typeof v === 'number' && setSpTexterBackgroundBrightness(v)}
                />
              </BladeFrame>
            </Stack>
            <Stack direction="row" spacing={1}>
              {/* all booleans */}
              <BladeFrame style={{ width: '25%' }} title="Gradient">
                <Switch
                  checked={spotifyTexter.use_gradient}
                  onChange={(_e, b) => setSpTexterUseGradient(b)}
                  name={'Gradient'}
                  color="primary"
                />
              </BladeFrame>
              <BladeFrame style={{ width: '25%' }} title="Alpha">
                <Switch
                  checked={spotifyTexter.alpha}
                  onChange={(_e, b) => setSpTexterAlpha(b)}
                  name={'Alpha'}
                  color="primary"
                />
              </BladeFrame>
              <BladeFrame style={{ width: '25%' }} title="Flip H">
                <Switch
                  checked={spotifyTexter.flip_horizontal}
                  onChange={(_e, b) => setSpTexterFlipHorizontal(b)}
                  name={'Flip Hl'}
                  color="primary"
                />
              </BladeFrame>
              <BladeFrame style={{ width: '25%' }} title="Flip V">
                <Switch
                  checked={spotifyTexter.flip_vertical}
                  onChange={(_e, b) => setSpTexterFlipVertical(b)}
                  name={'Flip V'}
                  color="primary"
                />
              </BladeFrame>
            </Stack>
            <Stack direction="row" spacing={1}>
              <BladeFrame title="Gradient Roll" style={{ width: '50%' }}>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  valueLabelDisplay="auto"
                  value={spotifyTexter.gradient_roll}
                  onChange={(_e, v) => typeof v === 'number' && setSpTexterGradientRoll(v)}
                />
              </BladeFrame>
              <BladeFrame title="Rotate" style={{ width: '50%' }}>
                <Slider
                  min={0}
                  max={3}
                  step={1}
                  valueLabelDisplay="auto"
                  value={spotifyTexter.rotate}
                  onChange={(_e, v) => typeof v === 'number' && setSpTexterRotate(v)}
                />
              </BladeFrame>
            </Stack>
            <Stack direction="row" spacing={1}>
              <BladeFrame title="Speed" style={{ width: '50%' }}>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  valueLabelDisplay="auto"
                  value={spotifyTexter.speed_option_1}
                  onChange={(_e, v) => typeof v === 'number' && setSpTexterSpeed(v)}
                />
              </BladeFrame>
              <BladeFrame title="Height %" style={{ width: '50%' }}>
                <Slider
                  min={0}
                  max={150}
                  step={1}
                  valueLabelDisplay="auto"
                  value={spotifyTexter.height_percent}
                  onChange={(_e, v) => typeof v === 'number' && setSpTexterHeightPercent(v)}
                />
              </BladeFrame>
            </Stack>
            <Stack direction="row" spacing={1}>
              <BladeFrame title="Font" style={{ width: '50%' }}>
                <Select
                  fullWidth
                  variant="standard"
                  disableUnderline
                  value={spotifyTexter.font}
                  onChange={(e) => setSpTexterFont(e.target.value)}
                >
                  {schemas.effects.texter2d.schema.properties.font.enum.map((f: string) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </Select>
              </BladeFrame>
              <BladeFrame title="Text Effect" style={{ width: '50%' }}>
                <Select
                  fullWidth
                  variant="standard"
                  disableUnderline
                  value={spotifyTexter.text_effect}
                  onChange={(e) => setSpTexterTextEffect(e.target.value)}
                >
                  {schemas.effects.texter2d.schema.properties.text_effect.enum.map((f: string) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </Select>
              </BladeFrame>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <CardStack>
        <AutoApplySelector
          label="Text Virtuals"
          options={matrix}
          value={textVirtuals}
          onChange={handleTextVirtualChange}
          isActive={isActive}
          onToggle={toggleAutoApply}
          disabled={textVirtuals.length === 0}
        />
        <AutoApplySelector
          label="Text Visualisers"
          options={clients ? Object.entries(clients) : []}
          value={generalDetector ? filteredTextVisualisers : textVisualisers}
          onChange={handleTextVisualiserChangeByName}
          isActive={isActiveVisualisers}
          onToggle={toggleAutoApplyVisualisers}
          disabled={textVisualisers.length === 0}
          getOptionLabel={([, data]) => data?.name || ''}
          getOptionValue={([, data]) => data?.name || ''}
          renderValue={(selected) => selected.join(', ')}
        />
      </CardStack>
    </Box>
  )
}

export default SpTexterForm
