import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Icon from '@material-ui/core/Icon';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Settings from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import Wallpaper from '@material-ui/icons/Wallpaper';
import { useLocation, Link } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import useStore from '../../utils/apiStore';
// import SettingsInputSvideoIcon from "@material-ui/icons/SettingsInputSvideo";
import SettingsInputComponent from '@material-ui/icons/SettingsInputComponent';
import AddSceneDialog from '../../pages/Scenes/AddSceneDialog';
import AddDeviceDialog from '../../pages/Devices/AddDeviceDialog';
import AddVirtualDialog from '../../pages/Devices/AddVirtualDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    background: '#121212',
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
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2) + 15,
      // right: theme.spacing(2),
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
  const isTouch = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0))

  const actions = [
    { icon: <SettingsInputComponent />, name: 'Add Device', action: () => setDialogOpenAddDevice(true) },
    { icon: <Icon><span className={'mdi mdi-led-strip-variant'} style={{ position: 'relative', display: 'flex' }} /></Icon>, name: 'Add Virtual', action: () => setDialogOpenAddVirtual(true) },
    { icon: <Wallpaper />, name: 'Add Scene', action: () => setDialogOpenAddScene(true) },
  ];

  const handleClose = () => {
    setOpen(false);
  };
  const handleAction = (action) => {
    action();
    setOpen(false);
  };
  const addScene = () => {
    setDialogOpenAddScene(true)
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  return (
    <BottomNavigation
      value={value}
      className={classes.root}
      showLabels
    >
      <BottomNavigationAction
        component={Link}
        className={'step-one'}
        label="Home"
        value="/"
        to="/"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        label="Devices"
        value="/Devices"
        component={Link}
        to="/Devices"
        icon={<SettingsInputComponent />}
      />
      {/* <Fab color="secondary" aria-label="add" className={classes.fabButton} onClick={()=>addScene()}>
        <AddIcon />
      </Fab> */}
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        // className={classes.fabButton} 
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
      <BottomNavigationAction
        component={Link}
        to="/Scenes"
        label="Scenes"
        value="/Scenes"
        icon={<Wallpaper />}
      />

      {/* <BottomNavigationAction
        label="Integrations"
        value="integrations"
        component={Link}
        to={"/Integrations"}
        icon={<SettingsInputSvideoIcon />}
      /> */}

      <BottomNavigationAction
        label="Settings"
        value="/Settings"
        icon={<Settings />}
        component={Link}
        to="/Settings"
      />
      <AddSceneDialog />
      <AddDeviceDialog />
      <AddVirtualDialog />
    </BottomNavigation>
  );
}
