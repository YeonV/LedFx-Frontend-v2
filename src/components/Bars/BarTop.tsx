import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { compareVersions } from 'compare-versions'
import {
  Menu as MenuIcon,
  MoreVert,
  Language,
  BarChart,
  GitHub,
  ChevronLeft,
  Login,
  Logout,
  Lan,
  Settings
} from '@mui/icons-material'
import isElectron from 'is-electron'
import {
  AppBar,
  Box,
  Badge,
  Toolbar,
  CircularProgress,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
  useTheme,
  Select,
  Stack,
  ListItemText,
  Divider,
  Tooltip
} from '@mui/material'
import { styled } from '@mui/styles'

import useStore from '../../store/useStore'
import { drawerWidth, ios } from '../../utils/helpers'
import TourDevice from '../Tours/TourDevice'
import TourScenes from '../Tours/TourScenes'
import TourSettings from '../Tours/TourSettings'
import TourDevices from '../Tours/TourDevices'
import TourIntegrations from '../Tours/TourIntegrations'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import GlobalActionBar from '../GlobalActionBar'
import pkg from '../../../package.json'
import { Ledfx } from '../../api/ledfx'
import TourHome from '../Tours/TourHome'
import { backendUrl } from '../../pages/Device/Cloud/CloudComponents'
import { ledfxThemes, themes } from '../../themes/AppThemes'
import useWakeLock from '../../utils/useWakeLook'
import OrderListDialog from '../DnD/OrderListDialog'
import QrConnector from '../Dialogs/QrConnector'

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

const LeftButtons = (pathname: any, history: any, open?: boolean, handleLeftBarOpen?: any) => {
  const theme = useTheme()

  if (
    (pathname.split('/').length === 3 && pathname.split('/')[1] === 'device') ||
    (pathname.split('/').length === 3 && pathname.split('/')[1] === 'graph') ||
    pathname === '/Settings'
  ) {
    if (ios) {
      return (
        <IconButton size="large" color="inherit" onClick={() => history(-1)}>
          <ChevronLeft sx={{ fontSize: 32 }} />
        </IconButton>
      )
    }
    return (
      <Button
        size="large"
        variant="text"
        color="inherit"
        startIcon={<ChevronLeft />}
        onClick={() => history(-1)}
        sx={{ mt: 0.9 }}
      >
        Back
      </Button>
    )
  }
  if (!open) {
    if (ios) {
      return (
        <Box
          style={{
            backgroundImage: 'url(/icon.png)',
            marginTop: 10,
            width: 32,
            height: 32,
            backgroundSize: 'contain'
          }}
          onClick={handleLeftBarOpen}
        />
      )
    }
    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleLeftBarOpen}
        edge="start"
        sx={{ marginRight: theme.spacing(2), top: 8 }}
        className="step-three"
      >
        <MenuIcon />
      </IconButton>
    )
  }
  return null
}

const Title = (
  pathname: string,
  latestTag: string,
  updateAvailable: boolean,
  virtuals: any,
  frConfig: FrontendConfig | null
) => {
  const t = window.localStorage.getItem('ledfx-theme')
  const newVerOnline =
    latestTag.replace('v', '').includes('-b') && pkg.version.includes('-b')
      ? compareVersions(latestTag.replace('v', '').split('-b')[1], pkg.version.split('-b')[1]) === 1
      : compareVersions(latestTag.replace('v', ''), pkg.version) === 1
  if (pathname === '/') {
    return (
      <Stack direction={'row'}>
        <Tooltip title={`LedFx v${pkg.version}`} placement="bottom">
          <Typography variant="h6" noWrap>
            LedFx
          </Typography>
        </Tooltip>
        {!process.env.MS_STORE && newVerOnline && frConfig?.updateUrl && frConfig.releaseUrl ? (
          <Button
            color={t && ['DarkBw', 'LightBw'].includes(t) ? 'primary' : 'error'}
            variant="contained"
            onClick={() => frConfig && window.open(frConfig.releaseUrl)}
            sx={{ ml: 2 }}
          >
            New Update
          </Button>
        ) : null}
        {!process.env.MS_STORE && updateAvailable ? (
          <Button
            color="error"
            variant="contained"
            onClick={() => window.open('https://github.com/LedFx/LedFx/releases/latest')}
            sx={{ ml: 2 }}
          >
            New Core Update
          </Button>
        ) : null}
      </Stack>
    )
  }
  if (pathname.split('/').length === 3 && pathname.split('/')[1] === 'device') {
    return virtuals[pathname.split('/')[2]]?.config.name
  }
  if (pathname === '/User') {
    return `LedFx Cloud ${localStorage.getItem('username') !== 'YeonV' ? 'Free' : ''} User`
  }
  return pathname.split('/').pop()
}

