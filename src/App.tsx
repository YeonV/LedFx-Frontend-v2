import { useEffect, useMemo } from 'react'
import { ThemeProvider as ThemeProviderNew } from '@mui/styles'
import { createTheme, ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import isElectron from 'is-electron'
import useStore from './store/useStore'
import useWindowDimensions from './utils/useWindowDimension'
import './App.css'
import { initFrontendConfig } from './utils/helpers'
import WaveLines from './components/Icons/waves'
import Pages from './pages/Pages'
import SpotifyProvider from './components/Integrations/Spotify/SpotifyProvider'
import { ledfxThemes, ledfxTheme, common } from './themes/AppThemes'
import xmas from './assets/xmas.png'
import newyear from './assets/fireworks.jpg'
import FiledropProvider from './utils/FiledropProvider'
import FpsViewerWrapper from './components/Integrations/Spotify/Widgets/FpsViewer/FpsViewer.wrapper'
import useAppSubscriptions from './hooks/useAppSubscriptions'
import useIpcHandlers from './hooks/useIpcHandlers'
import useProtocolHandler from './hooks/useProtocolHandler'
import { WebSocketProvider } from './utils/Websocket/WebSocketProvider'
import { WebSocketManager } from './utils/Websocket/WebSocketManager'
import FireTvBar from './components/FireTv/FireTvBar'
import useSongDetectorAutoApply from './hooks/useSongDetectorAutoApply'
import Visualiser from './components/AudioVisualiser/AudioVisualiser'
import { Box } from '@mui/system'

export default function App() {
  const { height, width } = useWindowDimensions()
  const features = useStore((state) => state.features)

  // Mount global song detector auto-apply hook
  useSongDetectorAutoApply()
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const getSchemas = useStore((state) => state.getSchemas)
  const getClients = useStore((state) => state.getClients)
  const changeTheme = useStore((state) => state.ui.changeTheme)

  useAppSubscriptions()
  useIpcHandlers()
  useProtocolHandler()
  const theme = useMemo(
    () =>
      createTheme({
        ...ledfxThemes[window.localStorage.getItem('ledfx-theme') ?? ledfxTheme],
        ...common,
        palette: {
          ...ledfxThemes[window.localStorage.getItem('ledfx-theme') ?? ledfxTheme]?.palette
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [changeTheme]
  )

  useEffect(() => {
    getVirtuals()
    getSystemConfig()
    getSchemas()
    getClients()
  }, [getVirtuals, getSystemConfig, getSchemas, getClients])

  useEffect(() => {
    initFrontendConfig()

    console.info(
      '%c Ledfx %c\n ReactApp by Blade ',
      'padding: 10px 40px; color: #ffffff; border-radius: 5px 5px 0 0; background-color: #800000;',
      'background: #fff; color: #800000; border-radius: 0 0 5px 5px;padding: 5px 0;'
    )
    if (window.location.pathname.includes('hassio_ingress'))
      console.info(
        '%c HomeAssistant detected ',
        'padding: 3px 5px; border-radius: 5px; color: #ffffff; background-color: #038fc7;'
      )
    if (isElectron()) {
      window.api.send('toMain', { command: 'get-platform' })
      window.api.send('toMain', { command: 'get-core-params' })
      window.api.send('toMain', { command: 'close-others' })
    }
  }, [])

  return (
    <ThemeProviderNew theme={theme}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={15}>
          <WebSocketProvider>
            <WebSocketManager />
            <SpotifyProvider>
              <FiledropProvider>
                <CssBaseline />
                <FpsViewerWrapper />
                <GlobalStyles
                  styles={{
                    body: {
                      colorScheme: theme.palette.mode
                    }
                  }}
                />
                <Pages />
                {features.firetv && <FireTvBar />}
              </FiledropProvider>
            </SpotifyProvider>
            {/* exclude for /visualiser */}
            {features.bgvisualiser && (
              <Box
                sx={{
                  width: '100vw',
                  height: 'calc(100vh - 64px)',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  zIndex: -1
                }}
              >
                <Visualiser backgroundMode={true} />
              </Box>
            )}
          </WebSocketProvider>
          {features.waves && (
            <WaveLines
              startColor={theme.palette.primary.main}
              stopColor={theme.palette.accent.main || '#ffdc0f'}
              width={width - 8}
              height={height}
            />
          )}
          {new Date().getFullYear() === 2024 &&
            new Date().getMonth() === 11 &&
            new Date().getDate() >= 24 && (
              <div
                style={{
                  margin: 'auto',
                  backgroundImage: `url(${xmas})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom',
                  display: 'block',
                  zIndex: -1,
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  opacity: 0.7
                }}
              />
            )}
          {new Date().getFullYear() === 2025 &&
            new Date().getMonth() === 0 &&
            new Date().getDate() === 1 && (
              <div
                style={{
                  margin: 'auto',
                  backgroundImage: `url(${newyear})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom right',
                  display: 'block',
                  zIndex: -1,
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  opacity: 0.7
                }}
              />
            )}
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeProviderNew>
  )
}
