import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import useStore from '../../utils/apiStore';
import { useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';
import {AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon} from '@material-ui/core';
import {Menu as MenuIcon, MoreVert, PlayCircleOutline, Language, BarChart, Pause, Settings, InfoRounded} from '@material-ui/icons';
import { drawerWidth } from '../../utils/helpers';
import TourDevice from '../Tours/TourDevice';
import TourScenes from '../Tours/TourScenes';
import TourSettings from '../Tours/TourSettings';
import TourDevices from '../Tours/TourDevices';
import TourIntegrations from '../Tours/TourIntegrations';

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const open = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open);
  const setLeftBarOpen = useStore((state) => state.setLeftBarOpen);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const togglePause = useStore((state) => state.togglePause);
  const toggleGraphs = useStore((state) => state.toggleGraphs);
  const paused = useStore((state) => state.paused);
  const graphs = useStore((state) => state.graphs);
  const config = useStore((state) => state.config);
  const { pathname } = useLocation();
  // console.log(pathname.split('/'))

  const handleLeftBarOpen = () => {
    setLeftBarOpen(true);
  };
  const changeHost = () => {
    setDialogOpen(true, true);
    setAnchorEl(null);
  };
  const changePause = () => {
    togglePause();
  };
  const changeGraphs = () => {
    console.log(graphs)
    toggleGraphs();
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar
      color={"secondary"}
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleLeftBarOpen}
          edge="start"
          className={clsx(classes.menuButton, "step-three", open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        {open && <div style={{ width: '48px', height: '48px'}} />}
        <Typography variant="h6" noWrap>
          {pathname === '/' ? 'LedFx' : pathname.split('/').pop()}
        </Typography>

        <IconButton
          aria-label="display more actions"
          edge="end"
          color="inherit"
          onClick={handleClick}
          className={'step-two'}
          style={{ marginLeft: '1rem' }}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={changeHost}>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            Change Host
          </MenuItem>
          <MenuItem onClick={changePause}>
            <ListItemIcon>
              {paused ?  <PlayCircleOutline /> : <Pause />}
            </ListItemIcon>
            {paused ? 'Play' : 'Pause'}
          </MenuItem>
          <MenuItem onClick={changeGraphs}>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            {!graphs ? 'Enable Graphs' : 'Disable Graphs'}
          </MenuItem>
          {pathname.split('/')[1] === 'device' ? <TourDevice /> 
            : pathname.split('/')[1] === 'Scenes' ? <TourScenes /> 
            : pathname.split('/')[1] === 'Settings' ? <TourSettings /> 
            : pathname.split('/')[1] === 'Devices' ? <TourDevices /> 
            : pathname.split('/')[1] === 'Integrations' ? <TourIntegrations /> 
            : null}
          
          <MenuItem component={Link} to={"/Settings"} >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
