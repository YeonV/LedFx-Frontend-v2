/* eslint-disable react/jsx-no-useless-fragment */
import {
  HashRouter as Router,
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import isElectron from 'is-electron'
import { Box, useTheme } from '@mui/material'
import ScrollToTop from '../utils/scrollToTop'
import '../App.css'

import LeftBar from '../components/Bars/BarLeft'
import TopBar from '../components/Bars/BarTop'
import BottomBar from '../components/Bars/BarBottom'
import MessageBar from '../components/Bars/BarMessage'
import NoHostDialog from '../components/Dialogs/NoHostDialog'
import Home from './Home/Home'
import Devices from './Devices/Devices'
import Device from './Device/Device'
import Scenes from './Scenes/Scenes'
import Settings from './Settings/Settings'
import Integrations from './Integrations/Integrations'
import LoginRedirect from './Login/LoginRedirect'
import SmartBar from '../components/Dialogs/SmartBar'
import useStore from '../store/useStore'
import SpotifyLoginRedirect from './Integrations/Spotify/SpotifyLoginRedirect'
import { drawerWidth } from '../utils/helpers'

const Routings = ({ handleWs }: any) => {
  const theme = useTheme()
  const smartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.bars.smartBar.open
  )
  const setSmartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarOpen
  )
  const leftBarOpen = useStore(
    (state) => state.ui.bars && state.ui.bars.leftBar.open
  )

  useHotkeys(['ctrl+alt+y', 'ctrl+alt+z'], () => setSmartBarOpen(!smartBarOpen))

  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent === 'MacIntel' && navigator.maxTouchPoints > 1)
  return (
    <>
      <ScrollToTop />
      {handleWs}
      <MessageBar />
      <TopBar />
      <LeftBar />
      <Box
        sx={{
          flexGrow: 1,
          background: 'transparent',
          padding: ios ? 0 : theme.spacing(0),
          transition: theme.transitions.create('margin', {
            easing: leftBarOpen
              ? theme.transitions.easing.easeOut
              : theme.transitions.easing.sharp,
            duration: leftBarOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen
          }),
          marginLeft: leftBarOpen ? 0 : `-${drawerWidth}px`,
          '@media (max-width: 580px)': {
            padding: '8px'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar
          }}
        />
        <Routes>
          <Route
            path="/connect/:providerName/redirect"
            element={<LoginRedirect />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/device/:virtId" element={<Device />} />
          <Route path="/scenes" element={<Scenes />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <NoHostDialog />
        <SmartBar
          open={smartBarOpen}
          setOpen={setSmartBarOpen}
          direct={false}
        />
      </Box>
      <BottomBar />
    </>
  )
}

const Pages = ({ handleWs }: any) => {
  return (
    <>
      {isElectron() ? (
        <Router>
          <Routings handleWs={handleWs} />
        </Router>
      ) : (
        <Router basename={process.env.PUBLIC_URL}>
          <Routings handleWs={handleWs} />
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
