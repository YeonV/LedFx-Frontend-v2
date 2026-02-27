import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
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
import { getVStore } from '../../../../../hooks/vStore'
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
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const { send, isConnected } = useWebSocket()

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
  const isActiveVisualisersGlobal = useStore((state) => state.isActiveVisualisers)
  const setIsActiveVisualisersGlobal = useStore((state) => state.setIsActiveVisualisers)
  const [isActiveVisualisersLocal, setIsActiveVisualisersLocal] = useState(false)

  const isActiveVisualisers = generalDetector ? isActiveVisualisersGlobal : isActiveVisualisersLocal

  const toggleAutoApplyVisualisers = () => {
    if (generalDetector) {
      setIsActiveVisualisersGlobal(!isActiveVisualisersGlobal)
    } else {
      setIsActiveVisualisersLocal(!isActiveVisualisersLocal)
    }
  }

  // Determine which state to use based on generalDetector prop
  const textVirtuals = generalDetector ? textVirtualsGlobal : textVirtualsLocal
  const isActive = generalDetector ? textAutoApplyGlobal : isActiveLocal

  const matrix = Object.keys(virtuals).filter((v: string) => (virtuals[v].config.rows || 1) > 1)

  // Build a name-to-id map for all current clients
  const nameToId = useMemo(
    () =>
      clients
        ? Object.entries(clients).reduce(
            (acc, [id, data]) => {
              if (data && data.name) acc[data.name] = id
              return acc
            },
            {} as Record<string, string>
          )
        : {},
    [clients]
  )

  const applyVisualiserConfig = useCallback(
    (selectedVisualisers: string[], visualizerId: string, update: Record<string, any>) => {
      const name = clientIdentity?.name || 'unknown-client'
      const selectedIds = selectedVisualisers.map((n) => nameToId[n]).filter(Boolean)
      const isCurrentClient = clientIdentity && selectedIds.includes(clientIdentity.clientId || '')

      if (isCurrentClient) {
        const vStore = getVStore()
        const vState = vStore?.getState()
        const targetId = visualizerId === 'active' ? vState?.visualType : visualizerId
        if (targetId) {
          if (targetId === 'butterchurn') {
            vState?.updateButterchurnConfig?.(update)
          } else {
            vState?.updateVisualizerConfig?.(targetId, update)
          }
          updateVisualizerConfigOptimistic(name, {
            configs: {
              [targetId]: update
            }
          })
        }
      }

      const otherClients = selectedIds.filter((id) => id !== clientIdentity?.clientId)
      if (otherClients.length && broadcastToClients && isConnected) {
        broadcastToClients(
          {
            broadcast_type: 'custom',
            target: { mode: 'uuids', uuids: otherClients },
            payload: {
              category: 'visualiser',
              action: 'set_visual_config',
              visualizerId,
              config: update
            }
          },
          send
        )
      }
    },
    [
      clientIdentity,
      nameToId,
      updateVisualizerConfigOptimistic,
      broadcastToClients,
      isConnected,
      send
    ]
  )

  const prevTrackRef = useRef<string>('')
  const prevIsActiveVirtRef = useRef<boolean>(false)
  const prevIsActiveVisRef = useRef<boolean>(false)

  useEffect(() => {
    const hasChanges =
      currentTrack !== prevTrackRef.current ||
      isActive !== prevIsActiveVirtRef.current ||
      isActiveVisualisers !== prevIsActiveVisRef.current

    prevTrackRef.current = currentTrack
    prevIsActiveVirtRef.current = isActive
    prevIsActiveVisRef.current = isActiveVisualisers

    if (!hasChanges || currentTrack === '') return

    const timer = setTimeout(() => {
      if (isActive && textVirtuals.length > 0) {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global_effect',
          type: 'texter2d',
          config: { ...spotifyTexter, text: currentTrack },
          fallback: spotifyTexter.fallback,
          virtuals: textVirtuals
        }).then(() => getVirtuals())
      }
      if (isActiveVisualisers && textVisualisers.length > 0) {
        applyVisualiserConfig(textVisualisers, 'bladeTexter', {
          text: currentTrack.split(' - ')[0] || '',
          text2: currentTrack.split(' - ')[1] || currentTrack.split(' - ')[0] || currentTrack,
          height_percent: 10,
          width_percent: 200,
          speed_option_1: 0.1,
          offset_y2: 0.2,
          offset_y: -0.2,
          font: 'Stop',
          font2: 'technique'
        })
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [
    currentTrack,
    sendSpotifyTrack,
    spotifyTexter,
    textVirtuals,
    isActiveVisualisers,
    textVisualisers,
    isActive,
    applyVisualiserConfig,
    getVirtuals
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

  const toggleAutoApply = () => {
    if (isActive) {
      if (generalDetector) {
        setTextAutoApply(false)
      } else {
        setIsActiveLocal(false)
      }
    } else {
      applyText()
      if (generalDetector) {
        setTextAutoApply(true)
      } else {
        setIsActiveLocal(true)
      }
    }
  }

  const filteredTextVisualisers = textVisualisers.filter((name: string) => nameToId[name])

  useEffect(() => {
    if (filteredTextVisualisers.length !== textVisualisers.length) {
      setTextVisualisers(filteredTextVisualisers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, textVisualisers])

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
