import useStore from '../../store/useStore'
import LogColorFilterSelect from './LogFilterSelect'
import { SettingsRow } from './SettingsComponents'
// import VisualizerDevWidget from './VisualizerDevWidget'
import VisualizerDevWidgetYZ from './VisualizerDevWidgetYZ'

const Uncategorized = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const setBlenderAutomagic = useStore((state) => state.setBlenderAutomagic)

  return (
    <>
      <SettingsRow
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
        title="MIDI Support"
        checked={features.scenemidi}
        onChange={() => setFeatures('scenemidi', !features.scenemidi)}
      />
      <SettingsRow
        beta
        title="WebAudio"
        checked={features.webaudio}
        onChange={() => setFeatures('webaudio', !features.webaudio)}
      />
      <SettingsRow
        beta
        title="Wakelock"
        checked={features.wakelock}
        onChange={() => setFeatures('wakelock', !features.wakelock)}
      />
      <SettingsRow
        beta
        title="Matrix Cam"
        checked={features.matrix_cam}
        onChange={() => setFeatures('matrix_cam', !features.matrix_cam)}
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
      <SettingsRow
        beta
        title="BG Visualiser (eats performance)"
        checked={features.bgvisualiser}
        onChange={() => setFeatures('bgvisualiser', !features.bgvisualiser)}
        info={'BG Visualiser will disable Playground'}
      />
      {features.bgvisualiser && <VisualizerDevWidgetYZ />}
      <SettingsRow
        alpha
        title="LedFx Cloud"
        checked={features.cloud}
        onChange={() => setFeatures('cloud', !features.cloud)}
      />
      <SettingsRow
        alpha
        title="Fire TV Support"
        checked={features.firetv}
        onChange={() => setFeatures('firetv', !features.firetv)}
      />
      <SettingsRow
        alpha
        title="Use Blender Automagic"
        checked={blenderAutomagic}
        onChange={() => setBlenderAutomagic(!blenderAutomagic)}
      />
      <SettingsRow alpha title="Log Filtering">
        <LogColorFilterSelect />
      </SettingsRow>
    </>
  )
}

export default Uncategorized
