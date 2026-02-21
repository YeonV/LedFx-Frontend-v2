import {
  HashRouter as Router,
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import isElectron from 'is-electron'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import ScrollToTop from '../utils/scrollToTop'
import '../App.css'

import LeftBar from '../components/Bars/BarLeft'
import TopBar from '../components/Bars/BarTop/BarTop'
import BottomBar from '../components/Bars/BarBottom'
import MessageBar from '../components/Bars/BarMessage'
import NoHostDialog from '../components/Dialogs/NoHostDialog'
import ClientManagementDialog from '../components/Dialogs/ClientManagementDialog'
import Home from './Home/Home'
import Devices from './Devices/Devices'
import Device from './Device/Device'
import Scenes from './Scenes/Scenes'
import Integrations from './Integrations/Integrations'
import LoginRedirect from './Login/LoginRedirect'
import SmartBar from '../components/Dialogs/SmartBar'
import useStore from '../store/useStore'
import SpotifyLoginRedirect from './Integrations/Spotify/SpotifyLoginRedirect'
import { drawerWidth, ios } from '../utils/helpers'
import User from './User/User'
import Lock from './Lock'
import Mp from '../components/Integrations/Spotify/Widgets/Mp/Mp'
import FrontendPixelsTooSmall from '../components/Dialogs/FrontendPixelsTooSmall'
import HostManager from '../components/Dialogs/HostManager'
import Graph from './Graph/Graph'
import MGraphFloating from '../components/Integrations/Spotify/Widgets/MGraphFlotaing/MGraphFloating'
import Keybinding from '../components/Integrations/Spotify/Widgets/Keybinding/Keybinding'
import OneEffect from '../components/Gamepad/OneEffect'
import SongDetectorFloating from '../components/Integrations/Spotify/Widgets/SongDetector/SongDetectorFloating'
import SongDetectorPlusFloating from '../components/Integrations/Spotify/Widgets/SongDetector/SongDetectorPlusFloating'
import SongDetectorScreen from '../components/Integrations/Spotify/Widgets/SongDetector/SongDetectorScreen'
import PixelGraphSettingsFloating from '../components/Integrations/Spotify/Widgets/PixelGraphSettings/PixelGraphSettingsFloating'
import GlobalColorWidget from '../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget'
import ReactFlowPage from './ReactFlow/ReactFlowPage'
import BackendPlaylistPage from './Scenes/BackendPlaylistPage'
import Visualiser from '../components/AudioVisualiser/AudioVisualiser'
import SettingsNew from './Settings/SettingsNew'
import ElectronStoreInspector from '../components/DevTools/ElectronStoreInspector'

const Routings = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isElect = isElectron()
  const keybinding = useStore((state) => state.ui.keybinding)
  const setKeybinding = useStore((state) => state.ui.setKeybinding)
  const mp = useStore((state) => state.ui.mp)
  const setMp = useStore((state) => state.ui.setMp)
  const fpsViewer = useStore((state) => state.ui.fpsViewer)
  const setFpsViewer = useStore((state) => state.ui.setFpsViewer)
  const mg = useStore((state) => state.ui.mg)
  const setMg = useStore((state) => state.ui.setMg)
  const pgs = useStore((state) => state.ui.pgs)
  const setPgs = useStore((state) => state.ui.setPgs)
  const sd = useStore((state) => state.ui.sd)
  const setSd = useStore((state) => state.ui.setSd)
  const sdPlus = useStore((state) => state.ui.sdPlus)
  const setSdPlus = useStore((state) => state.ui.setSdPlus)
  const globalColorWidget = useStore((state) => state.ui.globalColorWidget)
  const setGlobalColorWidget = useStore((state) => state.ui.setGlobalColorWidget)
  const storeInspector = useStore((state) => state.ui.storeInspector)
  const setStoreInspector = useStore((state) => state.ui.setStoreInspector)
  const features = useStore((state) => state.features)
  const setFeatures = useStore((state) => state.setFeatures)
  const setShowFeatures = useStore((state) => state.setShowFeatures)
  const updateClientIdentity = useStore((state) => state.updateClientIdentity)
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  const smartBarOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBar.open)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open)

  // Check for stored protocol callback on mount (for Electron production builds)
  useEffect(() => {
    if (isElect) {
      let handled = false
      const handler = (...args: any[]) => {
        if (handled) return
        const [message] = args
        const [messageType, data] = message
        if (messageType === 'store-value' && data?.key === 'protocol-callback') {
          if (data.value && typeof data.value === 'string' && data.value.startsWith('ledfx://')) {
            // Ignore song detector calls - they're handled in App.tsx
            if (data.value.startsWith('ledfx://song/')) {
              return
            }
            handled = true
            navigate('/callback')
          }
        }
      }
      window.api.receive('fromMain', handler)

      // Request the value after handler is set up
      setTimeout(() => {
        window.api.send('toMain', {
          command: 'get-store-value',
          key: 'protocol-callback',
          defaultValue: null
        })
      }, 100)
    }
  }, [isElect, navigate])

  useHotkeys(['ctrl+alt+y', 'ctrl+alt+z'], () => setSmartBarOpen(!smartBarOpen))
  useHotkeys(['ctrl+alt+d'], () => setMp(!mp))
  useHotkeys(['ctrl+alt+p'], () => setPgs(!pgs))
  useHotkeys(['ctrl+alt+f'], () => setFpsViewer(!fpsViewer))
  useHotkeys(['ctrl+alt+m'], () => setMg(!mg))
  useHotkeys(['ctrl+alt+t'], () => setSd(!sd))
  useHotkeys(['ctrl+alt+s'], () => setSdPlus(!sdPlus))
  useHotkeys(['ctrl+alt+c'], () => setGlobalColorWidget(!globalColorWidget))
  useHotkeys(['ctrl+alt+x'], () => setStoreInspector(!storeInspector))
  useHotkeys(['ctrl+alt+k', 'ctrl+space'], () => setKeybinding(!keybinding))
  useHotkeys(['ctrl+alt+n'], () => navigate('/reactflow'))
  useHotkeys(['ctrl+alt+g'], () => {
    if (window.localStorage.getItem('guestmode') === 'activated') {
      window.localStorage.removeItem('guestmode')
    } else {
      window.localStorage.setItem('guestmode', 'activated')
    }
    window.location.reload()
  })
  if (isElect) {
    useHotkeys(['ctrl+alt+l'], () => { // eslint-disable-line
      window.localStorage.setItem('lock', 'activated')
      window.location.reload()
    })
  }
  useHotkeys(['ctrl+alt+a'], () => {
    setFeatures('beta', !features.beta)
    setFeatures('alpha', !features.alpha)
    setShowFeatures('alpha', !features.alpha)
    setShowFeatures('beta', !features.beta)
  })
  const location = useLocation()
  const { pathname } = location

  // Check for display mode (OBS-friendly clean UI) - works with HashRouter
  const searchParams = new URLSearchParams(location.search)
  const isDisplayMode = searchParams.get('display') === 'true'
  const clientName = searchParams.get('clientName')

  useEffect(() => {
    // Add/remove class for displayMode visualiser
    const className = 'displayModeVisualiser'
    if (isDisplayMode && pathname === '/visualiser') {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
    if (isDisplayMode && pathname === '/visualiser') {
      const nameToSet = clientName || `Visualiser${Date.now()}`
      // Update Zustand/sessionStorage atomically
      // WebSocketManager will handle the actual WS update based on these store changes
      updateClientIdentity({
        name: nameToSet,
        type: 'visualiser'
      })
    }
    // Clean up on unmount
    return () => {
      document.body.classList.remove(className)
    }
  }, [isDisplayMode, pathname, clientName, updateClientIdentity])

  return (
    <>
      <ScrollToTop />
      {!isDisplayMode && <MessageBar />}
      {!isDisplayMode && <TopBar />}
      {!isDisplayMode && <LeftBar />}
      <Box
        id="yz-main-content"
        sx={[
          isDisplayMode
            ? {
                // Display mode: No padding, no margins, full viewport
                flexGrow: 1,
                background: 'transparent',
                padding: 0,
                margin: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'hidden'
              }
            : {
                // Normal mode: Standard layout with transitions
                flexGrow: 1,
                background: 'transparent',
                padding: ios || xsmallScreen ? '0 !important' : theme.spacing(0),

                transition: theme.transitions.create('margin', {
                  easing: leftBarOpen
                    ? theme.transitions.easing.easeOut
                    : theme.transitions.easing.sharp,
                  duration: leftBarOpen
                    ? theme.transitions.duration.enteringScreen
                    : theme.transitions.duration.leavingScreen
                }),

                '@media (max-width: 580px)': {
                  padding: '8px'
                }
              },
          !isDisplayMode && leftBarOpen
            ? {
                marginLeft: 0
              }
            : !isDisplayMode && {
                marginLeft: `-${drawerWidth}px`
              }
        ]}
      >
        {!isDisplayMode && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
              ...theme.mixins.toolbar
            }}
          />
        )}
        <Routes>
          {window.localStorage.getItem('lock') === 'activated' && isElect ? (
            <Route path="*" element={<Lock />} />
          ) : (
            <>
              <Route path="/connect/:providerName/redirect" element={<LoginRedirect />} />
              <Route path="/" element={<Home />} />
              <Route path="/callback" element={<SpotifyLoginRedirect />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/device/:virtId" element={<Device />} />
              <Route path="/graph/:virtId" element={<Graph />} />
              <Route path="/scenes" element={<Scenes />} />
              {!(window.localStorage.getItem('guestmode') === 'activated') && (
                <Route path="/integrations" element={<Integrations />} />
              )}
              {!(window.localStorage.getItem('guestmode') === 'activated') && (
                <Route path="/visualiser" element={<Visualiser backgroundMode={isDisplayMode} />} />
              )}
              {!(window.localStorage.getItem('guestmode') === 'activated') && (
                <Route path="/settings" element={<SettingsNew />} />
              )}
              <Route path="/user" element={<User />} />
              <Route path="/reactflow" element={<ReactFlowPage />} />
              <Route path="/YZflow" element={<ReactFlowPage />} />
              <Route path="/playlists" element={<BackendPlaylistPage />} />

              <Route
                path="*"
                element={
                  !(window.localStorage.getItem('guestmode') === 'activated') ? (
                    <Home />
                  ) : (
                    <Scenes />
                  )
                }
              />
            </>
          )}
        </Routes>
        {mp && <Mp />}
        {pgs && <PixelGraphSettingsFloating close={() => setPgs(false)} />}
        {sd && <SongDetectorFloating close={() => setSd(false)} />}
        {sdPlus && <SongDetectorPlusFloating close={() => setSdPlus(false)} />}
        {mg && <MGraphFloating close={() => setMg(false)} />}
        {keybinding && <Keybinding close={() => setKeybinding(false)} />}
        {globalColorWidget && <GlobalColorWidget close={() => setGlobalColorWidget(false)} />}
        {isElect && storeInspector && (
          <ElectronStoreInspector close={() => setStoreInspector(false)} />
        )}
        <SongDetectorScreen />
        {!isDisplayMode && <OneEffect noButton />}
        {!isDisplayMode && <NoHostDialog />}
        {!isDisplayMode && <ClientManagementDialog />}
        {!isDisplayMode && isElect && <HostManager />}
        {!isDisplayMode && <FrontendPixelsTooSmall />}
        {!isDisplayMode && (
          <SmartBar open={smartBarOpen} setOpen={setSmartBarOpen} direct={false} />
        )}
      </Box>
      {!isDisplayMode && !(isElect && window.localStorage.getItem('lock') === 'activated') && (
        <BottomBar />
      )}
    </>
  )
}

const Pages = () => {
  return (
    <>
      {isElectron() ? (
        <Router>
          <Routings />
        </Router>
      ) : (
        <Router basename={process.env.PUBLIC_URL}>
          <Routings />
        </Router>
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/callback" element={<SpotifyLoginRedirect />} />
          <Route path="*" element={<></>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Pages
