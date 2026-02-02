import useStore from '../../store/useStore'
import LogColorFilterSelect from './LogFilterSelect'
import { SettingsRow } from './SettingsComponents'

const Uncategorized = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const setBlenderAutomagic = useStore((state) => state.setBlenderAutomagic)
  const showComplex = useStore((state) => state.showComplex)
  const setShowComplex = useStore((state) => state.setShowComplex)

  return (
    <>
      <SettingsRow
        title="Show complex devices"
        checked={showComplex}
        onChange={() => setShowComplex(!showComplex)}
      />
      <SettingsRow
        alpha
        title="Use Blender Automagic"
        checked={blenderAutomagic}
        onChange={() => setBlenderAutomagic(!blenderAutomagic)}
      />
      <SettingsRow
        beta
        title="Wakelock"
        checked={features.wakelock}
        onChange={() => setFeatures('wakelock', !features.wakelock)}
      />
      <SettingsRow
        beta
        title="Integrations (Spotify, MQTT, HA, ...)"
        checked={features.integrations}
        onChange={() => setFeatures('integrations', !features.integrations)}
      />
      {features.integrations && (
        <>
          <SettingsRow
            alpha
            title="Integration: MQTT"
            checked={features.mqtt}
            onChange={() => setFeatures('mqtt', !features.mqtt)}
          />
          <SettingsRow
            beta
            title="Integration: MQTT Home Assistant"
            checked={features.mqtt_hass}
            onChange={() => setFeatures('mqtt_hass', !features.mqtt_hass)}
          />
        </>
      )}
      <SettingsRow
        alpha
        title="LedFx Cloud"
        checked={features.cloud}
        onChange={() => setFeatures('cloud', !features.cloud)}
      />
      <SettingsRow
        beta
        title="WebAudio"
        checked={features.webaudio}
        onChange={() => setFeatures('webaudio', !features.webaudio)}
      />
      <SettingsRow
        beta
        title="Matrix Cam"
        checked={features.matrix_cam}
        onChange={() => setFeatures('matrix_cam', !features.matrix_cam)}
      />
      <SettingsRow
        alpha
        title="Fire TV Support"
        checked={features.firetv}
        onChange={() => setFeatures('firetv', !features.firetv)}
      />
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
      <SettingsRow alpha title="Log Filtering">
        <LogColorFilterSelect />
      </SettingsRow>
    </>
  )
}

export default Uncategorized
