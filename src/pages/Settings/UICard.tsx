import { useEffect, useState } from 'react'
import { Input, Divider, Select, MenuItem } from '@mui/material'
import { SettingsSlider, SettingsRow } from './SettingsComponents'
import useStore from '../../store/useStore'
import useSliderStyles from '../../components/SchemaForm/components/Number/BladeSlider.styles'

const UICard = () => {
  const sliderClasses = useSliderStyles()

  const config = useStore((state) => state.config)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)
  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const showWarning = useStore((state) => state.uiPersist.warnings.lessPixels)
  const setShowWarning = useStore((state) => state.setWarnings)
  const features = useStore((state) => state.features)
  const updateNotificationInterval = useStore(
    (state) => state.updateNotificationInterval
  )
  const setUpdateNotificationInterval = useStore(
    (state) => state.setUpdateNotificationInterval
  )

  const [fps, setFps] = useState(30)
  const [globalBrightness, setGlobalBrightness] = useState(100)
  const [pixelLength, setPixelLength] = useState(50)
  const [uiBrightnessBoost, setUiBrightnessBoost] = useState(0)
  const marks = [
    { value: 'select', label: 'select' },
    { value: 50, label: '50' },
    { value: 128, label: '128' },
    { value: 256, label: '256' },
    { value: 512, label: '512' },
    { value: 1024, label: '1K' },
    { value: 2048, label: '2K' },
    { value: 4096, label: '4K' },
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
      <SettingsRow title={schemaTransmissionMode?.title} step="zero" value={fps}>
        <Select
          disableUnderline
          variant="standard"
          defaultValue={
            config.transmission_mode ||
            schemaTransmissionMode?.default ||
            'compressed'
          }
          onChange={(e) =>
            setSystemSetting('transmission_mode', e.target.value)
          }
        >
          {schemaTransmissionMode?.enum?.map((item: any) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </SettingsRow>
      <SettingsRow title="Frontend Pixels" step="three" value={pixelLength}>
        <Select
          disableUnderline
          variant="standard"
          value={'select'}
          onChange={(e) =>
            e.target.value !== 'select' && setSystemSetting('visualisation_maxlen', e.target.value)
          }
        >
          {(marks).map((item: any) => (
            <MenuItem disabled={item.value === 'select'} key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <Input
          disableUnderline
          className={sliderClasses.input}
          value={pixelLength}
          style={{ width: 70 }}
          margin="dense"
          onChange={(e) => {
            setPixelLength(parseInt(e.target.value, 10))
          }}
          onBlur={(e) =>
            setSystemSetting(
              'visualisation_maxlen',
              parseInt(e.target.value, 10)
            )
          }
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
      <SettingsRow title="Frontend FPS" step="two" value={fps}>
        <SettingsSlider
          value={fps}
          step={1}
          min={1}
          max={60}
          onChangeCommitted={(_e: any, val: any) =>
            setSystemSetting('visualisation_fps', val)
          }
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
      <SettingsRow title="Frontend Brightness Boost" value={uiBrightnessBoost}>
        <SettingsSlider
          value={uiBrightnessBoost}
          step={0.01}
          valueLabelDisplay="auto"
          min={0}
          max={1}
          marks={[{ value: 300, label: null }]}
          onChangeCommitted={(_e: any, val: any) =>
            setSystemSetting('ui_brightness_boost', val)
          }
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
          onBlur={(e) =>
            setSystemSetting(
              'ui_brightness_boost',
              parseInt(e.target.value, 10)
            )
          }
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
      <SettingsRow title="Show too-less-pixels Warning" checked={showWarning} onChange={() => setShowWarning('lessPixels', !showWarning)}/>
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow title="Global Brightness" step="two" value={globalBrightness}>
        <SettingsSlider
          value={globalBrightness}
          step={1}
          min={0}
          max={100}
          onChangeCommitted={(_e: any, val: any) =>
            setSystemSetting('global_brightness', val / 100)
          }
          onChange={(_e: any, val: any) => {
            setGlobalBrightness(val)
          }}
        />
        <Input
          disableUnderline
          className={sliderClasses.input}
          style={{ width: 70 }}
          value={globalBrightness}
          margin="dense"
          onChange={(e) => {
            setGlobalBrightness(parseInt(e.target.value, 10))
          }}
          onBlur={(e) => {
            setSystemSetting('global_brightness', parseInt(e.target.value, 10))
          }}
          sx={{
            '& input': { textAlign: 'right' }
          }}
          inputProps={{
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
        />
      </SettingsRow>
      <SettingsRow title="Update Notification: wait min" value={updateNotificationInterval}>
        <SettingsSlider
          value={updateNotificationInterval}
          step={1}
          min={1}
          max={4320}
          onChange={(_e: any, val: number) =>
            setUpdateNotificationInterval(val)
          }
        />
        <Input
          disableUnderline
          className={sliderClasses.input}
          style={{ width: 70 }}
          value={updateNotificationInterval}
          margin="dense"
          onChange={(e) => {
            setUpdateNotificationInterval(parseInt(e.target.value, 10))
          }}
          sx={{
            '& input': { textAlign: 'right' }
          }}
          inputProps={{
            min: 1,
            max: 4320,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
        />
      </SettingsRow>
      <Divider sx={{ m: '0.5rem 0 0.25rem 0' }} />
      <SettingsRow title="Expert Mode" checked={viewMode !== 'user'} onChange={() => viewMode === 'user' ? setViewMode('expert') : setViewMode('user')}/>
      {viewMode !== 'user' && (
        <SettingsRow title="Beta Mode" checked={features.beta} onChange={() => setFeatures('beta', !features.beta)} />
      )}
      {showFeatures.alpha && viewMode !== 'user' && (
        <SettingsRow title="Alpha Mode" checked={features.alpha} onChange={() => setFeatures('alpha', !features.alpha)} />
      )}
    </>
  )
}

export default UICard
