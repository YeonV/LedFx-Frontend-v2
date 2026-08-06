import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Link,
  useMediaQuery
} from '@mui/material'
import GitInfo from 'react-git-info/macro'
import useStore from '../../store/useStore'
import fversion from '../../../package.json'
import { SettingsRow, SettingsSlider } from '../../pages/Settings/SettingsComponents'
import useSliderStyles from '../../components/SchemaForm/components/Number/BladeSlider.styles'
import { isAndroidApp } from '../FireTv/android.bridge'
import { requestUpdateGrantIfNeeded } from '../FireTv/androidUpdateConsent'
import { useAndroidUpdateChecker } from '../FireTv/useAndroidUpdateChecker'

export default function AboutDialog({ className, children, startIcon }: any) {
  const sliderClasses = useSliderStyles()
  const config = useStore((state) => state.config)
  const getInfo = useStore((state) => state.getInfo)
  const getUpdateInfo = useStore((state) => state.getUpdateInfo)
  const updateNotificationInterval = useStore((state) => state.updateNotificationInterval)
  const setUpdateNotificationInterval = useStore((state) => state.setUpdateNotificationInterval)

  const [open, setOpen] = useState(false)
  const xsmall = useMediaQuery('(max-width: 600px)')
  const [bcommit, setLedFxSHA] = useState('')
  const [bversion, setBversion] = useState('')
  const [buildType, setBuildType] = useState('')
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [releaseUrl, setReleaseUrl] = useState('')
  const fgitInfo = GitInfo()

  // /api/check_for_updates reports LedFx core releases, which are not
  // installable on Android. There we track our own APK builds instead.
  const onAndroid = isAndroidApp()
  const androidUpdates = useStore((state) => state.androidUpdates)
  const setAndroidUpdates = useStore((state) => state.setAndroidUpdates)
  const androidUpdatesOn = androidUpdates === 'enabled'
  // Opted out means opted out: no release lookup happens at all.
  const android = useAndroidUpdateChecker({ enabled: onAndroid && androidUpdatesOn })

  // Also the way back in for anyone who declined, or who set the app up before
  // the consent step existed and so was never asked.
  const handleToggleAndroidUpdates = () => {
    if (androidUpdatesOn) {
      setAndroidUpdates('declined')
      return
    }
    setAndroidUpdates('enabled')
    requestUpdateGrantIfNeeded()
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCheckForUpdate = async () => {
    const updateInfo = await getUpdateInfo(true)
    if (updateInfo.status === 'success' && updateInfo.payload.type === 'warning') {
      setUpdateAvailable(true)
      setReleaseUrl(updateInfo.data.release_url)
    }
  }

  const handleDownloadNewVersion = () => {
    window.open(releaseUrl, '_blank')
  }

  useEffect(() => {
    async function fetchData() {
      const info = await getInfo()
      if (info) {
        setLedFxSHA(info.github_sha)
        setBversion(info.version)
        setBuildType(info.is_release === 'true' ? 'release' : 'development')
      }
    }

    if (open) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div>
      <Button size="small" startIcon={startIcon} className={className} onClick={handleClickOpen}>
        {children}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="about-dialog-title"
        aria-describedby="about-dialog-description"
        fullScreen={xsmall}
        PaperProps={{
          style: xsmall ? { margin: 0, maxWidth: '100%' } : { margin: '0 auto' }
        }}
      >
        <DialogTitle id="about-dialog-title">About LedFx</DialogTitle>
        <DialogContent>
          <div style={{ minWidth: xsmall ? 0 : 400 }}>
            <Card style={{ marginBottom: '1rem' }}>
              <CardHeader title="Backend" />
              <CardContent style={{ paddingTop: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  version: <span>{bversion}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  commit:
                  {bcommit !== 'unknown' ? (
                    <Link href={`https://github.com/LedFx/LedFx/commit/${bcommit}`} target="_blank">
                      {bcommit?.substring(0, 8)}
                    </Link>
                  ) : (
                    <span>{bcommit}</span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  config_version: <span>{config.configuration_version}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  build type: <span>{buildType}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Frontend" />
              <CardContent style={{ paddingTop: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  version: <span>{fversion.version}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  commit:
                  <Link
                    href={`https://github.com/YeonV/LedFx-Frontend-v2/commit/${fgitInfo.commit.hash}`}
                    target="_blank"
                  >
                    {fgitInfo.commit.shortHash}
                  </Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  config_version:
                  <span>{localStorage.getItem('ledfx-frontend')}</span>
                </div>
              </CardContent>
            </Card>

            {onAndroid && (
              <SettingsRow
                title="Check for app updates"
                checked={androidUpdatesOn}
                onChange={handleToggleAndroidUpdates}
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
          </div>
        </DialogContent>
        <DialogActions>
          {onAndroid ? (
            <>
              {androidUpdatesOn && android.updateAvailable && (
                <Button
                  color={android.needsInstallPermission ? 'warning' : 'primary'}
                  onClick={android.handleUpdate}
                  disabled={android.downloading}
                >
                  {android.downloading
                    ? 'Downloading…'
                    : android.needsInstallPermission
                      ? 'Allow install, then return'
                      : `Install ${android.latestVersion}`}
                </Button>
              )}
              {androidUpdatesOn ? (
                <Button onClick={() => android.checkForUpdate(true)} disabled={android.checking}>
                  {android.checking
                    ? 'Checking…'
                    : android.updateAvailable
                      ? 'Re-check'
                      : 'Check for Update'}
                </Button>
              ) : (
                <Button onClick={handleToggleAndroidUpdates}>Enable Updates</Button>
              )}
            </>
          ) : (
            <>
              {updateAvailable && (
                <Button onClick={handleDownloadNewVersion}>Download New Version</Button>
              )}
              <Button onClick={handleCheckForUpdate}>Check for Update</Button>
            </>
          )}
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
