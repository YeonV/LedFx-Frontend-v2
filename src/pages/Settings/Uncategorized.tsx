import useStore from '../../store/useStore'
import LogColorFilterSelect from './LogFilterSelect'
import { SettingsRow, SettingsSwitch } from './SettingsComponents'
// import VisualizerDevWidget from './VisualizerDevWidget'
import VisualizerDevWidgetYZ from './VisualizerDevWidgetYZ'
import { Box, TextField } from '@mui/material'

const Uncategorized = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const setBlenderAutomagic = useStore((state) => state.setBlenderAutomagic)

  // Offscreen capture state
  const offscreenCaptureEnabled = useStore(
    (state) => state.uiPersist.offscreenCapture?.enabled ?? false
  )
  const offscreenCaptureShowPreview = useStore(
    (state) => state.uiPersist.offscreenCapture?.showPreview ?? false
  )
  const setOffscreenCapture = useStore((state) => state.setOffscreenCapture)
  const offscreenCaptureWidth = useStore((state) => state.uiPersist.offscreenCapture?.width ?? 128)
  const offscreenCaptureHeight = useStore(
    (state) => state.uiPersist.offscreenCapture?.height ?? 128
  )
  const offscreenCaptureFps = useStore((state) => state.uiPersist.offscreenCapture?.fps ?? 30)

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
        beta
        title="BG Visualiser (eats performance)"
        checked={features.bgvisualiser}
        onChange={() => setFeatures('bgvisualiser', !features.bgvisualiser)}
        info={'BG Visualiser will disable Playground'}
      />
      {features.bgvisualiser && (
        <>
          <VisualizerDevWidgetYZ />
          <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <SettingsRow title="BG Visualiser to Frontend Effect">
              <SettingsSwitch
                checked={offscreenCaptureEnabled}
                onChange={(e) => setOffscreenCapture('enabled', e.target.checked)}
              />
            </SettingsRow>

            {offscreenCaptureEnabled && (
              <>
                <SettingsRow title="Capture Resolution">
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label="Width"
                      type="number"
                      size="small"
                      value={offscreenCaptureWidth}
                      onChange={(e) =>
                        setOffscreenCapture('width', parseInt(e.target.value) || 128)
                      }
                      inputProps={{ min: 1, max: 1024 }}
                      sx={{ width: 100 }}
                    />
                    <span>×</span>
                    <TextField
                      label="Height"
                      type="number"
                      size="small"
                      value={offscreenCaptureHeight}
                      onChange={(e) =>
                        setOffscreenCapture('height', parseInt(e.target.value) || 128)
                      }
                      inputProps={{ min: 1, max: 1024 }}
                      sx={{ width: 100 }}
                    />
                  </Box>
                </SettingsRow>

                <SettingsRow title="Capture FPS">
                  <TextField
                    type="number"
                    size="small"
                    value={offscreenCaptureFps}
                    onChange={(e) => setOffscreenCapture('fps', parseInt(e.target.value) || 30)}
                    inputProps={{ min: 1, max: 120 }}
                    sx={{ width: 100 }}
                  />
                </SettingsRow>

                <SettingsRow title="Show Debug Preview">
                  <SettingsSwitch
                    checked={offscreenCaptureShowPreview}
                    onChange={(e) => setOffscreenCapture('showPreview', e.target.checked)}
                  />
                </SettingsRow>
              </>
            )}
          </Box>
        </>
      )}
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
