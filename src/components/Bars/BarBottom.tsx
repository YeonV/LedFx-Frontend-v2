/* eslint-disable @typescript-eslint/indent */
import { useState, useEffect } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Backdrop,
  useTheme,
} from '@mui/material';
import {
  Settings,
  Home,
  Wallpaper,
  SettingsInputSvideo,
  SettingsInputComponent,
  Dashboard,
} from '@mui/icons-material';
import { useLocation, Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import AddSceneDialog from '../Dialogs/AddSceneDialog';
import AddDeviceDialog from '../Dialogs/AddDeviceDialog';
import AddVirtualDialog from '../Dialogs/AddVirtualDialog';
import AddIntegrationDialog from '../Dialogs/AddIntegrationDialog';
import SpotifyFabFree from '../Integrations/Spotify/SpotifyFabFree';
import AddButton from '../AddButton';
import YoutubeWidget from '../Integrations/Youtube/YoutubeWidget';
import SpotifyFabPro from '../Integrations/Spotify/SpotifyFabPro';
import { drawerWidth } from '../../utils/helpers';

export default function BarBottom() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname);
  const [backdrop, setBackdrop] = useState(false);
  const leftOpen = useStore(
    (state) => state.ui.bars && state.ui.bars?.leftBar.open
  );
  const bottomBarOpen = useStore(
    (state) => state.ui.bars && state.ui.bars?.bottomBar
  );

  // const setBottomBarOpen = useStore((state) => state.ui.setBottomBarOpen);
  const features = useStore((state) => state.features);
  const integrations = useStore((state) => state.integrations);

  const [spotifyEnabled, setSpotifyEnabled] = useState(false);
  const [spotifyExpanded, setSpotifyExpanded] = useState(false);
  const spotifyURL = useStore((state) => state.spotify.spotifyEmbedUrl);
  const setSpotifyURL = useStore((state) => state.setSpEmbedUrl);
  // const setSpotifyAuthURL = useStore(
  //   (state) => state.setSpotifyAuthUrl
  // );

  const [youtubeEnabled, setYoutubeEnabled] = useState(false);
  const [youtubeExpanded, setYoutubeExpanded] = useState(false);
  const youtubeURL = useStore((state) => state.youtubeURL);
  const setYoutubeURL = useStore((state) => state.setYoutubeURL);

  const [botHeight, setBotHeight] = useState(0);
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated);

  useEffect(() => {
    let height = 0;
    if (spotifyEnabled) {
      height += 80;
    }
    if (spotifyExpanded) {
      height += 220;
    }
    if (youtubeEnabled) {
      height += 80;
    }
    if (youtubeExpanded) {
      height += 220;
    }
    setBotHeight(height);
  }, [spotifyEnabled, spotifyExpanded, youtubeEnabled, youtubeExpanded]);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  // console.log(bottomBarOpen);

  return (
    <>
      <BottomNavigation
        value={value}
        sx={{
          width: leftOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          marginLeft: leftOpen ? `${drawerWidth}px` : 0,
          position: 'fixed',
          bottom: 0,
          zIndex: 4,
          boxShadow: '0px -10px 30px 25px #030303',
          background: theme.palette.background.default,
          transition: leftOpen
            ? theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              })
            : theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
        }}
        showLabels
        style={{ bottom: botHeight }}
      >
        <BottomNavigationAction
          component={Link}
          className="step-one"
          label={features.dashboard ? 'Dashboard' : 'Home'}
          value="/"
          to="/"
          icon={features.dashboard ? <Dashboard /> : <Home />}
        />
        <BottomNavigationAction
          label="Devices"
          value="/Devices"
          component={Link}
          to="/Devices"
          icon={<SettingsInputComponent />}
          style={
            bottomBarOpen.indexOf('Devices') > -1
              ? { color: theme.palette.primary.main }
              : {}
          }
          // onContextMenu={(e: any) => {
          //   e.preventDefault();
          //   setBottomBarOpen('Devices');
          // }}
        />
        <BottomNavigationAction
          component={Link}
          to="/Scenes"
          label="Scenes"
          value="/Scenes"
          icon={<Wallpaper />}
          style={
            bottomBarOpen.indexOf('Scenes') > -1
              ? { color: theme.palette.primary.main }
              : {}
          }
          // onContextMenu={(e: any) => {
          //   e.preventDefault();
          //   setBottomBarOpen('Scenes');
          // }}
        />

        {features.integrations && (
          <BottomNavigationAction
            label="Integrations"
            value="/Integrations"
            component={Link}
            to="/Integrations"
            icon={<SettingsInputSvideo />}
            style={
              bottomBarOpen.indexOf('Integrations') > -1
                ? { color: theme.palette.primary.main }
                : {}
            }
            // onContextMenu={(e: any) => {
            //   e.preventDefault();
            //   setBottomBarOpen('Integrations');
            // }}
          />
        )}

        <BottomNavigationAction
          label="Settings"
          value="/Settings"
          icon={<Settings />}
          component={Link}
          to="/Settings"
          style={
            bottomBarOpen.indexOf('Settings') > -1
              ? { color: theme.palette.primary.main }
              : {}
          }
          // onContextMenu={(e: any) => {
          //   e.preventDefault();
          //   setBottomBarOpen('Settings');
          // }}
        />
      </BottomNavigation>
      {features.spotify && (
        <SpotifyFabFree
          spotifyEnabled={spotifyEnabled}
          setSpotifyEnabled={setSpotifyEnabled}
          spotifyExpanded={spotifyExpanded}
          setSpotifyExpanded={setSpotifyExpanded}
          spotifyURL={spotifyURL}
          setSpotifyURL={setSpotifyURL}
          // setSpotifyAuthURL={setSpotifyAuthURL}
          botHeight={botHeight}
          setYoutubeEnabled={setYoutubeEnabled}
          setYoutubeExpanded={setYoutubeExpanded}
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
          // setSpotifyAuthURL={setSpotifyAuthURL}
          botHeight={botHeight}
          setYoutubeEnabled={setYoutubeEnabled}
          setYoutubeExpanded={setYoutubeExpanded}
        />
      )}
      {features.youtube && (
        <YoutubeWidget
          youtubeEnabled={youtubeEnabled}
          setYoutubeEnabled={setYoutubeEnabled}
          youtubeExpanded={youtubeExpanded}
          setYoutubeExpanded={setYoutubeExpanded}
          youtubeURL={youtubeURL}
          setYoutubeURL={setYoutubeURL}
          botHeight={botHeight}
          setSpotifyEnabled={setSpotifyEnabled}
          setSpotifyExpanded={setSpotifyExpanded}
        />
      )}
      <AddSceneDialog />
      <AddDeviceDialog />
      <AddVirtualDialog />
      <AddIntegrationDialog />
      <AddButton
        setBackdrop={setBackdrop}
        sx={{
          bottom: botHeight + 65,
          position: 'fixed',
          marginLeft: leftOpen ? `${drawerWidth / 2}px` : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          transition: leftOpen
            ? theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              })
            : theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
            bottom: theme.spacing(2) + 25,
          },
          '& > button.MuiFab-primary': {
            backgroundColor: theme.palette.secondary.main,
          },
          '& .MuiSpeedDialAction-staticTooltipLabel': {
            backgroundColor: 'transparent',
            marginLeft: '-1rem',
          },
        }}
        className="step-four"
      />
      <Backdrop
        style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        open={backdrop}
      />
    </>
  );
}
