import { useEffect, useRef, useState } from 'react'
import useStore from '../../store/useStore'
import Popover from '../../components/Popover/Popover'
import BladeSchemaForm from '../../components/SchemaForm/SchemaForm/SchemaForm'
import { Ledfx } from '../../api/ledfx'
import { usePlaybackCapture } from '../../hooks/usePlaybackCapture'
import { SettingsRow, SettingsSwitch } from './SettingsComponents'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Slider,
  Box,
  Chip,
  Select,
  MenuItem,
  LinearProgress,
  Typography,
  Stack,
  useMediaQuery
} from '@mui/material'
import {
  Delete,
  ManageHistory,
  Close,
  Download,
  DeleteForever,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Info,
  Mic as MicIcon,
  Speaker as SpeakerIcon,
  Hub as HubIcon,
  GraphicEq
} from '@mui/icons-material'
import { alignedFrameRate } from '../../components/FireTv/android.bridge'

/** LedFx's own default; what a non-continuous input goes back to. */
const DEFAULT_FRAME_RATE = 60

/**
 * Device names carry three kinds of information at once, e.g.
 * "Windows WASAPI: Evo (2-Crusher Evo) [Loopback]". The selector already
 * encodes the tag as an icon and drops it from the text; this does the same,
 * and dims the parenthesised hardware detail so the device name itself reads
 * first.
 */
const DeviceName = ({ name }: { name: string }) => {
  const isLoopback = name.includes('[Loopback]')
  const isSendspin = name.toLowerCase().startsWith('sendspin')
  const parts = name
    .replace('[Loopback]', '')
    .trim()
    .split(/(\([^)]*\)|\[[^\]]*\])/g)
    .filter(Boolean)

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
      {isSendspin ? (
        <HubIcon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
      ) : isLoopback ? (
        <SpeakerIcon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
      ) : (
        <MicIcon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
      )}
      <Typography
        component="span"
        sx={{ minWidth: 0, wordBreak: 'break-word', fontSize: '0.85rem', lineHeight: 1.35 }}
      >
        {parts.map((part, i) =>
          part.startsWith('(') ? (
            <Box
              component="span"
              key={i}
              sx={{ display: 'block', color: 'text.secondary', fontSize: '0.8em' }}
            >
              {part}
            </Box>
          ) : part.startsWith('[') ? (
            <Box
              component="span"
              key={i}
              sx={{
                ml: 0.5,
                px: 0.6,
                py: 0.1,
                fontSize: '0.7em',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'primary.main',
                border: 1,
                borderColor: 'primary.main',
                borderRadius: 1,
                whiteSpace: 'nowrap'
              }}
            >
              {part.slice(1, -1)}
            </Box>
          ) : (
            // the host API prefix gets its own line, so the device name itself
            // starts at the left edge instead of trailing a long vendor string
            part
              .split(/:\s*/)
              .filter(Boolean)
              .map((line, j, all) => (
                <Box component="span" key={`${i}-${j}`} sx={{ display: 'block' }}>
                  {line}
                  {j < all.length - 1 ? ':' : ''}
                </Box>
              ))
          )
        )}
      </Typography>
    </Stack>
  )
}

