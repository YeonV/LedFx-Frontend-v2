import { HashRouter as Router, BrowserRouter, Routes, Route } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import isElectron from 'is-electron'
import { Box, useMediaQuery, useTheme } from '@mui/material'
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
import PixelGraphSettingsFloating from '../components/Integrations/Spotify/Widgets/PixelGraphSettings/PixelGraphSettingsFloating'

const Routings = ({ handleWs }: any) => {
  const theme = useTheme()
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
  const features = useStore((state) => state.features)
  const setFeatures = useStore((state) => state.setFeatures)
  const setShowFeatures = useStore((state) => state.setShowFeatures)
  const xsmallScreen = useMediaQuery('(max-width: 475px)')

  const smartBarOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBar.open)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open)

  useHotkeys(['ctrl+alt+y', 'ctrl+alt+z'], () => setSmartBarOpen(!smartBarOpen))
  useHotkeys(['ctrl+alt+d'], () => setMp(!mp))
  useHotkeys(['ctrl+alt+p'], () => setPgs(!pgs))
  useHotkeys(['ctrl+alt+f'], () => setFpsViewer(!fpsViewer))
  useHotkeys(['ctrl+alt+m'], () => setMg(!mg))
  useHotkeys(['ctrl+alt+t'], () => setSd(!sd))
  useHotkeys(['ctrl+alt+k', 'ctrl+space'], () => setKeybinding(!keybinding))
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

  return (
    <>
      <ScrollToTop />
      {handleWs}
      <MessageBar />
      <TopBar />
      <LeftBar />
      <Box
        sx={[
          {
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
          leftBarOpen
            ? {
                marginLeft: 0
              }
            : {
                marginLeft: `-${drawerWidth}px`
              }
        ]}
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
                <Route path="/settings" element={<Settings />} />
              )}
              <Route path="/user" element={<User />} />
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
        {mg && <MGraphFloating close={() => setMg(false)} />}
        {keybinding && <Keybinding close={() => setKeybinding(false)} />}
        <OneEffect noButton />
        <NoHostDialog />
        <HostManager />
        <FrontendPixelsTooSmall />
        <SmartBar open={smartBarOpen} setOpen={setSmartBarOpen} direct={false} />
      </Box>
      {!(isElect && window.localStorage.getItem('lock') === 'activated') && <BottomBar />}
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
