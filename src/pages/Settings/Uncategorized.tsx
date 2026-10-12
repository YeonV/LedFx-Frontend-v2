import useStore from '../../store/useStore'
import LogColorFilterSelect from './LogFilterSelect'
import { SettingsRow, SettingsSwitch } from './SettingsComponents'
// import VisualizerDevWidget from './VisualizerDevWidget'
import VisualizerDevWidgetYZ from './VisualizerDevWidgetYZ'
import { useEffect, useState } from 'react'
import { Box, MenuItem, Select, TextField, Typography } from '@mui/material'
import type { SilenceSceneConfig } from '../../store/api/storeConfig'

const Uncategorized = () => {
  const setFeatures = useStore((state) => state.setFeatures)
  const features = useStore((state) => state.features)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const setBlenderAutomagic = useStore((state) => state.setBlenderAutomagic)
  const backendFeatures = useStore((state) => state.backendFeatures)
  const config = useStore((state) => state.config)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const getInfo = useStore((state) => state.getInfo)
  const setCurrentTrack = useStore((state) => state.setCurrentTrack)
  const setThumbnailPath = useStore((state) => state.setThumbnailPath)
  const setPositionData = useStore((state) => state.setPositionData)
  const scenes = useStore((state) => state.scenes)
  const silenceSceneStatus = useStore((state) => state.silenceSceneStatus)
  const silenceSceneAvailable = backendFeatures.silence_scene || silenceSceneStatus !== null

  const silenceSceneConfig: SilenceSceneConfig = config.silence_scene ?? {
    enabled: false,
    scene_id: null,
    timeout_seconds: 5
  }
  const [timeoutSecondsDraft, setTimeoutSecondsDraft] = useState(
    String(silenceSceneConfig.timeout_seconds)
  )

  useEffect(() => {
    setTimeoutSecondsDraft(String(silenceSceneConfig.timeout_seconds))
  }, [silenceSceneConfig.timeout_seconds])

  const updateSilenceSceneConfig = async (updates: Partial<SilenceSceneConfig>) => {
    await setSystemConfig({ silence_scene: { ...silenceSceneConfig, ...updates } })
    await Promise.all([getSystemConfig(), getInfo()])
  }

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
        title="BG Visualiser"
        checked={features.bgvisualiser}
        onChange={() => setFeatures('bgvisualiser', !features.bgvisualiser)}
        info={'Eats performance. Also disables Playground while it is on.'}
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
      {backendFeatures.now_playing && (
        <SettingsRow
          beta
          title="Now Playing"
          info={
            'Lets LedFx read your media session: the track title can be shown on your virtuals, ' +
            'artist and title are sent to MusicBrainz to find cover art, and that art is cached ' +
            'to disk. Off by default. Switching it off stops all of it and deletes the cache.'
          }
          checked={!!config.now_playing_enabled}
          onChange={async () => {
            const next = !config.now_playing_enabled
            await setSystemConfig({ now_playing_enabled: next })
            // getInfo too: the core reports the live state in /api/info, and the
            // Song Detector's engine switches key off it.
            await Promise.all([getSystemConfig(), getInfo()])
            // The core deletes the cached artwork, but the browser goes on
            // rendering the copy it already fetched - a cached <img> is never
            // re-requested, so deleting the file changes nothing on screen.
            // Clearing the path is what actually restores the fallback image,
            // and the track with it, so nothing stale is left behind.
            if (!next) {
              setCurrentTrack('')
              setThumbnailPath('')
              setPositionData({
                position: null,
                duration: null,
                playing: false,
                timestamp: null
              })
            }
          }}
        />
      )}
      {silenceSceneAvailable && (
        <>
          <SettingsRow
            title="Silence Monitoring"
            info="Temporarily applies a scene, or clears and deactivates virtuals, after the configured silent timeout."
          >
            <SettingsSwitch
              checked={silenceSceneConfig.enabled}
              onChange={(event) => updateSilenceSceneConfig({ enabled: event.target.checked })}
            />
          </SettingsRow>
          {silenceSceneConfig.enabled && (
            <Box
              sx={{
                mb: 3,
                ml: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <SettingsRow title="Silence scene">
                <Select
                  size="small"
                  displayEmpty
                  value={silenceSceneConfig.scene_id ?? ''}
                  onChange={(event) =>
                    updateSilenceSceneConfig({ scene_id: event.target.value || null })
                  }
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="">None (Clear and Deactivate)</MenuItem>
                  {Object.entries(scenes).map(([sceneId, scene]) => (
                    <MenuItem key={sceneId} value={sceneId}>
                      {scene.name}
                    </MenuItem>
                  ))}
                </Select>
              </SettingsRow>
              <SettingsRow title="Silence timeout (seconds)">
                <TextField
                  size="small"
                  type="number"
                  value={timeoutSecondsDraft}
                  inputProps={{ min: 0, step: 0.1 }}
                  onChange={(event) => setTimeoutSecondsDraft(event.target.value)}
                  onBlur={() => {
                    const timeoutSeconds = Number(timeoutSecondsDraft)
                    if (
                      timeoutSecondsDraft.trim() === '' ||
                      !Number.isFinite(timeoutSeconds) ||
                      timeoutSeconds < 0
                    ) {
                      setTimeoutSecondsDraft(String(silenceSceneConfig.timeout_seconds))
                      return
                    }
                    setTimeoutSecondsDraft(String(timeoutSeconds))
                    if (timeoutSeconds !== silenceSceneConfig.timeout_seconds) {
                      updateSilenceSceneConfig({ timeout_seconds: timeoutSeconds })
                    }
                  }}
                  sx={{ width: 120 }}
                />
              </SettingsRow>
              {silenceSceneStatus && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Runtime: {silenceSceneStatus.state};{' '}
                  {silenceSceneStatus.audio_silent === null
                    ? 'audio unknown'
                    : silenceSceneStatus.audio_silent
                      ? 'silent'
                      : 'audio active'}
                  {silenceSceneStatus.timeout_pending ? '; timeout pending' : ''}
                  {silenceSceneStatus.silence_scene_active ? '; override active' : ''}
                  {silenceSceneStatus.restoring ? '; restoring' : ''}
                  {silenceSceneStatus.recovery_pending ? '; recovery pending' : ''}
                  {silenceSceneStatus.reason ? `; ${silenceSceneStatus.reason}` : ''}
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
      <SettingsRow alpha title="Log Filtering">
        <LogColorFilterSelect />
      </SettingsRow>
    </>
  )
}

export default Uncategorized
