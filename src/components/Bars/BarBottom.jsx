import { useState, useEffect, useRef } from 'react';
import { BottomNavigation, BottomNavigationAction, Backdrop } from '@material-ui/core';
import { Settings, Home, Wallpaper, SettingsInputSvideo, SettingsInputComponent } from '@material-ui/icons';
import { useLocation, Link } from 'react-router-dom';
import useStore from '../../utils/apiStore';
import clsx from 'clsx';
import AddSceneDialog from '../Dialogs/AddSceneDialog';
import AddDeviceDialog from '../Dialogs/AddDeviceDialog';
import AddVirtualDialog from '../Dialogs/AddVirtualDialog';
import AddIntegrationDialog from '../Dialogs/AddIntegrationDialog';
import SpotifyWidget from '../Integrations/Spotify/SpotifyWidget';
import AddButton from '../AddButton';
import useStyles from './BarBottom.styles';
import YoutubeWidget from '../Integrations/Youtube/YoutubeWidget';
import SpotifyProWidget from '../Integrations/Spotify/SpotifyProWidget';

export default function BarBottom({thePlayer}) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname);
  const [backdrop, setBackdrop] = useState(false);
  const leftOpen = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open);
  const features = useStore((state) => state.features);
  const integrations = useStore((state) => state.integrations);

  const [spotifyEnabled, setSpotifyEnabled] = useState(false)
  const [spotifyExpanded, setSpotifyExpanded] = useState(false)
  const spotifyURL = useStore((state) => state.spotifyEmbedUrl);
  const setSpotifyURL = useStore((state) => state.setSpotifyEmbedUrl);
  const setSpotifyAuthURL = useStore((state) => state.setSpotifyAuthUrl);

  const [youtubeEnabled, setYoutubeEnabled] = useState(false)
  const [youtubeExpanded, setYoutubeExpanded] = useState(false)
  const youtubeURL = useStore((state) => state.youtubeURL);
  const setYoutubeURL = useStore((state) => state.setYoutubeURL);

  const [botHeight, setBotHeight] = useState(0)
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    let height = 0
    if (spotifyEnabled) {
      height += 80
    }
    if (spotifyExpanded) {
      height += 220
    }
    if (youtubeEnabled) {
      height += 80
    }
    if (youtubeExpanded) {
      height += 220
    }
    setBotHeight(height)
  }, [spotifyEnabled, spotifyExpanded, youtubeEnabled, youtubeExpanded]);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  return (<>
    <BottomNavigation
      value={value}
      className={clsx(classes.root, {
        [classes.rootShift]: leftOpen,
      })}
      showLabels={true}
      style={{ bottom: botHeight }}
    >
      <BottomNavigationAction
        component={Link}
        className={'step-one'}
        label="Home"
        value="/"
        to="/"
        icon={<Home />}
      />
      <BottomNavigationAction
        label="Devices"
        value="/Devices"
        component={Link}
        to="/Devices"
        icon={<SettingsInputComponent />}
      />
      <BottomNavigationAction
        component={Link}
        to="/Scenes"
        label="Scenes"
        value="/Scenes"
        icon={<Wallpaper />}
      />
      {features['integrations']
        ? (<BottomNavigationAction
          label="Integrations"
          value="/Integrations"
          component={Link}
          to={"/Integrations"}
          icon={<SettingsInputSvideo />}
        />)
        : (<BottomNavigationAction
          label="Settings"
          value="/Settings"
          icon={<Settings />}
          component={Link}
          to="/Settings"
        />)}
    </BottomNavigation>
    {features['spotify'] && (
      <SpotifyWidget
        spotifyEnabled={spotifyEnabled}
        setSpotifyEnabled={setSpotifyEnabled}
        spotifyExpanded={spotifyExpanded}
        setSpotifyExpanded={setSpotifyExpanded}
        spotifyURL={spotifyURL}
        setSpotifyURL={setSpotifyURL}
        setSpotifyAuthURL={setSpotifyAuthURL}
        botHeight={botHeight}
        setYoutubeEnabled={setYoutubeEnabled}
        setYoutubeExpanded={setYoutubeExpanded}
      />
    )}
    {integrations["spotify"].active && isAuthenticated && (
      <SpotifyProWidget
        spotifyEnabled={spotifyEnabled}
        setSpotifyEnabled={setSpotifyEnabled}
        spotifyExpanded={spotifyExpanded}
        setSpotifyExpanded={setSpotifyExpanded}
        spotifyURL={spotifyURL}
        setSpotifyURL={setSpotifyURL}
        setSpotifyAuthURL={setSpotifyAuthURL}
        botHeight={botHeight}
        setYoutubeEnabled={setYoutubeEnabled}
        setYoutubeExpanded={setYoutubeExpanded}
        thePlayer={thePlayer}
      />
    )}
    {features['youtube'] && (
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
      className={`${clsx(classes.addButton, {
        [classes.addButtonShift]: leftOpen,
      })} step-four`}
      style={{ bottom: botHeight + 30 }}
    />
    <Backdrop style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }} open={backdrop} />
  </>
  );
}
