import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material'
import { WebSocketManager } from './utils/Websocket/WebSocketManager'
import { SnackbarProvider } from 'notistack'
import { WebSocketProvider } from './utils/Websocket/WebSocketProvider'
import { HOME_ASSISTANT_MESSAGE, initFrontendConfig, WELCOME_MESSAGE } from './utils/helpers'
import { ThemeProvider as ThemeProviderNew } from '@mui/styles'
import useSongDetectorAutoApply from './hooks/useSongDetectorAutoApply'
import useAppSubscriptions from './hooks/useAppSubscriptions'
import useWindowDimensions from './utils/useWindowDimension'
import useProtocolHandler from './hooks/useProtocolHandler'
import FiledropProvider from './utils/FiledropProvider'
import FpsViewerWrapper from './components/Integrations/Spotify/Widgets/FpsViewer/FpsViewer.wrapper'
import SpotifyProvider from './components/Integrations/Spotify/SpotifyProvider'
import useIpcHandlers from './hooks/useIpcHandlers'
import SpecialEvents from './components/SpecialEvents'
import useAppTheme from './hooks/useAppTheme'
import Visualiser from './components/AudioVisualiser/AudioVisualiser'
import FireTvBar from './components/FireTv/FireTvBar'
import AppStyles from './components/AppStyles'
import useStore from './store/useStore'
import Pages from './pages/Pages'
import './App.css'

export default function App() {
  const changeTheme = useStore((state) => state.ui.changeTheme)
  const theme = useAppTheme(changeTheme)
  const features = useStore((state) => state.features)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSystemConfig = useStore((state) => state.getSystemConfig)
  const getSchemas = useStore((state) => state.getSchemas)
  const getClients = useStore((state) => state.getClients)

  useWindowDimensions()
  useSongDetectorAutoApply()
  useIpcHandlers()
  useProtocolHandler()

  useEffect(() => {
    getVirtuals()
    getSystemConfig()
    getSchemas()
    getClients()
  }, [getVirtuals, getSystemConfig, getSchemas, getClients])

  useEffect(() => {
    initFrontendConfig()

    console.info(...WELCOME_MESSAGE)
    if (window.location.pathname.includes('hassio_ingress')) {
      console.info(...HOME_ASSISTANT_MESSAGE)
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
