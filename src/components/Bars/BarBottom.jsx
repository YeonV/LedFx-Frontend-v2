import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, Icon, BottomNavigationAction, Backdrop } from '@material-ui/core';
import { Settings, Home, Wallpaper, SettingsInputSvideo, DeveloperMode, SettingsInputComponent } from '@material-ui/icons';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { useLocation, Link } from 'react-router-dom';
import useStore from '../../utils/apiStore';
import { drawerWidth } from '../../utils/helpers';
import clsx from 'clsx';
import AddSceneDialog from '../Dialogs/AddSceneDialog';
import AddDeviceDialog from '../Dialogs/AddDeviceDialog';
import AddVirtualDialog from '../Dialogs/AddVirtualDialog';
import AddIntegrationDialog from '../Dialogs/AddIntegrationDialog';
import SpotifyWidget from '../Spotify/SpotifyWidget';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    background: '#151515',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  rootShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },

  speedDial: {
    position: 'fixed',
    marginLeft: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    transition: theme.transitions.create(['margin'], {
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
      marginLeft: '-1rem'
    },
  },
  speedDialShift: {
    marginLeft: drawerWidth / 2,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname);
  const [open, setOpen] = useState(false);
  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual);
  const setDialogOpenAddIntegration = useStore((state) => state.setDialogOpenAddIntegration);
  const leftOpen = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open);

  const [spotifyEnabled, setSpotifyEnabled] = useState(false)
  const [spotifyExpanded, setSpotifyExpanded] = useState(false)

  const isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))

  const actions = [
    { icon: <SettingsInputComponent />, name: 'Add Device', action: () => setDialogOpenAddDevice(true) },
    { icon: <Icon><span className={'mdi mdi-led-strip-variant'} style={{ position: 'relative', display: 'flex' }} /></Icon>, name: 'Add Virtual', action: () => setDialogOpenAddVirtual(true) },
    { icon: <Wallpaper />, name: 'Add Scene', action: () => setDialogOpenAddScene(true) },
  ];

  if (parseInt(window.localStorage.getItem('BladeMod')) > 10) {
    actions.push({ icon: <SettingsInputSvideo />, name: 'Add Integration', action: () => setDialogOpenAddIntegration(true) })
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = (action) => {
    action();
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
      {parseInt(window.localStorage.getItem('BladeMod')) > 10
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
      {/* 
      {parseInt(window.localStorage.getItem('BladeMod')) > 10 && (
        <BottomNavigationAction
          label="Devmode"
          value="devmode"
          component={Link}
          to={"/"}
          icon={<DeveloperMode />}
          style={{ color : '#fefefe'}}
        />
      )} */}
    </BottomNavigation>
    {parseInt(window.localStorage.getItem('BladeMod')) > 10 && (
      <SpotifyWidget 
        spotifyEnabled={spotifyEnabled}
        setSpotifyEnabled={setSpotifyEnabled}
        spotifyExpanded={spotifyExpanded} 
        setSpotifyExpanded={setSpotifyExpanded} 
      />
    )}
    <AddSceneDialog />
    <AddDeviceDialog />
    <AddVirtualDialog />
    <AddIntegrationDialog />
    <SpeedDial
      color={'secondary'}
      ariaLabel="SpeedDial"
      className={`${clsx(classes.speedDial, {
        [classes.speedDialShift]: leftOpen,
      })} step-four`}
      style={{ bottom: spotifyEnabled ? spotifyExpanded ? 330 : 110 : 30 }}
      hidden={false}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onClick={handleOpen}
      open={open}
      direction={"up"}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          TooltipClasses={classes.tooltip}
          tooltipPlacement={'right'}
          style={{ whiteSpace: 'nowrap' }}
          tooltipOpen={true}
          onClick={() => handleAction(action.action)}
        />
      ))}
    </SpeedDial>
    <Backdrop style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }} open={open} />

  </>
  );
}
