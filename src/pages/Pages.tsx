import { HashRouter as Router, BrowserRouter, Routes, Route } from 'react-router-dom'
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
import FrontendPixelsTooSmall from '../components/Dialogs/FrontendPixelsTooSmall'
import HostManager from '../components/Dialogs/HostManager'
import Graph from './Graph/Graph'
import OneEffect from '../components/Gamepad/OneEffect'
import ReactFlowPage from './ReactFlow/ReactFlowPage'
import BackendPlaylistPage from './Scenes/BackendPlaylistPage'
import Visualiser from '../components/AudioVisualiser/AudioVisualiser'
import SettingsNew from './Settings/SettingsNew'
import FloatingWidgets from './FloatingWidgets'
import useAppHotkeys from '../hooks/useAppHotkeys'
import useElectronProtocol from '../hooks/useElectronProtocol'
import useDisplayMode from '../hooks/useDisplayMode'

const Routings = () => {
  const theme = useTheme()
  const isElect = isElectron()
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  const smartBarOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBar.open)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open)

  useElectronProtocol()
  useAppHotkeys()
  const isDisplayMode = useDisplayMode()

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
        <FloatingWidgets />
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
