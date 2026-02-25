import { HashRouter as Router, BrowserRouter, Routes, Route } from 'react-router-dom'
import isElectron from 'is-electron'
import ScrollToTop from '../utils/scrollToTop'
import useStore from '../store/useStore'
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
import SpotifyLoginRedirect from './Integrations/Spotify/SpotifyLoginRedirect'
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
import MainContentWrapper from './MainContentWrapper'
import useAppHotkeys from '../hooks/useAppHotkeys'
import useElectronProtocol from '../hooks/useElectronProtocol'
import useDisplayMode from '../hooks/useDisplayMode'

const Routings = () => {
  const isElect = isElectron()
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const smartBarOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBar.open)

  useElectronProtocol()
  useAppHotkeys()
  const isDisplayMode = useDisplayMode()

  return (
    <>
      <ScrollToTop />
      {!isDisplayMode && <MessageBar />}
      {!isDisplayMode && <TopBar />}
      {!isDisplayMode && <LeftBar />}
      <MainContentWrapper isDisplayMode={isDisplayMode}>
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
      </MainContentWrapper>
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
