import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { compareVersions } from 'compare-versions'
import isElectron from 'is-electron'
import {
  AppBar,
  Box,
  Badge,
  Toolbar,
  CircularProgress,
  Typography,
  IconButton,
  Button,
  Tooltip,
  useTheme
} from '@mui/material'
import { styled } from '@mui/styles'

import useStore from '../../../store/useStore'
import { drawerWidth, ios } from '../../../utils/helpers'
import GlobalActionBar from '../../GlobalActionBar'
import pkg from '../../../../package.json'
import { Ledfx } from '../../../api/ledfx'
import useWakeLock from '../../../utils/useWakeLook'
import QrConnector from '../../Dialogs/QrConnector'
import { useWebSocket } from '../../../utils/Websocket/WebSocketProvider'
import FireTv from '../../FireTv/FireTv'
import { exitAndroidApp, isAndroidApp } from '../../FireTv/android.bridge'
import CrashButton from '../../CrashButton'
import BladeIcon from '../../Icons/BladeIcon/BladeIcon'
import useSongDetector from '../../../hooks/useSongDetector'
import LeftButtons from './LeftButtons'
import Title from './Title'
import TopBarMenu from './TopBarMenu'

interface FrontendConfig {
  updateUrl: string
  releaseUrl: string
}

export const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: '45%',
    top: '115%',
    padding: '0 4px',
    fontSize: 'x-small',
    height: '14px'
  }
}))