const AudioCard = ({ className }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [driverInstalled, setDriverInstalled] = useState(false)
  const [driverLoading, setDriverLoading] = useState(false)
  const [volume, setVolume] = useState(50)
  const [volumeLoading, setVolumeLoading] = useState(false)
  const [isMacOS, setIsMacOS] = useState(false)
  const [driverPreference, setDriverPreference] = useState<string>('ask')
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const schema = useStore((state) => state?.schemas?.audio?.schema)
  const model = useStore((state) => state?.config?.audio)
  const perDeviceDelay = useStore((state) => state?.perDeviceDelay)
  const setPerDeviceDelay = useStore((state) => state.setPerDeviceDelay)
  const usePerDeviceDelay = useStore((state) => state?.usePerDeviceDelay)
  const setUsePerDeviceDelay = useStore((state) => state.setUsePerDeviceDelay)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0

  // Stem separation model. Not shipped with LedFx (~211MB, and its training data
  // is undocumented upstream), so it is fetched on request. A packaged binary has
  // no interpreter, so the CLI downloader is unreachable for most users - this
  // row is how they get it.
  const [stemModel, setStemModel] = useState<any>(null)
  // Capability, not preference. Stem separation ships as a patch, so the audio
  // schema only declares these keys on a core that has it - whereas the saved
  // config keeps `stems_enabled` forever once it has been switched on. Reading
  // the config alone meant a core built without stems still got polled for
  // /api/stem_model, which is not routed there, and the row rendered controls
  // that core could never honour.
  const stemsAvailable = !!schema?.properties?.stems_enabled
  const stemsEnabled = stemsAvailable && !!model?.stems_enabled

  // Android's default input taps the output mix through the Visualizer API,
  // which is 8-bit and only refreshes ~20x a second. AudioPlaybackCapture reads
  // the same audio digitally and continuously, but Android gates it behind a
  // recording-consent dialog that only an Activity can show. State/actions
  // are shared with the setup wizard via usePlaybackCapture.
  const { captureSupported, captureActive, handleRequestCapture, handleRevokeCapture } =
    usePlaybackCapture()

  /**
   * Keep sample_rate matched to the selected input's nature.
   *
   * sample_rate is what LedFx divides the device rate by to get its block size,
   * so it is also the only lever that can land a block on the audio HAL's
   * buffer quantum. The two continuous Android inputs benefit: aligned blocks
   * take the fast capture path and are shorter, roughly halving buffered
   * latency. The Visualizer does not - its buffer only refreshes about 20 times
   * a second, so asking for more frames only burns CPU re-reading stale data.
   */
  const applyAlignedFrameRate = (next: any) => {
    const aligned = alignedFrameRate()
    if (!aligned || !schema?.properties?.audio_device?.enum) return next
    const changedDevice = next?.audio_device !== model?.audio_device
    if (!changedDevice) return next

    const deviceName = schema.properties.audio_device.enum[next.audio_device] || ''
    const isContinuous = /AudioRecord API|PlaybackCapture API/.test(deviceName)
    const wanted = isContinuous ? aligned : DEFAULT_FRAME_RATE
    if (next.sample_rate === wanted) return next
    return { ...next, sample_rate: wanted }
  }

  const refreshStemModel = async () => {
    try {
      setStemModel(await Ledfx('/api/stem_model'))
    } catch {
      setStemModel(null)
    }
  }

  const downloadStemModel = async () => {
    // Optimistic, so the button reacts before the first poll comes back
    setStemModel((s: any) => ({ ...(s || {}), downloading: true, progress: 0 }))
    await Ledfx('/api/stem_model', 'POST', {})
    refreshStemModel()
  }

  useEffect(() => {
    if (!stemsEnabled) return undefined
    refreshStemModel()
    // Poll only while a download is running: 211MB takes a while, and the
    // endpoint is the only source of progress.
    const id = setInterval(() => {
      if (stemModel?.downloading) refreshStemModel()
    }, 1000)
    return () => clearInterval(id)
  }, [stemsEnabled, stemModel?.downloading])

  // Listen for electron messages
  window.api?.receive('fromMain', (args: any) => {
    if (args[0] === 'platform') {
      setIsMacOS(args[1] === 'darwin')
    } else if (args[0] === 'driver-status') {
      setDriverInstalled(args[1].installed)
    } else if (args[0] === 'driver-preference') {
      setDriverPreference(args[1])
    } else if (args[0] === 'volume-result') {
      if (args[1].success && args[1].volume !== undefined) {
        setVolume(args[1].volume)
      }
    } else if (args[0] === 'reload-audio-config') {
      // Reload audio config to restart audio engine
      getSystemConfig()
    } else if (
      args[0] === 'driver-install-result' ||
      args[0] === 'driver-uninstall-result' ||
      args[0] === 'volume-set-result'
    ) {
      // Refresh driver status
      if (args[0] !== 'volume-set-result') {
        window.api?.send('toMain', { command: 'get-driver-status' })
      }
    }
  })

  useEffect(() => {
    getSystemConfig()

    // Check if running on macOS CC build
    if (window.api) {
      window.api.send('toMain', { command: 'get-platform' })
      window.api.send('toMain', { command: 'get-driver-status' })
      window.api.send('toMain', { command: 'get-volume' })
      window.api.send('toMain', { command: 'get-driver-preference' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const previousAudioDevice = useRef<number | undefined>(undefined)
  const xsmall = useMediaQuery('(max-width: 600px)')

  useEffect(() => {
    if (!usePerDeviceDelay || !schema.properties?.audio_device?.enum) return
    const deviceName = schema.properties.audio_device.enum[model?.audio_device]
    if (!deviceName) return

    const stored = perDeviceDelay[deviceName]
    const known = typeof stored === 'number' && !Number.isNaN(stored)
    const deviceChanged =
      previousAudioDevice.current !== undefined &&
      previousAudioDevice.current !== model?.audio_device
    previousAudioDevice.current = model?.audio_device

    // Switching to a device we never saved must reset, not inherit the delay
    // of the device we came from - that is the whole point of "per device".
    if (deviceChanged) {
      const target = known ? stored : (schema.properties.delay_ms?.default ?? 0)
      if (target !== model?.delay_ms) {
        setSystemConfig({ audio: { delay_ms: target } }).then(() => getSystemConfig())
      }
      return
    }

    // Turning the feature on should adopt what is set right now rather than
    // wiping it, and restore a known value if there is one.
    if (known && stored !== model?.delay_ms) {
      setSystemConfig({ audio: { delay_ms: stored } }).then(() => getSystemConfig())
    } else if (!known && typeof model?.delay_ms === 'number') {
      setPerDeviceDelay({ ...perDeviceDelay, [deviceName]: model.delay_ms })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePerDeviceDelay, model?.audio_device])

  const handleInstallDriver = () => {
    setDriverLoading(true)
    window.api?.send('toMain', { command: 'install-driver' })
    setTimeout(() => setDriverLoading(false), 3000)
  }

  const handleUninstallDriver = () => {
    setDriverLoading(true)
    window.api?.send('toMain', { command: 'uninstall-driver' })
    setTimeout(() => setDriverLoading(false), 3000)
  }

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number)
  }

  const handleVolumeChangeCommitted = () => {
    setVolumeLoading(true)
    window.api?.send('toMain', { command: 'set-volume', volume })
    setTimeout(() => setVolumeLoading(false), 1000)
  }

  const handleVolumeUp = () => {
    window.api?.send('toMain', { command: 'volume-up' })
    setTimeout(() => window.api?.send('toMain', { command: 'get-volume' }), 200)
  }

  const handleVolumeDown = () => {
    window.api?.send('toMain', { command: 'volume-down' })
    setTimeout(() => window.api?.send('toMain', { command: 'get-volume' }), 200)
  }

  const handleToggleMute = () => {
    window.api?.send('toMain', { command: 'toggle-mute' })
  }

  const handleDriverPreferenceChange = (event: any) => {
    const value = event.target.value
    setDriverPreference(value)
    window.api?.send('toMain', { command: 'set-driver-preference', preference: value })
  }

  return (
    <div className={className}>
      {schema && (
        <BladeSchemaForm
          hideToggle
          schema={schema}
          model={model}
          onModelChange={(e) => {
            setSystemConfig({
              audio: applyAlignedFrameRate(e)
            }).then(() => getSystemConfig())
          }}
        />
      )}
      {/* CAPTURE APP AUDIO (Android 10+) */}
      {captureSupported && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <SettingsRow
            title="Capture App Audio"
            info="Reads what other apps are playing digitally and without gaps. The default Android input samples the output roughly 20 times a second at 8-bit, so about half the audio is never seen. Android asks for recording consent; apps that opt out of capture stay silent. Revoke fully ends the session - the system's own status-bar recording indicator clears immediately - and resuming afterward needs a fresh consent dialog, unlike switching to a different input and back."
            style={{ height: 'auto', minHeight: 40, flexWrap: 'wrap', whiteSpace: 'nowrap' }}
          >
            {/* The button itself is the indicator: its label and color already
                say whether capture is active, so a separate status chip next
                to it would just repeat the same information twice. */}
            <Button
              variant="outlined"
              size="small"
              color={captureActive ? 'error' : 'primary'}
              startIcon={<GraphicEq />}
              onClick={captureActive ? handleRevokeCapture : handleRequestCapture}
            >
              {captureActive ? 'Revoke' : 'Allow'}
            </Button>
          </SettingsRow>
          {captureActive && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Select <strong>Playback Capture</strong> as the audio device above to use it.
            </Typography>
          )}
        </Box>
      )}

      {/* STEM SEPARATION MODEL */}
      {stemsEnabled && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <SettingsRow
            title="Stem Separation Model"
            info="A ~211MB model, downloaded from the upstream project rather than bundled with LedFx. Stem separation stays unavailable until it is present."
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={
                  stemModel?.installed
                    ? 'Installed'
                    : stemModel?.downloading
                      ? `${Math.round((stemModel?.progress || 0) * 100)}%`
                      : 'Not downloaded'
                }
                color={stemModel?.installed ? 'success' : stemModel?.error ? 'error' : 'default'}
                size="small"
              />
              {!stemModel?.installed && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  disabled={!stemModel || stemModel.downloading}
                  onClick={downloadStemModel}
                >
                  {stemModel?.downloading ? 'Downloading...' : 'Download (211 MB)'}
                </Button>
              )}
            </Box>
          </SettingsRow>
          {stemModel?.downloading && (
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (stemModel?.progress || 0) * 100)}
              sx={{ mt: 1 }}
            />
          )}
          {stemModel?.error && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {stemModel.error}
            </Typography>
          )}
        </Box>
      )}

      {/* MACOS AUDIO DRIVER & VOLUME CONTROL SECTION */}
      {isMacOS && isCC && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <SettingsRow title="LedFx Audio Driver">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={driverInstalled ? 'Installed' : 'Not Installed'}
                color={driverInstalled ? 'success' : 'default'}
                size="small"
                icon={driverInstalled ? <Info /> : undefined}
              />
              {driverInstalled ? (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteForever />}
                  onClick={handleUninstallDriver}
                  disabled={driverLoading}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Uninstall
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Download />}
                  onClick={handleInstallDriver}
                  disabled={driverLoading}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Install Driver
                </Button>
              )}
            </Box>
          </SettingsRow>

          <SettingsRow title="Installation Preference">
            <Select
              value={driverPreference}
              onChange={handleDriverPreferenceChange}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="always">Always Install</MenuItem>
              <MenuItem value="never">Always Skip</MenuItem>
              <MenuItem value="ask">Ask Each Time</MenuItem>
            </Select>
          </SettingsRow>

          {driverInstalled && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <IconButton size="small" onClick={handleToggleMute} color="primary">
                <VolumeOff />
              </IconButton>

              <Slider
                value={volume}
                onChange={handleVolumeChange}
                onChangeCommitted={handleVolumeChangeCommitted}
                min={0}
                max={100}
                disabled={volumeLoading}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flex: 1, mx: 2 }}
              />

              <IconButton
                size="small"
                onClick={handleVolumeDown}
                disabled={volumeLoading}
                color="primary"
              >
                <VolumeDown />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleVolumeUp}
                disabled={volumeLoading}
                color="primary"
              >
                <VolumeUp />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
      {/* PER DEVICE DELAY SECTION */}
      <SettingsRow title="Remember delay per device">
        <IconButton
          size="small"
          sx={{ pt: 0, mr: 1 }}
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          <ManageHistory color="disabled" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ pt: 0, mr: 1 }}
          onClick={() => {
            setPerDeviceDelay({})
          }}
        >
          <Delete color="disabled" />
        </IconButton>
        <SettingsSwitch
          checked={usePerDeviceDelay}
          onChange={(e) => setUsePerDeviceDelay(e.target.checked)}
        />
      </SettingsRow>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={xsmall}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}
        >
          Per Device Delay
          {/* full screen has no backdrop to tap, so the dialog needs its own way out */}
          <IconButton aria-label="close" onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {Object.keys(perDeviceDelay).length === 0 ? (
            <p>No per device delay set</p>
          ) : (
            Object.entries(
              Object.entries(perDeviceDelay).reduce(
                (groups, [key, value]) => {
                  const host = key.includes(':') ? key.split(':')[0].trim() : 'Other'
                  groups[host] = groups[host] || []
                  groups[host].push([key, value])
                  return groups
                },
                {} as Record<string, [string, any][]>
              )
            ).map(([host, entries]) => (
              <Box key={host} sx={{ mb: 1 }}>
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{ display: 'block', lineHeight: 2, letterSpacing: 1 }}
                >
                  {host}
                </Typography>
                {entries.map(([key, value], i) => (
                  // SettingsRow is a fixed 40px tall: device names are long enough
                  // to wrap to three lines and overlap the row below it.
                  <Stack
                    key={i}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <DeviceName
                      name={key.includes(':') ? key.slice(key.indexOf(':') + 1).trim() : key}
                    />
                    <TextField
                      sx={{ width: 90, flexShrink: 0 }}
                      variant="outlined"
                      size="small"
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10)
                        setPerDeviceDelay({
                          ...perDeviceDelay,
                          [key]: Number.isNaN(parsed) ? 0 : parsed
                        })
                      }}
                    />
                    <Popover
                      type="iconbutton"
                      variant="text"
                      color="inherit"
                      size="small"
                      text={`Forget delay for ${key}?`}
                      onConfirm={() => {
                        const { [key]: _removed, ...rest } = perDeviceDelay
                        setPerDeviceDelay(rest)
                      }}
                    />
                  </Stack>
                ))}
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AudioCard
