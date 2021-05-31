import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Settings from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import Wallpaper from '@material-ui/icons/Wallpaper';
import { useLocation, Link } from 'react-router-dom';
// import SettingsInputSvideoIcon from "@material-ui/icons/SettingsInputSvideo";
import SettingsInputComponent from '@material-ui/icons/SettingsInputComponent';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    background: '#121212',
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname);

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
    </BottomNavigation>
  );
}
