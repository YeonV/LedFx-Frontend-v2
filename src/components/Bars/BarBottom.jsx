import { useState, useEffect } from 'react';
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

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname);
  const [backdrop, setBackdrop] = useState(false);
  const leftOpen = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open);
  const features = useStore((state) => state.features);

  const [spotifyEnabled, setSpotifyEnabled] = useState(false)
  const [spotifyExpanded, setSpotifyExpanded] = useState(false)
  const spotifyURL = useStore((state) => state.spotifyEmbedUrl);
  const setSpotifyURL = useStore((state) => state.setSpotifyEmbedUrl);

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
      style={{ bottom: spotifyEnabled ? spotifyExpanded ? 300 : 80 : 0 }}
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
      style={{ bottom: spotifyEnabled ? spotifyExpanded ? 330 : 110 : 30 }}
    />
    <Backdrop style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }} open={backdrop} />
  </>
  );
}
