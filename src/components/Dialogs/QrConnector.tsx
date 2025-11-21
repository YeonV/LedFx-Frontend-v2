import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Slide,
  Paper,
  Radio,
  CircularProgress,
  Stack,
  Button,
  useMediaQuery
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { QrCode2 as QrCodeIcon, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import ledfxLogoForQr from '../../assets/logo.png'
import QrCodeWithLogo from '../QrScanner/QrCodeWithLogo'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { useSubscription } from '../../utils/Websocket/WebSocketProvider'
import FireTvDebugger from '../FireTv/FireTvDebugger'
import { SiDevdotto } from 'react-icons/si'
import { useFireTvStore } from '../FireTv/useFireTvStore'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface QrConnectorProps {
  hosts: string[]
  rotationInterval?: number
}

const QrConnector: React.FC<QrConnectorProps> = ({
  hosts: rawHosts = [],
  rotationInterval = 7000
}) => {
  const dialogOpen = useStore((state) => state.dialogs.qrConnector?.open)
  const setDialogOpen = useStore((state) => state.setDialogOpenQrConnector)
  const setUserClosedQrConnector = useStore((state) => state.setUserClosedQrConnector)
  const [activeHostIndex, setActiveHostIndex] = useState(0)
  const [formattedHosts, setFormattedHosts] = useState<string[]>([])
  const navigate = useNavigate()
  const port = useStore((state) => state.config.port || 8888)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const paused = useStore((state) => state.paused)
  const togglePause = useStore((state) => state.togglePause)
  const features = useStore((state) => state.features)
  const isCustomMode = useFireTvStore((state) => state.isCustomMode)
  const setDefaultButtons = useFireTvStore((state) => state.setDefaultButtons)
  const isLandscape = useMediaQuery('(orientation: landscape)')

  const SCROLL_AMOUNT = window.innerHeight * 0.6 // 60% of viewport height

  // Set the default buttons only if FireTV is enabled
  useEffect(() => {
    if (!features.firetv) return

    setDefaultButtons({
      menu: true,
      play: {
        label: paused ? 'Play' : 'Pause',
        action: () => togglePause()
      },
      ...(isCustomMode && {
        rewind: {
          label: 'Scroll Up',
          action: () => {
            if (window.scrollY > 0) {
              window.scrollBy({ top: -SCROLL_AMOUNT, behavior: 'smooth' })
            }
          }
        },
        forward: {
          label: 'Scroll Down',
          action: () => {
            window.scrollBy({ top: SCROLL_AMOUNT, behavior: 'smooth' })
          }
        }
      }),
      dpad: {
        label: isCustomMode ? 'Pointer' : 'D-Pad'
      },
      home: {
        label: 'Minimize'
      }
    })
  }, [paused, isCustomMode, togglePause, setDefaultButtons, features.firetv, SCROLL_AMOUNT])

  const [devMode, setDevMode] = useState(false)
  const tooggleDev = () => {
    setDevMode(!devMode)
  }
  const [keyPresses, setKeyPresses] = useState<
    Array<{ key: string; code: string; keyCode?: number }>
  >([])

  useEffect(() => {
    const isValidHttpUrl = (host: string) => {
      return /^https?:\/\/[^ "]+$/.test(host)
    }

    const processedHosts = rawHosts
      .map((host) => {
        if (isValidHttpUrl(host)) {
          return host
        } else {
          if (!host.startsWith('http://') && !host.startsWith('https://')) {
            host = `http://${host}:${port}`
          }
          return host.replace(/\/$/, '')
        }
      })
      .filter((host) => host.startsWith('http://') || host.startsWith('https://'))

    setFormattedHosts(processedHosts)
    if (processedHosts.length > 0) {
      setActiveHostIndex(0)
    } else {
      setActiveHostIndex(-1)
    }
  }, [rawHosts, port])

  const activeHost =
    formattedHosts.length > 0 && activeHostIndex >= 0 && activeHostIndex < formattedHosts.length
      ? formattedHosts[activeHostIndex]
      : null

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setUserClosedQrConnector(true)
    setDialogOpen(false)
  }

  useSubscription('client_connected', () => {
    if (dialogOpen) {
      navigate('/Devices')
      handleCloseDialog()
    }
  })

  useEffect(() => {
    if (dialogOpen && formattedHosts.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveHostIndex((prevIndex) => (prevIndex + 1) % formattedHosts.length)
      }, rotationInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [dialogOpen, formattedHosts.length, rotationInterval])

  const handleListItemClick = (index: number) => {
    setActiveHostIndex(index)

    if (intervalRef.current) clearInterval(intervalRef.current)
    if (dialogOpen && formattedHosts.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveHostIndex((prevIndex) => (prevIndex + 1) % formattedHosts.length)
      }, rotationInterval)
    }
  }

  useEffect(() => {
    // if (process.env.NODE_ENV !== 'development' || !dialogOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // e.preventDefault() // Prevent default navigation
      setKeyPresses((prev) => {
        const newPresses = [
          {
            key: e.key || 'undefined',
            code: e.code || 'undefined',
            keyCode: e.keyCode,
            type: 'keydown',
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ].slice(0, 15) // Keep more history
        return newPresses
      })
    }

    // const handleKeyUp = (e: KeyboardEvent) => {
    //   setKeyPresses((prev) => {
    //     const newPresses = [
    //       {
    //         key: e.key || 'undefined',
    //         code: e.code || 'undefined',
    //         keyCode: e.keyCode,
    //         type: 'keyup',
    //         timestamp: new Date().toLocaleTimeString()
    //       },
    //       ...prev
    //     ].slice(0, 15)
    //     return newPresses
    //   })
    // }

    // Android TV/Fire TV might use these events
    const handleClick = (e: MouseEvent) => {
      setKeyPresses((prev) => {
        const newPresses = [
          {
            key: 'CLICK',
            code: `button: ${e.button}`,
            keyCode: e.button,
            type: 'click',
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ].slice(0, 15)
        return newPresses
      })
    }

    const handleFocus = (e: FocusEvent) => {
      setKeyPresses((prev) => {
        const newPresses = [
          {
            key: 'FOCUS',
            code: (e.target as HTMLElement)?.tagName || 'unknown',
            type: 'focus',
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ].slice(0, 15)
        return newPresses
      })
    }

    // Add all event listeners
    window.addEventListener('keydown', handleKeyDown, true) // Use capture phase
    // window.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('click', handleClick, true)
    document.addEventListener('focusin', handleFocus, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      // window.removeEventListener('keyup', handleKeyUp, true)
      window.removeEventListener('click', handleClick, true)
      document.removeEventListener('focusin', handleFocus, true)
    }
  }, [dialogOpen])

  return (
    <>
      <IconButton
        color="primary"
        aria-label="Show QR Connect Hosts"
        onClick={handleOpenDialog}
        sx={{ color: 'black', justifySelf: 'center', margin: 0 }}
      >
        <QrCodeIcon />
      </IconButton>
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', background: 'rgba(0,0,0,0.8)' }}>
          <Toolbar sx={{ minHeight: '40px !important' }}>
            <Stack
              direction="row"
              spacing={0}
              alignItems="center"
              justifyContent={'space-between'}
              sx={{ width: '100%' }}
            >
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={handleCloseDialog}
                startIcon={<ArrowBackIos />}
                sx={{ padding: '2px 20px', borderRadius: '8px' }}
              >
                Back
              </Button>
              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconButton size="small" sx={{ p: 0, mr: 1 }} onClick={tooggleDev}>
                  <SiDevdotto size={32} />
                </IconButton>
                Scan to Connect
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => {
                  navigate('/Devices')
                  handleCloseDialog()
                }}
                endIcon={<ArrowForwardIos />}
                sx={{ padding: '2px 20px', borderRadius: '8px' }}
              >
                Devices
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isLandscape ? 'row' : 'column',
            height: 'calc(100% - 64px)',
            background: 'linear-gradient(to bottom, #232323, #121212)',
            color: 'white'
          }}
        >
          {devMode ? (
            <Stack direction={'row'}>
              <FireTvDebugger />

              <Paper
                elevation={3}
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: 'rgba(255, 165, 0, 0.1)',
                  border: '1px solid orange',
                  overflowY: 'auto'
                }}
              >
                <Typography variant="h6" color="orange" gutterBottom>
                  🔧 DEBUG INFO
                </Typography>

                {/* Key Logger */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="orange">
                    Recent Key Presses:
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: 1,
                      maxHeight: 100,
                      overflowY: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }}
                  >
                    {keyPresses.length === 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        Press any key...
                      </Typography>
                    ) : (
                      keyPresses.map((kp, idx) => (
                        <Box key={idx} sx={{ mb: 0.5 }}>
                          <span style={{ color: '#4CAF50' }}>{kp.key}</span>
                          <span style={{ color: '#888', marginLeft: 8 }}>code: {kp.code}</span>
                          {kp.keyCode && (
                            <span style={{ color: '#888', marginLeft: 8 }}>
                              keyCode: {kp.keyCode}
                            </span>
                          )}
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>

                {/* System Info */}
                <Box>
                  <Typography variant="subtitle2" color="orange">
                    System Info:
                  </Typography>
                  <Box
                    component="table"
                    sx={{
                      mt: 1,
                      width: '100%',
                      '& td': {
                        padding: '4px 8px',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace'
                      },
                      '& td:first-of-type': {
                        color: '#FFB74D',
                        fontWeight: 'bold',
                        width: '40%'
                      }
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>User Agent:</td>
                        <td>{navigator.userAgent}</td>
                      </tr>
                      <tr>
                        <td>Platform:</td>
                        <td>{navigator.platform}</td>
                      </tr>
                      <tr>
                        <td>Is Android:</td>
                        <td>{process.env.REACT_APP_LEDFX_ANDROID === 'true' ? 'true' : 'false'}</td>
                      </tr>
                      <tr>
                        <td>Screen Size:</td>
                        <td>{`${window.screen.width}x${window.screen.height}`}</td>
                      </tr>
                      <tr>
                        <td>Window Size:</td>
                        <td>{`${window.innerWidth}x${window.innerHeight}`}</td>
                      </tr>
                      <tr>
                        <td>Orientation:</td>
                        <td>{isLandscape ? 'Landscape' : 'Portrait'}</td>
                      </tr>
                      <tr>
                        <td>Touch Support:</td>
                        <td>{('ontouchstart' in window).toString()}</td>
                      </tr>
                      <tr>
                        <td>Port:</td>
                        <td>{port}</td>
                      </tr>
                    </tbody>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          ) : (
            <>
              {/* Hosts List Section */}
              {formattedHosts.length > 0 ? (
                <Box
                  sx={{
                    p: 2,
                    pb: 0,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    flexShrink: 0,
                    maxWidth: 720,
                    alignSelf: 'center',
                    width: 'auto'
                  }}
                >
                  <List>
                    {formattedHosts.map((host, index) => (
                      <ListItem
                        key={host + index}
                        onClick={() => handleListItemClick(index)}
                        component={Paper}
                        variant="outlined"
                        elevation={activeHostIndex === index ? 8 : 1}
                        sx={{
                          position: 'relative',
                          mb: 1,
                          cursor: 'pointer',
                          borderColor:
                            activeHostIndex === index
                              ? 'rgba(255,255,255,0.5)'
                              : 'rgba(255,255,255,0.20)',
                          backgroundColor:
                            activeHostIndex === index
                              ? 'rgba(var(--mui-palette-primary-mainChannel) / 0.2)'
                              : 'transparent',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            borderColor: 'primary.light',
                            backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.1)'
                          },
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5
                        }}
                      >
                        <ListItemText
                          primary={host}
                          primaryTypographyProps={{
                            fontWeight: activeHostIndex === index ? 'bold' : 'normal',
                            color:
                              activeHostIndex === index
                                ? 'rgba(255,255,255,0.6)'
                                : 'rgba(255,255,255,0.2)',
                            fontSize: '1.1rem'
                          }}
                        />
                        {formattedHosts.length > 1 && (
                          <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                            <Radio
                              checked={activeHostIndex === index}
                              onChange={() => handleListItemClick(index)}
                              value={host}
                              name="host-radio-button"
                              size="small"
                              sx={{
                                color: 'rgba(255,255,255,0.7)',
                                '&.Mui-checked': {
                                  color: 'primary.main'
                                }
                              }}
                            />
                          </ListItemIcon>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No host instances provided.
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: { xs: 2, sm: 3, md: 4 },
                  overflow: 'hidden'
                }}
              >
                {activeHost ? (
                  <>
                    <Paper
                      elevation={6}
                      sx={{
                        p: { xs: 1, sm: 1.5 },
                        backgroundColor: 'transparent',
                        borderRadius: '8px',
                        display: 'inline-block',
                        maxWidth: '100%'
                      }}
                    >
                      <QrCodeWithLogo
                        key={activeHost}
                        data={activeHost}
                        logoSrc={ledfxLogoForQr}
                        logoSizeRatio={0.22}
                        width={Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 830)}
                        height={Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 830)}
                        qrCodeOptions={{
                          errorCorrectionLevel: 'H',
                          margin: 1
                        }}
                        imageSettings={{
                          fgColor: '#444444',
                          bgColor: '#1c1c1e'
                        }}
                      />
                    </Paper>
                  </>
                ) : formattedHosts.length > 0 ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Typography variant="subtitle1" color="text.secondary" align="center">
                    Please provide hosts to display QR codes.
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </>
  )
}

export default QrConnector
