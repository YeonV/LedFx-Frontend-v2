import { useState, useEffect } from 'react'
import { BottomNavigation, BottomNavigationAction, Backdrop, useTheme } from '@mui/material'
import {
  Settings,
  Home,
  Dashboard,
  ElectricalServices,
  QueueMusic,
  AccountTree
} from '@mui/icons-material'
import { useLocation, Link } from 'react-router-dom'
import useStore from '../../store/useStore'
import AddSceneDialog from '../Dialogs/SceneDialogs/AddSceneDialog'
import AddDeviceDialog from '../Dialogs/AddDeviceDialog'
import AddVirtualDialog from '../Dialogs/AddVirtualDialog'
import AddIntegrationDialog from '../Dialogs/AddIntegrationDialog'
import SpotifyFabFree from '../Integrations/Spotify/SpotifyFabFree'
import AddButton from '../AddButton/AddButton'
import SpotifyFabPro from '../Integrations/Spotify/SpotifyFabPro'
import MIDIListener from '../Midi/MidiListener'
import { drawerWidth, ios } from '../../utils/helpers'
import EditSceneDialog from '../Dialogs/SceneDialogs/EditSceneDialog'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import AddWledDialog from '../Dialogs/AddWledDialog'
import Gamepad from '../Gamepad/Gamepad'
import SmartBar from '../Dialogs/SmartBar'
import { useFireTvStore } from '../FireTv/useFireTvStore'
import AssetManager from '../Dialogs/AssetManager/AssetManager'
import MidiInputDialog from '../Midi/MidiInputDialog'

