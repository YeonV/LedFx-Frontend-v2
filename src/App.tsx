import { useEffect, useMemo } from 'react'
import { ThemeProvider as ThemeProviderNew } from '@mui/styles'
import { createTheme, ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import useStore from './store/useStore'
import useWindowDimensions from './utils/useWindowDimension'
import './App.css'
import { initFrontendConfig } from './utils/helpers'
import Pages from './pages/Pages'
import SpotifyProvider from './components/Integrations/Spotify/SpotifyProvider'
import { ledfxThemes, ledfxTheme, common } from './themes/AppThemes'
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
import SpecialEvents from './components/SpecialEvents'

export default function App() {
  useWindowDimensions()
  const features = useStore((state) => state.features)

  // Mount global song detector auto-apply hook
  useSongDetectorAutoApply()
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const getSchemas = useStore((state) => state.getSchemas)
  const getClients = useStore((state) => state.getClients)
  const changeTheme = useStore((state) => state.ui.changeTheme)

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
    if (window.location.pathname.includes('hassio_ingress')) {
      console.info(
        '%c HomeAssistant detected ',
        'padding: 3px 5px; border-radius: 5px; color: #ffffff; background-color: #038fc7;'
      )
    }
  }, [])

  return (
    <ThemeProviderNew theme={theme}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={15}>
          <WebSocketProvider>
            <HookLoader />
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
            {features.bgvisualiser && <Visualiser backgroundMode={true} />}
          </WebSocketProvider>
          <SpecialEvents />
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeProviderNew>
  )
}

const HookLoader = () => {
  useAppSubscriptions()
  return null
}
