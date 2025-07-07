import { useEffect, useState } from 'react'
import { Input, Divider, Select, MenuItem, Tooltip, useTheme } from '@mui/material'
import { SettingsSlider, SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'
import useSliderStyles from '../../components/SchemaForm/components/Number/BladeSlider.styles'
import { PixelGraphVariants } from '../../store/ui-persist/storeUIpersist'
import { InfoRounded } from '@mui/icons-material'

const PixelGraphsSettingsCard = () => {
  const sliderClasses = useSliderStyles()

  const config = useStore((state) => state.config)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const showFeatures = useStore((state) => state.showFeatures)
  const showWarning = useStore((state) => state.uiPersist.warnings.lessPixels)
  const virtual2dLimit = useStore((state) => state.ui.virtual2dLimit)
  const setVirtual2dLimit = useStore((state) => state.ui.setVirtual2dLimit)
  const setShowWarning = useStore((state) => state.setWarnings)
  const setPixelGraphSettings = useStore((state) => state.setPixelGraphSettings)
  const variants = useStore((state) => state.uiPersist.pixelGraphSettings?.variants)
  const [fps, setFps] = useState(30)
  const [pixelLength, setPixelLength] = useState(50)
  const [uiBrightnessBoost, setUiBrightnessBoost] = useState(0)
  const expertMode = useStore((state) => state.viewMode) === 'expert'
  const theme = useTheme()

  const marks = [
    { value: 'select', label: 'select' },
    { value: 50, label: '50' },
    { value: 128, label: '128' },
    { value: 256, label: '256' },
    { value: 512, label: '512' },
    { value: 1024, label: '1K' },
    { value: 2048, label: '2K' },
    { value: 4096, label: '4K' },
    { value: 8192, label: '8K' },
    { value: 16384, label: '16K' },
    { value: 32768, label: '32K' },
    { value: 65535, label: '64K' }
  ]
  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  useEffect(() => {
    if (typeof config.visualisation_fps === 'number') {
      setFps(config.visualisation_fps)
    }
    if (typeof config.visualisation_maxlen === 'number') {
      setPixelLength(config.visualisation_maxlen)
    }
    if (typeof config.ui_brightness_boost === 'number') {
      setUiBrightnessBoost(config.ui_brightness_boost)
    }
  }, [config])

  useEffect(() => {
    getSystemConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schemaTransmissionMode = useStore(
    (state) => state?.schemas?.core?.schema.properties.transmission_mode
  )

  return (
    <>
      <SettingsRow title="Graphs" step="zero" alpha>
        <Select
          sx={{ width: 150 }}
          disableUnderline
          value={variants}
          onChange={(e) => setPixelGraphSettings('variants', e.target.value)}
        >
          {PixelGraphVariants.map((variant) => (
            <MenuItem key={variant} value={variant}>
              {variant}
            </MenuItem>
          ))}
        </Select>
      </SettingsRow>
      <SettingsRow title={schemaTransmissionMode?.title} step="zero">
        <Select
          disableUnderline
          variant="standard"
          defaultValue={config.transmission_mode || schemaTransmissionMode?.default || 'compressed'}
          onChange={(e) => setSystemSetting('transmission_mode', e.target.value)}
        >
          {schemaTransmissionMode?.enum?.map((item: any) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </SettingsRow>
      <SettingsRow title="Frontend Pixels" step="three">
        <Tooltip title="Use of high pixel counts in front end visualisation is strongly discouraged, and should not be used if access to the browser front end is from a client remote to the LedFx server.">
          <InfoRounded
            sx={{
              color: pixelLength > 4096 ? theme.palette.warning.main : 'inherit',
              cursor: 'pointer',
              verticalAlign: 'middle',
              mr: 2,
              fontSize: '1.2rem'
            }}
          />
        </Tooltip>

        <Select
          disableUnderline
          variant="standard"
          value={expertMode ? 'select' : pixelLength}
          sx={{
            color: pixelLength > 4096 ? theme.palette.warning.main : 'inherit'
          }}
          onChange={(e) =>
            e.target.value !== 'select' && setSystemSetting('visualisation_maxlen', e.target.value)
          }
        >
          {marks.map((item: any) => (
            <MenuItem
              disabled={item.value === 'select'}
              key={item.value}
              value={item.value}
              sx={{ color: item.value > 4096 ? theme.palette.warning.main : 'inherit' }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {expertMode && (
          <Input
            disableUnderline
            className={sliderClasses.input}
            value={pixelLength}
            style={{ width: 70 }}
            margin="dense"
            onChange={(e) => {
              setPixelLength(parseInt(e.target.value, 10))
            }}
            onBlur={(e) => setSystemSetting('visualisation_maxlen', parseInt(e.target.value, 10))}
            sx={{
              '& input': {
                textAlign: 'right',
                color: pixelLength > 4096 ? theme.palette.warning.main : 'inherit'
              }
            }}
            inputProps={{
              min: 1,
              max: 65536,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        )}
      </SettingsRow>
      <SettingsRow title="Frontend FPS" step="two">
        <SettingsSlider
          value={fps}
          step={1}
          min={1}
          max={60}
          onChangeCommitted={(_e: any, val: any) => setSystemSetting('visualisation_fps', val)}
          onChange={(_e: any, val: any) => {
            setFps(val)
          }}
        />
        <Input
          disableUnderline
          className={sliderClasses.input}
          style={{ width: 70 }}
          value={fps}
          margin="dense"
          onChange={(e) => {
            setFps(parseInt(e.target.value, 10))
          }}
          onBlur={(e) => {
            setSystemSetting('visualisation_fps', parseInt(e.target.value, 10))
          }}
          sx={{
            '& input': { textAlign: 'right' }
          }}
          inputProps={{
            min: 1,
            max: 60,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
        />
      </SettingsRow>
      <SettingsRow title="Frontend Brightness Boost">
        <SettingsSlider
          value={uiBrightnessBoost}
          step={0.01}
          valueLabelDisplay="auto"
          min={0}
          max={1}
          marks={[{ value: 300, label: null }]}
          onChangeCommitted={(_e: any, val: any) => setSystemSetting('ui_brightness_boost', val)}
          onChange={(_e: any, val: any) => {
            setUiBrightnessBoost(val)
          }}
        />
        <Input
          disableUnderline
          className={sliderClasses.input}
          value={uiBrightnessBoost}
          style={{ width: 70 }}
          margin="dense"
          onChange={(e) => {
            setUiBrightnessBoost(parseInt(e.target.value, 10))
          }}
          onBlur={(e) => setSystemSetting('ui_brightness_boost', parseInt(e.target.value, 10))}
          sx={{
            '& input': { textAlign: 'right' }
          }}
          inputProps={{
            min: 0,
            max: 1,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
        />
      </SettingsRow>
      <SettingsRow
        title="Show too-less-pixels Warning"
        checked={showWarning}
        onChange={() => setShowWarning('lessPixels', !showWarning)}
      />
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />

      {showFeatures.alpha && (
        <>
          <SettingsRow title="2D Virtual Limit" step="three">
            <Input
              disableUnderline
              className={sliderClasses.input}
              defaultValue={virtual2dLimit}
              style={{ width: 70 }}
              margin="dense"
              onChange={(e) => {
                setPixelLength(parseInt(e.target.value, 10))
              }}
              onBlur={(e) => setVirtual2dLimit(parseInt(e.target.value, 10))}
              sx={{
                '& input': { textAlign: 'right' }
              }}
              inputProps={{
                min: 1,
                max: 4096,
                type: 'number',
                'aria-labelledby': 'input-slider'
              }}
            />
          </SettingsRow>
          <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
        </>
      )}
    </>
  )
}

export default PixelGraphsSettingsCard
