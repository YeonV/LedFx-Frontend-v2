/* eslint-disable no-self-assign */
import { useEffect, useState } from 'react'
import {
  CloudUpload,
  CloudDownload,
  PowerSettingsNew,
  Delete,
  Refresh,
  Info,
  Lock,
  LockOpen
} from '@mui/icons-material'
import isElectron from 'is-electron'
import { Divider, MenuItem, Select, Tooltip, Box, Chip, Button } from '@mui/material'
import useStore from '../../store/useStore'
import { deleteFrontendConfig, download } from '../../utils/helpers'
import PopoverSure from '../../components/Popover/Popover'

import AboutDialog from '../../components/Dialogs/AboutDialog'
import { useStyles, SettingsButton, SettingsSwitch, SettingsRow } from './SettingsComponents'
import { navigateToRoot } from '../../utils/navigateToRoot'

const GeneralCard = () => {
  const classes = useStyles()
  const getFullConfig = useStore((state) => state.getFullConfig)
  const deleteSystemConfig = useStore((state) => state.deleteSystemConfig)
  const importSystemConfig = useStore((state) => state.importSystemConfig)
  const shutdown = useStore((state) => state.shutdown)
  const restart = useStore((state) => state.restart)
  const disconnected = useStore((state) => state.disconnected)
  const settings = useStore((state) => state.config)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const setSystemConfig = useStore((state) => state.setSystemConfig)
  const scenes = useStore((state) => state.scenes)
  const setIntro = useStore((state) => state.setIntro)
  const isAndroid = process.env.REACT_APP_LEDFX_ANDROID === 'true'

  // SSL state management
  const [sslEnabled, setSslEnabled] = useState(false)
  const [sslLoading, setSslLoading] = useState(false)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0

  const isAndroidBridgeAvailable = (): boolean => {
    return typeof (window as any).LedFxAndroidBridge !== 'undefined'
  }

  const dl = async (fileName: string, content: any, contentType: string = 'application/json') => {
    if (isAndroidBridgeAvailable()) {
      const fileContentJson = JSON.stringify(content, null, 4)
      ;(window as any).LedFxAndroidBridge.exportConfigFile(fileName, fileContentJson)
    } else {
      download(content, 'config.json', contentType)
    }
  }

  // Listen for electron messages
  window.api?.receive('fromMain', (args: any) => {
    if (args[0] === 'ssl-status') {
      setSslEnabled(args[1].enabled)
    } else if (args[0] === 'ssl-enable-result' || args[0] === 'ssl-disable-result') {
      // Refresh SSL status
      window.api?.send('toMain', { command: 'get-ssl-status' })
      // Restart core to apply SSL changes
      if (args[1].success) {
        setTimeout(() => restart(), 500)
      }
    }
  })

  useEffect(() => {
    if (window.api) {
      // Check SSL status
      window.api.send('toMain', { command: 'get-ssl-status' })
    }
  }, [])

  const handleEnableSSL = () => {
    setSslLoading(true)
    window.api?.send('toMain', { command: 'enable-ssl' })
    setTimeout(() => setSslLoading(false), 5000)
  }

  const handleDisableSSL = () => {
    setSslLoading(true)
    window.api?.send('toMain', { command: 'disable-ssl' })
    setTimeout(() => setSslLoading(false), 3000)
  }

  const configDownload = async () => {
    getFullConfig().then((newConfig) => dl('config.json', newConfig, 'application/json'))
  }

  const configDelete = async () => {
    deleteFrontendConfig(true)
    setTimeout(() => {
      deleteSystemConfig().then(() => {
        if (!isAndroid) {
          setTimeout(() => {
            // Use SSL-aware default host
            const sslEnabled = window.localStorage.getItem('ledfx-ssl-enabled') === 'true'
            const defaultHost = sslEnabled ? 'https://ledfx.local:8889' : 'http://localhost:8888'
            window.localStorage.setItem('ledfx-host', defaultHost)
            window.location.reload()
            setIntro(true)
          }, 500)
          navigateToRoot()
        }
      })
    }, 300)
  }

  const fileChanged = async (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (ev: any) => {
      importSystemConfig(ev.target.result).then(() => {
        window.location.href = window.location.href
      })
    }
  }

  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  return (
    <div>
      <div
        className="step-settings-four"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ flex: '0 0 49%' }}>
          <SettingsButton startIcon={<CloudUpload />} onClick={() => configDownload()}>
            Export Config
          </SettingsButton>
          <PopoverSure
            startIcon={<Delete />}
            label="Reset Config"
            variant="outlined"
            color="inherit"
            className={classes.actionButton}
            onConfirm={() => configDelete()}
            vertical="top"
            wrapperStyle={{
              marginTop: '0.5rem',
              flexBasis: '49%'
            }}
          />
          <input
            hidden
            accept="application/json"
            id="contained-button-file"
            type="file"
            onChange={(e) => fileChanged(e)}
          />
          <label htmlFor="contained-button-file" style={{ width: '100%', flexBasis: '49%' }}>
            <SettingsButton component="span" startIcon={<CloudDownload />}>
              Import Config
            </SettingsButton>
          </label>
          {isElectron() && window.process?.argv.indexOf('integratedCore') !== -1 && (
            <SettingsButton
              startIcon={<CloudUpload />}
              onClick={() => window.api.send('toMain', { command: 'open-config' })}
            >
              Config Location
            </SettingsButton>
          )}
        </div>
        <div style={{ flex: '0 0 49%' }}>
          <AboutDialog startIcon={<Info />} className={classes.actionButton}>
            About
          </AboutDialog>
          <SettingsButton disabled={disconnected} startIcon={<Refresh />} onClick={restart}>
            {isElectron() && window.process?.argv.indexOf('integratedCore') !== -1
              ? 'Restart Core'
              : 'Restart'}
          </SettingsButton>

          <SettingsButton
            disabled={disconnected}
            startIcon={<PowerSettingsNew />}
            onClick={shutdown}
          >
            {isElectron() && window.process?.argv.indexOf('integratedCore') !== -1
              ? 'Shutdown Core'
              : 'Shutdown'}
          </SettingsButton>
          {isElectron() && window.process?.argv.indexOf('integratedCore') !== -1 && (
            <SettingsButton
              startIcon={<PowerSettingsNew />}
              onClick={() => {
                window.api.send('toMain', { command: 'start-core' })
              }}
            >
              Start Core
            </SettingsButton>
          )}
        </div>
      </div>
      <Divider style={{ margin: '20px 0 10px' }} />
      <div className={`${classes.settingsRow} step-settings-six `} style={{ flexBasis: '100%' }}>
        <label>Global Transitions</label>
        <SettingsSwitch
          checked={settings.global_transitions}
          onChange={() =>
            onSystemSettingsChange('global_transitions', !settings.global_transitions)
          }
        />
      </div>
      <div className={`${classes.settingsRow} step-settings-seven `} style={{ flexBasis: '100%' }}>
        <label>Scan on startup</label>
        <SettingsSwitch
          checked={settings.scan_on_startup}
          onChange={() => onSystemSettingsChange('scan_on_startup', !settings.scan_on_startup)}
        />
      </div>
      <div className={`${classes.settingsRow} step-settings-eleven `} style={{ flexBasis: '100%' }}>
        <label>Scene on startup</label>
        <Select
          value={settings.startup_scene_id || ''}
          disableUnderline
          onChange={(e) => onSystemSettingsChange('startup_scene_id', e.target.value)}
        >
          <MenuItem key={'none'} value={''}>
            {'None'}
          </MenuItem>
          {Object.keys(scenes).map((scene) => (
            <MenuItem key={scene} value={scene}>
              {scenes[scene].name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={`${classes.settingsRow} step-settings-eight `} style={{ flexBasis: '100%' }}>
        <label>Auto-generate Virtuals for Segments</label>
        <SettingsSwitch
          checked={settings.create_segments}
          onChange={() => onSystemSettingsChange('create_segments', !settings.create_segments)}
        />
      </div>
      <div className={`${classes.settingsRow} step-settings-ten `} style={{ flexBasis: '100%' }}>
        <label>Deactivate to black</label>
        <Tooltip title="On deactivation, virtuals and devices will fill pixels with black. If off pixels will be left with the last rendered color from before deactivation, this is the original LedFX behaviour">
          <SettingsSwitch
            checked={settings.flush_on_deactivate}
            onChange={() =>
              onSystemSettingsChange('flush_on_deactivate', !settings.flush_on_deactivate)
            }
          />
        </Tooltip>
      </div>
      {isCC && (
        <>
          <Divider style={{ margin: '20px 0 10px' }} />
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <SettingsRow title="LedFx SSL Configuration">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={sslEnabled ? 'Enabled' : 'Disabled'}
                  color={sslEnabled ? 'success' : 'default'}
                  size="small"
                  icon={sslEnabled ? <Lock /> : <LockOpen />}
                />
                {!sslEnabled ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleEnableSSL}
                    disabled={sslLoading}
                    startIcon={<Lock />}
                  >
                    {sslLoading ? 'Installing...' : 'Enable HTTPS'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={handleDisableSSL}
                    disabled={sslLoading}
                    startIcon={<LockOpen />}
                  >
                    {sslLoading ? 'Uninstalling...' : 'Disable HTTPS'}
                  </Button>
                )}
              </Box>
            </SettingsRow>

            {sslEnabled && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                <Tooltip title="LedFx is accessible via HTTPS at https://ledfx.local:8889">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info fontSize="small" color="success" />
                    <span style={{ fontSize: '0.875rem' }}>
                      HTTPS enabled • Access at <strong>https://ledfx.local:8889</strong>
                    </span>
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>
        </>
      )}
    </div>
  )
}

export default GeneralCard
