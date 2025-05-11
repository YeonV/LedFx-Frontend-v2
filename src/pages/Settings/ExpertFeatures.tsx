import { Input } from '@mui/material'
import { SettingsRow, SettingsSlider } from './SettingsComponents'
import useStore from '../../store/useStore'
import useSliderStyles from '../../components/SchemaForm/components/Number/BladeSlider.styles'
import LogColorFilterSelect from './LogFilterSelect'

const ExpertFeatures = () => {
  const sliderClasses = useSliderStyles()

  const setFeatures = useStore((state) => state.setFeatures)
  const showFeatures = useStore((state) => state.showFeatures)
  const features = useStore((state) => state.features)
  const keybinding = useStore((state) => state.ui.keybinding)
  const setKeybinding = useStore((state) => state.ui.setKeybinding)

  const updateNotificationInterval = useStore((state) => state.updateNotificationInterval)
  const setUpdateNotificationInterval = useStore((state) => state.setUpdateNotificationInterval)
  return (
    <>
      {showFeatures.cloud && (
        <SettingsRow
          title="LedFx Cloud"
          checked={features.cloud}
          onChange={() => setFeatures('cloud', !features.cloud)}
        />
      )}
      {showFeatures.webaudio && (
        <SettingsRow
          title="WebAudio"
          checked={features.webaudio}
          onChange={() => setFeatures('webaudio', !features.webaudio)}
        />
      )}
      <SettingsRow title="Update Notification: wait min">
        <SettingsSlider
          value={updateNotificationInterval}
          step={1}
          min={1}
          max={4320}
          onChange={(_e: any, val: number) => setUpdateNotificationInterval(val)}
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
      <SettingsRow
        title="Spotify Embedded Player (old)"
        checked={features.spotify}
        onChange={() => setFeatures('spotify', !features.spotify)}
      />

      <SettingsRow
        title="BG Waves (eats performance)"
        checked={features.waves}
        onChange={() => setFeatures('waves', !features.waves)}
      />
      <SettingsRow
        title="Keybindings (CTRL+SPACE)"
        checked={keybinding}
        onChange={() => setKeybinding(!keybinding)}
      />
      <SettingsRow title="Log Filtering">
        <LogColorFilterSelect />
      </SettingsRow>
    </>
  )
}

export default ExpertFeatures