const TopBar = () => {
  const { requestWakeLock, releaseWakeLock } = useWakeLock()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const history = useNavigate()
  const theme = useTheme()

  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [loggingIn, setLogginIn] = useState(false)

  const open = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open)
  const [frConfig, setFrConfig] = useState<FrontendConfig | null>(null)
  const latestTag = useStore((state) => state.ui.latestTag)
  const currentTheme = useStore((state) => state.ui.currentTheme)
  const setCurrentTheme = useStore((state) => state.ui.setCurrentTheme)
  const setLatestTag = useStore((state) => state.ui.setLatestTag)
  const setLeftBarOpen = useStore((state) => state.ui.setLeftBarOpen)
  const qrConnectOpen = useStore((state) => state.dialogs.qrConnector?.open)
  const setQrConnectOpen = useStore((state) => state.setDialogOpenQrConnector)
  const virtuals = useStore((state) => state.virtuals)
  const setDialogOpen = useStore((state) => state.setDialogOpen)
  const setHostManager = useStore((state) => state.setHostManager)
  const toggleGraphs = useStore((state) => state.toggleGraphs)
  const graphs = useStore((state) => state.graphs)
  const isLogged = useStore((state) => state.isLogged)
  const setIsLogged = useStore((state) => state.setIsLogged)
  const disconnected = useStore((state) => state.disconnected)
  const setDisconnected = useStore((state) => state.setDisconnected)
  const clearSnackbar = useStore((state) => state.ui.clearSnackbar)
  const reloadTheme = useStore((state) => state.ui.reloadTheme)
  const features = useStore((state) => state.features)
  const platform = useStore((state) => state.platform)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const invDevice = useStore((state) => state.tours.device)
  const invSettings = useStore((state) => state.tours.settings)
  const invIntegrations = useStore((state) => state.tours.integrations)
  const invDevices = useStore((state) => state.tours.devices)
  const invScenes = useStore((state) => state.tours.scenes)
  const coreParams = useStore((state) => state.coreParams)
  const isCC = coreParams && Object.keys(coreParams).length > 0
  const updateNotificationInterval = useStore((state) => state.updateNotificationInterval)
  const hosts = useStore((state) => state.config.hosts) || []
  const port = useStore((state) => state.config.port) || 8888

  const isAndroid = process.env.REACT_APP_LEDFX_ANDROID === 'true'
  const isAndroidTv = isAndroid && port === 8889

  const isCreator = localStorage.getItem('ledfx-cloud-role') === 'creator'
  const invisible = () => {
    switch (pathname.split('/')[1]) {
      case 'device':
        return invDevice
      case 'Scenes':
        return invScenes
      case 'Settings':
        return invSettings
      case 'Devices':
        return invDevices
      case 'Integrations':
        return invIntegrations
      default:
        return true
    }
  }

  const handleLeftBarOpen = () => {
    setLeftBarOpen(true)
  }
  const changeHost = () => {
    setDialogOpen(true, true)
    setAnchorEl(null)
  }
  const changeHostManager = () => {
    setHostManager(true)
    setAnchorEl(null)
  }

  const changeGraphs = () => {
    toggleGraphs()
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const logout = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault()
    localStorage.removeItem('jwt')
    localStorage.removeItem('username')
    localStorage.removeItem('ledfx-cloud-userid')
    localStorage.removeItem('ledfx-cloud-role')
    setIsLogged(false)
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
    setIsLogged(!!localStorage.getItem('jwt'))
  }, [pathname, setIsLogged])

  const getUpdateInfo = useStore((state) => state.getUpdateInfo)

  useEffect(() => {
    const checkForUpdates = async () => {
      const updateInfo = await getUpdateInfo(false)
      if (updateInfo?.status === 'success' && updateInfo?.payload?.type === 'warning') {
        setUpdateAvailable(true)
        if (
          compareVersions(latestTag.replace('v', ''), pkg.version) === 1 &&
          Date.now() -
            parseInt(window.localStorage.getItem('last-update-notification') || '0', 10) >
            updateNotificationInterval * 1000 * 60
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
  }, [updateNotificationInterval, getUpdateInfo, latestTag])

  useEffect(() => {
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
    const handleDisconnect = (e: any) => {
      if (e.detail) {
        setDisconnected(e.detail.isDisconnected)
        if (e.detail.isDisconnected === false) {
          window.localStorage.removeItem('undefined')
          setDialogOpen(false, true)
          clearSnackbar()
          if (window.localStorage.getItem('core-init') !== 'initialized') {
            window.localStorage.setItem('core-init', 'initialized')
          }
        }
      }
    }
    document.addEventListener('disconnected', handleDisconnect)
    return () => {
      document.removeEventListener('disconnected', handleDisconnect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = window.localStorage.getItem('ledfx-theme')
    if (t && t !== currentTheme) {
      setCurrentTheme(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isAndroidTv) setQrConnectOpen(true)
  }, [isAndroidTv, setQrConnectOpen])

  return (
    <>
      {isElectron() && platform !== 'darwin' && (
        <div className="titlebar">
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
            open && {
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
              {LeftButtons(pathname, history, open, handleLeftBarOpen)}
            </div>

            <Typography
              variant="h6"
              noWrap
              style={{ margin: '0 auto', display: 'flex', alignItems: 'center' }}
            >
              {Title(pathname, latestTag, updateAvailable, virtuals, frConfig)}

              <QrConnector
                // hosts={['http://10.0.0.2:8888', ...hosts]}
                hosts={hosts}
              />
            </Typography>
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                top: 4,
                right: 16
              }}
            >
              {disconnected ? (
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
                <GlobalActionBar className="hideHd" />
              )}
              {!(window.localStorage.getItem('guestmode') === 'activated') && (
                <IconButton
                  aria-label="display more actions"
                  edge="end"
                  color="inherit"
                  onClick={handleClick}
                  className="step-two"
                  style={{ marginLeft: '1rem' }}
                >
                  <Badge variant="dot" color="error" invisible={invisible()}>
                    <MoreVert sx={{ fontSize: 32 }} />
                  </Badge>
                </IconButton>
              )}
            </div>

            {!(window.localStorage.getItem('guestmode') === 'activated') && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                {features.cloud && isLogged && (
                  <MenuItem
                    sx={{ pb: 2 }}
                    divider
                    onClick={() => {
                      setAnchorEl(null)
                      navigate('/User')
                    }}
                  >
                    <ListItemIcon style={{ marginTop: -13 }}>
                      <StyledBadge
                        badgeContent={
                          localStorage.getItem('ledfx-cloud-role') === 'authenticated'
                            ? 'logged in'
                            : localStorage.getItem('ledfx-cloud-role')
                        }
                        color="primary"
                      >
                        <GitHub />
                      </StyledBadge>
                    </ListItemIcon>
                    <div>
                      <div>{localStorage.getItem('username')}</div>
                    </div>
                  </MenuItem>
                )}
                {features.cloud && (
                  <MenuItem
                    onClick={(e: any) => {
                      e.preventDefault()
                      setLogginIn(true)
                      if (isLogged) {
                        setLogginIn(false)
                        logout(e)
                      } else if (window.location.pathname.includes('hassio_ingress')) {
                        window.location.href = `${backendUrl}/connect/github?callback=${window.location.origin}`
                      } else if (isElectron()) {
                        window.open(
                          `${backendUrl}/connect/github?callback=ledfx://auth/github/`,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      } else {
                        window.open(
                          `${backendUrl}/connect/github?callback=${window.location.origin}`,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                    }}
                  >
                    <ListItemIcon>
                      {isLogged ? (
                        <Logout />
                      ) : loggingIn ? (
                        <Box sx={{ display: 'flex', marginLeft: 0.6 }}>
                          <CircularProgress size="0.9rem" />
                        </Box>
                      ) : (
                        <Login />
                      )}
                    </ListItemIcon>
                    {isLogged ? 'Logout' : 'Login with Github'}
                  </MenuItem>
                )}
                <MenuItem onClick={changeHost}>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  Change Host
                </MenuItem>
                {isCC && isCreator && (
                  <MenuItem onClick={changeHostManager}>
                    <ListItemIcon>
                      <Lan />
                    </ListItemIcon>
                    Host Manager
                  </MenuItem>
                )}
                <MenuItem onClick={changeGraphs}>
                  <ListItemIcon>
                    <BarChart color={graphs ? 'inherit' : 'secondary'} />
                  </ListItemIcon>
                  {!graphs ? 'Enable Graphs' : 'Disable Graphs'}
                </MenuItem>
                {slug === 'device' ? (
                  <TourDevice cally={() => setAnchorEl(null)} />
                ) : slug === 'Scenes' ? (
                  <TourScenes cally={() => setAnchorEl(null)} />
                ) : slug === 'Settings' ? (
                  <TourSettings cally={() => setAnchorEl(null)} />
                ) : slug === 'Devices' ? (
                  [
                    <OrderListDialog
                      key={'order'}
                      mode="drawer"
                      onOpen={() => setAnchorEl(null)}
                    />,
                    <TourDevices key={'device-tour'} cally={() => setAnchorEl(null)} />
                  ]
                ) : slug === 'Integrations' ? (
                  <TourIntegrations cally={() => setAnchorEl(null)} />
                ) : (
                  <TourHome variant="menuitem" cally={() => setAnchorEl(null)} />
                )}
                {slug !== 'Settings' && [
                  <Divider key={'divider1'} />,
                  <MenuItem
                    key={'settings'}
                    onClick={() => {
                      navigate(
                        `/Settings?${slug === 'device' ? 'effects' : slug === 'Scenes' ? 'scenes' : slug === 'Devices' ? 'devices' : ''}`
                      )
                      setAnchorEl(null)
                    }}
                  >
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                ]}
                {localStorage.getItem('username') === 'YeonV' && <Divider key={'divider2'} />}
                {localStorage.getItem('username') === 'YeonV' && (
                  <Select
                    IconComponent={() => null}
                    fullWidth
                    sx={{ pl: 2 }}
                    disableUnderline
                    value={currentTheme}
                    onChange={(e) => {
                      setCurrentTheme(e.target.value)
                      window.localStorage.setItem('ledfx-theme', e.target.value)
                      reloadTheme()
                    }}
                  >
                    {Object.keys(ledfxThemes).map((t) => (
                      <MenuItem key={t} value={t}>
                        <Stack direction={'row'}>
                          <ListItemIcon sx={{ alignItems: 'center', minWidth: 38 }}>
                            <BladeIcon name={t.startsWith('Dark') ? 'DarkMode' : 'LightMode'} />
                          </ListItemIcon>
                          <ListItemText>{t}</ListItemText>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {localStorage.getItem('username') === 'YeonV' && (
                  <MenuItem
                    onClick={() => {
                      const t = window.localStorage.getItem('ledfx-theme') || 'DarkBlue'
                      const mode = t.startsWith('Dark') ? 'dark' : 'light'
                      const color =
                        ((mode === 'dark'
                          ? t.split('Dark')[1]
                          : t.split('Light')[1]
                        )?.toLowerCase() as keyof typeof themes) || 'blue'
                      const newTheme =
                        (mode === 'dark' ? 'Light' : 'Dark') +
                        color.charAt(0).toUpperCase() +
                        color.slice(1)
                      setCurrentTheme(newTheme)
                      window.localStorage.setItem('ledfx-theme', newTheme)
                      reloadTheme()
                    }}
                  >
                    <Stack direction={'row'}>
                      <ListItemIcon sx={{ alignItems: 'center', minWidth: 38 }}>
                        <BladeIcon
                          name={theme.palette.mode === 'dark' ? 'DarkMode' : 'LightMode'}
                        />
                      </ListItemIcon>
                      <ListItemText>DarkMode</ListItemText>
                    </Stack>
                  </MenuItem>
                )}
                {localStorage.getItem('username') === 'YeonV' && (
                  <Select
                    IconComponent={() => null}
                    fullWidth
                    sx={{ pl: 2 }}
                    disableUnderline
                    value={
                      ((((window.localStorage.getItem('ledfx-theme') || 'DarkBlue').startsWith(
                        'Dark'
                      )
                        ? 'dark'
                        : 'light') === 'dark'
                        ? (window.localStorage.getItem('ledfx-theme') || 'DarkBlue').split(
                            'Dark'
                          )[1]
                        : (window.localStorage.getItem('ledfx-theme') || 'DarkBlue').split(
                            'Light'
                          )[1]
                      )?.toLowerCase() as keyof typeof themes) || 'blue'
                    }
                    onChange={(e) => {
                      const t = window.localStorage.getItem('ledfx-theme') || 'DarkBlue'
                      const mode = t.startsWith('Dark') ? 'dark' : 'light'
                      const newTheme =
                        (mode === 'dark' ? 'Dark' : 'Light') +
                        e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1)
                      setCurrentTheme(newTheme)
                      window.localStorage.setItem('ledfx-theme', newTheme)
                      reloadTheme()
                    }}
                  >
                    {Object.keys(themes).map((t) => (
                      <MenuItem key={t} value={t}>
                        <Stack direction={'row'}>
                          <ListItemIcon
                            sx={{
                              alignItems: 'center',
                              minWidth: 38,
                              color:
                                themes[t as keyof typeof themes][theme.palette.mode].palette.primary
                                  .main
                            }}
                          >
                            <BladeIcon name={'circle'} />
                          </ListItemIcon>
                          <ListItemText>{t.charAt(0).toUpperCase() + t.slice(1)}</ListItemText>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Menu>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  )
}

export default TopBar
