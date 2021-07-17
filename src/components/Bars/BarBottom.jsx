import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, Icon, BottomNavigationAction, Backdrop } from '@material-ui/core';
import { Settings, Home, Wallpaper, SettingsInputSvideo, DeveloperMode, SettingsInputComponent } from '@material-ui/icons';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab';
import { useLocation, Link } from 'react-router-dom';
import useStore from '../../utils/apiStore';
import AddSceneDialog from '../../pages/Scenes/AddSceneDialog';
import AddDeviceDialog from '../../pages/Devices/AddDeviceDialog';
import AddVirtualDialog from '../../pages/Devices/AddVirtualDialog';
import AddIntegrationDialog from '../../pages/Integrations/AddIntegration';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    background: '#232323',
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
    left: '50%',
    transform: 'translateX(-50%)',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2) + 25,
    },
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
      className={classes.root}
      showLabels={true}
    >
      <BottomNavigationAction
        component={Link}
        className={'step-one'}
        label="Home"
        value="/"
        to="/"
        icon={<Home />}
        style={{ color : '#fefefe'}}
      />
      <BottomNavigationAction
        label="Devices"
        value="/Devices"
        component={Link}
        to="/Devices"
        icon={<SettingsInputComponent />}
        style={{ color : '#fefefe'}}
      />
      <BottomNavigationAction
        component={Link}
        to="/Scenes"
        label="Scenes"
        value="/Scenes"
        icon={<Wallpaper />}
        style={{ color : '#fefefe'}}
      />
      {parseInt(window.localStorage.getItem('BladeMod')) > 10 
      ? (<BottomNavigationAction
          label="Integrations"
          value="/Integrations"
          component={Link}
          to={"/Integrations"}
          icon={<SettingsInputSvideo />}
          style={{ color : '#fefefe'}}
        />) 
      : (<BottomNavigationAction
          label="Settings"
          value="/Settings"
          icon={<Settings />}
          component={Link}
          to="/Settings"
          style={{ color : '#fefefe'}}
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
    <AddSceneDialog />
    <AddDeviceDialog />
    <AddVirtualDialog />
    <AddIntegrationDialog />
    <SpeedDial
      ariaLabel="SpeedDial example"
      className={classes.speedDial}
      hidden={false}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction={"up"}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          style={{ whiteSpace: 'nowrap' }}
          tooltipOpen={isTouch}
          onClick={() => handleAction(action.action)}
        />
      ))}
    </SpeedDial>
    <Backdrop open={open} />
  </>
  );
}
