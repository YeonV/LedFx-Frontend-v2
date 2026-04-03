import { HashRouter as Router, BrowserRouter, Routes, Route } from 'react-router-dom'
import FrontendPixelsTooSmall from '../components/Dialogs/FrontendPixelsTooSmall'
import ClientManagementDialog from '../components/Dialogs/ClientManagementDialog'
import SendspinDialog from '../components/Dialogs/SendspinDialog'
import SpotifyLoginRedirect from './Integrations/Spotify/SpotifyLoginRedirect'
import BackendPlaylistPage from './Scenes/BackendPlaylistPage'
import useElectronProtocol from '../hooks/useElectronProtocol'
import MainContentWrapper from './MainContentWrapper'
import FloatingWidgets from './FloatingWidgets'
import useDisplayMode from '../hooks/useDisplayMode'
import ReactFlowPage from './ReactFlow/ReactFlowPage'
import LoginRedirect from './Login/LoginRedirect'
import useAppHotkeys from '../hooks/useAppHotkeys'
import NoHostDialog from '../components/Dialogs/NoHostDialog'
import Integrations from './Integrations/Integrations'
import SettingsNew from './Settings/SettingsNew'
import ScrollToTop from '../utils/scrollToTop'
import HostManager from '../components/Dialogs/HostManager'
import MessageBar from '../components/Bars/BarMessage'
import Visualiser from '../components/AudioVisualiser/AudioVisualiser'
import isElectron from 'is-electron'
import OneEffect from '../components/Gamepad/OneEffect'
import BottomBar from '../components/Bars/BarBottom'
import SmartBar from '../components/Dialogs/SmartBar'
import useStore from '../store/useStore'
import Devices from './Devices/Devices'
import LeftBar from '../components/Bars/BarLeft'
import TopBar from '../components/Bars/BarTop/BarTop'
import Device from './Device/Device'
import Scenes from './Scenes/Scenes'
import Graph from './Graph/Graph'
import Home from './Home/Home'
import User from './User/User'
import Lock from './Lock'
import '../App.css'

const Routings = () => {
  const isElect = isElectron()
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const smartBarOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBar.open)
  const display = useDisplayMode()
  const guest = window.localStorage.getItem('guestmode') === 'activated'
  const locked = window.localStorage.getItem('lock') === 'activated'

  useElectronProtocol()
  useAppHotkeys()

  return (
    <>
      <ScrollToTop />
      {!display && <MessageBar />}
      {!display && <TopBar />}
      {!display && <LeftBar />}
      <MainContentWrapper isDisplayMode={display}>
        <Routes>
          {locked && isElect ? (
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
              <Route path="/visualiser" element={<Visualiser backgroundMode={display} />} />
              <Route path="/user" element={<User />} />
              <Route path="/reactflow" element={<ReactFlowPage />} />
              <Route path="/YZflow" element={<ReactFlowPage />} />
              <Route path="/playlists" element={<BackendPlaylistPage />} />
              {!guest && <Route path="/integrations" element={<Integrations />} />}
              {!guest && <Route path="/settings" element={<SettingsNew />} />}

              <Route path="*" element={!guest ? <Home /> : <Scenes />} />
            </>
          )}
        </Routes>
        <FloatingWidgets />
        {!display && <OneEffect noButton />}
        {!display && <NoHostDialog />}
        {!display && <ClientManagementDialog />}
        {!display && <SendspinDialog />}
        {!display && isElect && <HostManager />}
        {!display && <FrontendPixelsTooSmall />}
        {!display && <SmartBar open={smartBarOpen} setOpen={setSmartBarOpen} direct={false} />}
      </MainContentWrapper>
      {!display && !(isElect && locked) && <BottomBar />}
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
