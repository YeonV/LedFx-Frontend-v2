import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  Stack,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import { ExpandMore, PlayArrow, Stop } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import useStore from '../../../../../store/useStore'
import { Ledfx } from '../../../../../api/ledfx'

const SpTexterForm = ({ generalDetector }: { generalDetector?: boolean }) => {
  const schemas = useStore((state) => state.schemas)
  const virtuals = useStore((state) => state.virtuals)
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

  // Use global state for song detector
  const textAutoApplyGlobal = useStore((state) => state.textAutoApply)
  const textVirtualsGlobal = useStore((state) => state.textVirtuals)
  const setTextAutoApply = useStore((state) => state.setTextAutoApply)
  const setTextVirtuals = useStore((state) => state.setTextVirtuals)

  // Local state for non-song-detector mode
  const [textVirtualsLocal, setTextVirtualsLocal] = useState<string[]>([])
  const [isActiveLocal, setIsActiveLocal] = useState(false)

  // Determine which state to use based on generalDetector prop
  const textVirtuals = generalDetector ? textVirtualsGlobal : textVirtualsLocal
  const isActive = generalDetector ? textAutoApplyGlobal : isActiveLocal

  const matrix = Object.keys(virtuals).filter((v: string) => (virtuals[v].config.rows || 1) > 1)

  useEffect(() => {
    console.log('EY', sendSpotifyTrack, currentTrack, textVirtuals)
    const shouldApply = generalDetector ? isActive : sendSpotifyTrack
    if (shouldApply && currentTrack !== '' && textVirtuals.length > 0) {
      setTimeout(() => {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global_effect',
          type: 'texter2d',
          config: { ...spotifyTexter, text: currentTrack },
          fallback: spotifyTexter.fallback,
          virtuals: textVirtuals
        }).then(() => getVirtuals())
      }, 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, sendSpotifyTrack, spotifyTexter, textVirtuals])

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
          <Typography>Text Configuration</Typography>
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
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, flex: 1 }}>
        <FormControl fullWidth>
          <InputLabel>Text Virtuals</InputLabel>
          <Select
            multiple
            value={textVirtuals}
            onChange={handleTextVirtualChange}
            input={<OutlinedInput label="Text Virtuals" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {matrix.map((vId) => (
              <MenuItem key={vId} value={vId}>
                <Checkbox checked={textVirtuals.includes(vId)} />
                <ListItemText primary={vId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title={isActive ? 'Stop Auto' : 'Start Auto'}>
          <IconButton
            onClick={toggleAutoApply}
            disabled={textVirtuals.length === 0}
            sx={{
              color: isActive ? 'success.main' : 'primary.main',
              py: 2
            }}
          >
            {isActive ? <Stop /> : <PlayArrow />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  )
}

export default SpTexterForm