export default function BarBottom() {
  const theme = useTheme()
  const { pathname } = useLocation()
  const [value, setValue] = useState(pathname)
  const [backdrop, setBackdrop] = useState(false)
  const leftOpen = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open)
  const bottomBarOpen = useStore((state) => state.ui.bars && state.ui.bars?.bottomBar)

  const features = useStore((state) => state.features)
  const integrations = useStore((state) => state.integrations)
  const activateScene = useStore((state) => state.activateScene)
  const captivateScene = useStore((state) => state.captivateScene)
  const smartBarPadOpen = useStore((state) => state.ui.bars && state.ui.bars.smartBarPad.open)
  const setSmartBarPadOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarPadOpen)
  const scenes = useStore((state) => state.scenes)
  const fireTvBarHeight = useFireTvStore((state) => state.barHeight)

  const handleActivateScene = (e: string) => {
    activateScene(e)
    if (scenes[e]?.scene_puturl && scenes[e]?.scene_payload)
      captivateScene(scenes[e]?.scene_puturl, scenes[e]?.scene_payload)
  }
  const [spotifyEnabled, setSpotifyEnabled] = useState(false)
  const [spotifyExpanded, setSpotifyExpanded] = useState(false)
  const spotifyURL = useStore((state) => state.spotify.spotifyEmbedUrl)
  const setSpotifyURL = useStore((state) => state.setSpEmbedUrl)

  const [botHeight, setBotHeight] = useState(0)
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)

  useEffect(() => {
    let height = 0
    if (spotifyEnabled) {
      height += 80
    }
    if (spotifyExpanded) {
      height += 220
    }
    setBotHeight(height + (features.firetv ? fireTvBarHeight : 0)) // Use 0 when disabled
  }, [spotifyEnabled, spotifyExpanded, fireTvBarHeight, features.firetv])

  useEffect(() => {
    setValue(pathname)
  }, [pathname])

  return (
    <>
      <BottomNavigation
        value={value}
        sx={[
          {
            position: 'fixed',
            bottom: fireTvBarHeight,
            zIndex: 4,
            backdropFilter: 'blur(20px)'
          },
          leftOpen
            ? {
                width: `calc(100% - ${drawerWidth}px)`
              }
            : {
                width: '100%'
              },
          leftOpen
            ? {
                marginLeft: `${drawerWidth}px`
              }
            : {
                marginLeft: 0
              },
          ios
            ? {
                height: 80
              }
            : {
                height: 56
              },
          ios
            ? {
                paddingBottom: '16px'
              }
            : {
                paddingBottom: 0
              },
          ios
            ? {
                paddingTop: '8px'
              }
            : {
                paddingTop: 0
              },
          ios
            ? {
                boxShadow: ''
              }
            : {
                boxShadow: `0px -1px 6px 5px ${theme.palette.background.default}`
              },
          ios
            ? {
                background: 'rgba(54,54,54,0.8)'
              }
            : {
                background: theme.palette.background.paper
              },
          leftOpen
            ? {
                transition: theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen
                })
              }
            : {
                transition: theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen
                })
              }
        ]}
        showLabels
        style={{ bottom: botHeight, color: '#a1998e' }}
      >
        {!(window.localStorage.getItem('guestmode') === 'activated') && (
          <BottomNavigationAction
            sx={{ minWidth: 50 }}
            component={Link}
            className="step-one"
            label={features.dashboard ? 'Dashboard' : 'Home'}
            value="/"
            to="/"
            icon={features.dashboard ? <Dashboard /> : <Home />}
          />
        )}
        {features.showFlowInBottomBar &&
          !(window.localStorage.getItem('guestmode') === 'activated') && (
            <BottomNavigationAction
              label="YZ-Flow"
              value="/YZflow"
              component={Link}
              to="/YZflow"
              icon={<AccountTree />}
              style={
                bottomBarOpen.indexOf('yzflow') > -1 ? { color: theme.palette.primary.main } : {}
              }
            />
          )}
        <BottomNavigationAction
          label="Devices"
          value="/Devices"
          component={Link}
          to="/Devices"
          icon={<BladeIcon name="mdi:led-strip-variant" />}
          style={bottomBarOpen.indexOf('Devices') > -1 ? { color: theme.palette.primary.main } : {}}
        />
        <BottomNavigationAction
          component={Link}
          to="/Scenes"
          label="Scenes"
          value="/Scenes"
          icon={<BladeIcon name="mdi:image" />}
          style={bottomBarOpen.indexOf('Scenes') > -1 ? { color: theme.palette.primary.main } : {}}
        />

        {features.showPlaylistInBottomBar &&
          !(window.localStorage.getItem('guestmode') === 'activated') && (
            <BottomNavigationAction
              label="Playlists"
              value="/Playlists"
              component={Link}
              to="/Playlists"
              icon={<QueueMusic />}
              style={
                bottomBarOpen.indexOf('Playlists') > -1 ? { color: theme.palette.primary.main } : {}
              }
            />
          )}

        {features.integrations && !(window.localStorage.getItem('guestmode') === 'activated') && (
          <BottomNavigationAction
            label="Integrations"
            value="/Integrations"
            component={Link}
            to="/Integrations"
            icon={<ElectricalServices />}
            style={
              bottomBarOpen.indexOf('Integrations') > -1
                ? { color: theme.palette.primary.main }
                : {}
            }
          />
        )}

        {features.showAssetManagerInBottomBar && <AssetManager variant="navitem" />}
        {features.showMidiInBottomBar && <MidiInputDialog variant="navitem" />}
        {features.showGamepadInBottomBar && <Gamepad bottom={botHeight + 56} variant="navitem" />}
        {features.showVisualiserInBottomBar &&
          !(window.localStorage.getItem('guestmode') === 'activated') && (
            <BottomNavigationAction
              label="Visualiser"
              value="/visualiser"
              component={Link}
              to="/visualiser"
              icon={<BladeIcon name="mdi:equalizer" />}
              style={
                bottomBarOpen.indexOf('visualiser') > -1
                  ? { color: theme.palette.primary.main }
                  : {}
              }
            />
          )}

        {!(window.localStorage.getItem('guestmode') === 'activated') && (
          <BottomNavigationAction
            label="Settings"
            value="/Settings"
            icon={<Settings />}
            component={Link}
            to="/Settings"
            style={
              bottomBarOpen.indexOf('Settings') > -1 ? { color: theme.palette.primary.main } : {}
            }
          />
        )}
      </BottomNavigation>
      {features.spotify && (
        <SpotifyFabFree
          spotifyEnabled={spotifyEnabled}
          setSpotifyEnabled={setSpotifyEnabled}
          spotifyExpanded={spotifyExpanded}
          setSpotifyExpanded={setSpotifyExpanded}
          spotifyURL={spotifyURL}
          setSpotifyURL={setSpotifyURL}
          botHeight={botHeight}
        />
      )}
      {integrations.spotify?.active && spAuthenticated && (
        <SpotifyFabPro
          spotifyEnabled={spotifyEnabled}
          setSpotifyEnabled={setSpotifyEnabled}
          spotifyExpanded={spotifyExpanded}
          setSpotifyExpanded={setSpotifyExpanded}
          spotifyURL={spotifyURL}
          setSpotifyURL={setSpotifyURL}
          botHeight={botHeight}
        />
      )}
      <MIDIListener />
      <AddSceneDialog />
      <AddDeviceDialog />
      <AddWledDialog />
      <AddVirtualDialog />
      <AddIntegrationDialog />
      <EditSceneDialog />
      {features.gamepad && (
        <>
          <Gamepad setScene={handleActivateScene} bottom={botHeight + 65} />
          <SmartBar open={smartBarPadOpen} setOpen={setSmartBarPadOpen} direct={false} />
        </>
      )}
      {!(window.localStorage.getItem('guestmode') === 'activated') && (
        <AddButton
          setBackdrop={setBackdrop}
          sx={{
            bottom: botHeight + 65,
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',

            '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
              bottom: theme.spacing(2) + 25
            },

            '& > button.MuiFab-primary': {
              backgroundColor: theme.palette.secondary.main
            },

            '& .MuiSpeedDialAction-staticTooltipLabel': {
              backgroundColor: 'transparent',
              marginLeft: '-1rem'
            },

            ...(leftOpen
              ? {
                  marginLeft: `${drawerWidth / 2}px`,
                  transition: theme.transitions.create(['margin'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen
                  })
                }
              : {
                  marginLeft: 0,
                  transition: theme.transitions.create(['margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen
                  })
                })
          }}
          className="step-four step-scenes-two"
        />
      )}
      <Backdrop style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }} open={backdrop} />
    </>
  )
}
