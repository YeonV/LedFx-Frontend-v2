import { ledfxThemes, ledfxTheme, common } from './themes/AppThemes'
import { WebSocketProvider } from './utils/Websocket/WebSocketProvider'
import { WebSocketManager } from './utils/Websocket/WebSocketManager'
import { createTheme, ThemeProvider } from '@mui/material'
import { ThemeProvider as ThemeProviderNew } from '@mui/styles'
import { initFrontendConfig } from './utils/helpers'
import { useEffect, useMemo } from 'react'
import { SnackbarProvider } from 'notistack'

import FpsViewerWrapper from './components/Integrations/Spotify/Widgets/FpsViewer/FpsViewer.wrapper'
import SpotifyProvider from './components/Integrations/Spotify/SpotifyProvider'
import useSongDetectorAutoApply from './hooks/useSongDetectorAutoApply'
import Visualiser from './components/AudioVisualiser/AudioVisualiser'
import useAppSubscriptions from './hooks/useAppSubscriptions'
import useWindowDimensions from './utils/useWindowDimension'
import useProtocolHandler from './hooks/useProtocolHandler'
import FiledropProvider from './utils/FiledropProvider'
import useIpcHandlers from './hooks/useIpcHandlers'
import SpecialEvents from './components/SpecialEvents'
import FireTvBar from './components/FireTv/FireTvBar'
import AppStyles from './components/AppStyles'
import useStore from './store/useStore'
import Pages from './pages/Pages'

import './App.css'

export default function App() {
  // 1. State & Selectors
  const features = useStore((state) => state.features)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const getSchemas = useStore((state) => state.getSchemas)
  const getClients = useStore((state) => state.getClients)
  const changeTheme = useStore((state) => state.ui.changeTheme)

  // 2. Custom Hooks
  useWindowDimensions()
  useSongDetectorAutoApply()
  useIpcHandlers()
  useProtocolHandler()

  // 3. Memoized values
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

  // 4. Initialization Effects
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
                <AppStyles />
                <FpsViewerWrapper />
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