const TopBar = () => {
  const { requestWakeLock, releaseWakeLock } = useWakeLock()
  const { pathname } = useLocation()
  const history = useNavigate()
  const theme = useTheme()
  const isTv = window.location.href.includes('isAndroidTv=true')

  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [frConfig, setFrConfig] = useState<FrontendConfig | null>(null)
  const latestTag = useStore((state) => state.ui.latestTag)
  const setLatestTag = useStore((state) => state.ui.setLatestTag)
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open)
  const setLeftBarOpen = useStore((state) => state.ui.setLeftBarOpen)
  const setQrConnectOpen = useStore((state) => state.setDialogOpenQrConnector)
  const userClosedQrConnector = useStore((state) => state.userClosedQrConnector)
  const virtuals = useStore((state) => state.virtuals)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const features = useStore((state) => state.features)
  const platform = useStore((state) => state.platform)
  const sslEnabled = isElectron()
    ? window.localStorage.getItem('ledfx-ssl-enabled') === 'true'
    : false
  const defaultHosts = sslEnabled
    ? ['https://ledfx.local:8889', 'http://localhost:8888']
    : ['http://localhost:8888']
  const hosts = JSON.parse(
    window.localStorage.getItem('ledfx-hosts') || JSON.stringify(defaultHosts)
  )

  const { isConnected } = useWebSocket()
  const disconnected = useStore((state) => state.disconnected)
  const clearSnackbar = useStore((state) => state.ui.clearSnackbar)
  const { isAvailable, isRunning } = useSongDetector()
  const setSd = useStore((state) => state.ui.setSd)

  useEffect(() => {
    if (disconnected === false) {
      window.localStorage.removeItem('undefined')
      setDialogOpen(false, true)
      clearSnackbar()
      if (window.localStorage.getItem('core-init') !== 'initialized') {
        window.localStorage.setItem('core-init', 'initialized')
      }
    }
  }, [disconnected, setDialogOpen, clearSnackbar])

  const invisible = () => {
    switch (pathname.split('/')[1]) {
      case 'device':
        return false
      case 'Scenes':
        return false
      case 'Settings':
        return false
      case 'Devices':
        return false
      case 'Integrations':
        return false
      default:
        return true
    }
  }

  const handleLeftBarOpen = () => {
    setLeftBarOpen(true)
  }

  const changeHost = () => {
    setDialogOpen(true, true)
  }

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configUrl = new URL('frontend_config.json', window.location.href).href
        const res = await fetch(configUrl)

        if (!res.ok) {
          console.error(
            `Failed to fetch frontend_config.json: ${res.status} ${res.statusText} from ${configUrl}`
          )
          return
        }

        const configData: FrontendConfig = await res.json()
        setFrConfig(configData)
      } catch (error: any) {
        console.error(
          'Error fetching frontend_config.json:',
          error.message || 'An unknown error occurred while fetching config.'
        )
      }
    }

    if (typeof window !== 'undefined' && window.location) {
      fetchConfig()
    } else {
      console.error('Cannot fetch config: "window.location" is not available.')
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('ledfx-cloud-jwt')
    if (token) {
      // Optionally, you can add logic here to validate the token or fetch user info
    }
  }, [pathname])

  const getUpdateInfo = useStore((state) => state.getUpdateInfo)

  useEffect(() => {
    if (isAndroidApp()) return
    const checkForUpdates = async () => {
      const updateInfo = await getUpdateInfo(false)
      if (updateInfo?.status === 'success' && updateInfo?.payload?.type === 'warning') {
        setUpdateAvailable(true)
        if (
          compareVersions(latestTag.replace('v', ''), pkg.version) === 1 &&
          Date.now() -
            parseInt(window.localStorage.getItem('last-update-notification') || '0', 10) >
            60 * 1000 * 60
        ) {
          Ledfx('/api/notify', 'PUT', {
            title: 'Update available',
            text: 'A new version of LedFx has been released'
          })
          window.localStorage.setItem('last-update-notification', `${Date.now()}`)
        }
      }
    }

    checkForUpdates()
  }, [getUpdateInfo, latestTag])

  useEffect(() => {
    if (isAndroidApp()) return
    if (frConfig?.updateUrl) {
      const latest = async () => {
        try {
          const res = await fetch(frConfig.updateUrl)
          if (!res.ok) {
            console.error(`Failed to fetch latest tag from ${frConfig.updateUrl}: ${res.status}`)
            return null
          }
          const resp = await res.json()
          return resp.tag_name as string
        } catch (error) {
          console.error('Error fetching latest tag:', error)
          return null
        }
      }
      latest().then((r) => {
        if (r && r !== latestTag) {
          setLatestTag(r)
        }
      })
    }
  }, [frConfig, latestTag, setLatestTag])

  useEffect(() => {
    const t = window.localStorage.getItem('ledfx-theme')
    if (t) {
      // Optionally, you can add logic here to apply the theme or fetch theme settings
    }
  }, [])

  useEffect(() => {
    if (features.wakelock) {
      requestWakeLock()
    } else {
      releaseWakeLock()
    }
    return () => {
      releaseWakeLock()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features.wakelock])

  const slug = pathname.split('/')[1]

  useEffect(() => {
    if (isTv) {
      setQrConnectOpen(true)
      // setFeatures('firetv', true) // This might not be needed if handled elsewhere
    }
  }, [isTv, userClosedQrConnector, setQrConnectOpen])

  return (
    <>
      {isElectron() && platform !== 'darwin' && (
        <div
          className="titlebar"
          style={{
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          <div className="titlebarLogo" />
          LedFx
        </div>
      )}
      {!(isElectron() && window.localStorage.getItem('lock') === 'activated') && (
        <AppBar
          enableColorOnDark
          color="secondary"
          position="fixed"
          sx={[
            {
              paddingTop: isElectron() && platform !== 'darwin' ? '32px' : 0,
              zIndex: 10,

              transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
              })
            },
            ios
              ? {
                  background: 'rgba(54,54,54,0.8)'
                }
              : {
                  background: ''
                },
            ios
              ? {
                  backdropFilter: 'blur(20px)'
                }
              : {
                  backdropFilter: ''
                },
            ios
              ? {
                  color: '#fff'
                }
              : {
                  color: ''
                },
            leftBarOpen && {
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: `${drawerWidth}px`,
              transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
              })
            }
          ]}
        >
          <Toolbar
            style={{
              justifyContent: 'space-between',
              minHeight: 56
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 16 }}>
              {LeftButtons(pathname, history, leftBarOpen, handleLeftBarOpen)}

              {isAndroidApp() && (
                <Button
                  variant="text"
                  size="small"
                  color="inherit"
                  onClick={() => exitAndroidApp()}
                  sx={{
                    position: 'absolute',
                    top: 13,
                    left: 90,
                    width: 170,
                    textTransform: 'none'
                  }}
                  startIcon={<BladeIcon style={{ position: 'relative' }} name="mdi:exit-to-app" />}
                >
                  Stop Service & Exit
                </Button>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && false && <CrashButton />}

            <Typography
              variant="h6"
              noWrap
              style={{ margin: '0 auto', display: 'flex', alignItems: 'center' }}
            >
              {features.firetv && <FireTv />}
              {Title(pathname, latestTag, updateAvailable, virtuals, frConfig)}
              {window.location.origin !== 'https://ledfx.stream' && (
                <QrConnector hosts={[...hosts]} />
              )}
            </Typography>
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                top: 4,
                right: 16
              }}
            >
              {!isConnected ? (
                <Box>
                  <IconButton
                    aria-label="display more actions"
                    edge="end"
                    color="inherit"
                    onClick={changeHost}
                    className="step-two"
                    style={{ position: 'absolute', right: '4rem' }}
                  >
                    <BladeIcon style={{ position: 'relative' }} name="mdi:lan-disconnect" />
                    <CircularProgress
                      size={44}
                      style={{
                        color: 'rgba(0,0,0,0.6)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                    />
                  </IconButton>
                </Box>
              ) : (
                <>
                  {/* Song Detector Status IconButton - opens widget */}
                  {isElectron() && isAvailable && (
                    <Tooltip
                      title={
                        isRunning
                          ? 'Song Detector: Running - Click to open'
                          : 'Song Detector: Stopped - Click to open'
                      }
                    >
                      <IconButton
                        aria-label="song detector status"
                        edge="end"
                        color="inherit"
                        onClick={() => setSd(true)}
                      >
                        <BladeIcon
                          style={{
                            position: 'relative',
                            color: isRunning ? '#4caf50' : 'rgba(255,255,255,0.3)'
                          }}
                          name="mdi:music-circle"
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  <GlobalActionBar className="hideHd" />
                </>
              )}
              {!(window.localStorage.getItem('guestmode') === 'activated') && (
                <TopBarMenu slug={slug} invisible={invisible()} />
              )}
            </div>
          </Toolbar>
        </AppBar>
      )}
    </>
  )
}

export default TopBar
