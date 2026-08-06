import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'
import BladeSchemaForm from '../../components/SchemaForm/SchemaForm/SchemaForm'
import { Ledfx } from '../../api/ledfx'
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
  Typography
} from '@mui/material'
import {
  Delete,
  Visibility,
  Download,
  DeleteForever,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Info
} from '@mui/icons-material'

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
  const stemsEnabled = !!model?.stems_enabled

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

  useEffect(() => {
    if (usePerDeviceDelay && model?.audio_device && schema.properties?.audio_device?.enum) {
      if (
        (perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]] ||
          perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]] === 0) &&
        perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]] !== model.delay_ms
      ) {
        setSystemConfig({
          audio: {
            delay_ms: perDeviceDelay[schema.properties.audio_device?.enum[model.audio_device]]
          }
        }).then(() => getSystemConfig())
      }
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
              audio: e
            }).then(() => getSystemConfig())
          }}
        />
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
          <Visibility color="disabled" />
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg">
        <DialogTitle>Per Device Delay</DialogTitle>
        <DialogContent>
          {perDeviceDelay.length === 0 ? (
            <p>No per device delay set</p>
          ) : (
            Object.entries(perDeviceDelay).map(([key, value], i) => (
              <SettingsRow key={i} title={key} style={{ paddingLeft: '20px' }}>
                <TextField
                  sx={{ width: '70px', ml: 3 }}
                  variant="standard"
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setPerDeviceDelay({
                      ...perDeviceDelay,
                      [key]: parseInt(e.target.value)
                    })
                  }
                />
              </SettingsRow>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AudioCard
