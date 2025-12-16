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
  Link
} from '@mui/material'
import GitInfo from 'react-git-info/macro'
import useStore from '../../store/useStore'
import fversion from '../../../package.json'
import { SettingsRow, SettingsSlider } from '../../pages/Settings/SettingsComponents'
import useSliderStyles from '../../components/SchemaForm/components/Number/BladeSlider.styles'

export default function AboutDialog({ className, children, startIcon }: any) {
  const sliderClasses = useSliderStyles()
  const config = useStore((state) => state.config)
  const getInfo = useStore((state) => state.getInfo)
  const getUpdateInfo = useStore((state) => state.getUpdateInfo)
  const updateNotificationInterval = useStore((state) => state.updateNotificationInterval)
  const setUpdateNotificationInterval = useStore((state) => state.setUpdateNotificationInterval)

  const [open, setOpen] = useState(false)
  const [bcommit, setLedFxSHA] = useState('')
  const [bversion, setBversion] = useState('')
  const [buildType, setBuildType] = useState('')
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [releaseUrl, setReleaseUrl] = useState('')
  const fgitInfo = GitInfo()

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
        PaperProps={{
          style: { margin: '0 auto' }
        }}
      >
        <DialogTitle id="about-dialog-title">About LedFx</DialogTitle>
        <DialogContent>
          <div style={{ minWidth: 400 }}>
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
          {updateAvailable && (
            <Button onClick={handleDownloadNewVersion}>Download New Version</Button>
          )}
          <Button onClick={handleCheckForUpdate}>Check for Update</Button>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
