import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import useStore from '../../utils/apiStore';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { AppBar, Box, Badge, Toolbar, CircularProgress, Typography, IconButton, Menu, MenuItem, ListItemIcon, Button } from '@material-ui/core';
import { Menu as MenuIcon, MoreVert, PlayCircleOutline, Language, BarChart, Pause, Settings, GitHub, ChevronLeft } from '@material-ui/icons';
import { styled } from '@mui/material/styles';
import { Login, Logout } from '@mui/icons-material';
import { drawerWidth } from '../../utils/helpers';
import TourDevice from '../Tours/TourDevice';
import TourScenes from '../Tours/TourScenes';
import TourSettings from '../Tours/TourSettings';
import TourDevices from '../Tours/TourDevices';
import TourIntegrations from '../Tours/TourIntegrations';
import BladeIcon from '../Icons/BladeIcon/BladeIcon';
import isElectron from 'is-electron';
// import Doc from '../Doc/Doc';

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
  backButton: {
    position: 'absolute',
    top: 14,
    '@media (max-width: 599px)': {
      top: 10
    }
  },
  bladeMenu: {
    "& .MuiPaper-root": {
      backgroundColor: theme.palette.grey[900]
    }
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: '45%',
    top: '115%',
    border: `1px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    fontSize: 'x-small',
    height: '14px',
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const open = useStore((state) => state.ui.bars && state.ui.bars?.leftBar.open);
  const setLeftBarOpen = useStore((state) => state.setLeftBarOpen);
  const virtuals = useStore((state) => state.virtuals);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const togglePause = useStore((state) => state.togglePause);
  const toggleGraphs = useStore((state) => state.toggleGraphs);
  const paused = useStore((state) => state.paused);
  const graphs = useStore((state) => state.graphs);
  const config = useStore((state) => state.config);
  const isLogged = useStore((state) => state.isLogged);
  const setIsLogged = useStore((state) => state.setIsLogged);
  const disconnected = useStore((state) => state.disconnected);
  const setDisconnected = useStore((state) => state.setDisconnected);
  const { pathname } = useLocation();
  const history = useNavigate();
  const clearSnackbar = useStore((state) => state.clearSnackbar);
  const features = useStore((state) => state.features);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

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
    toggleGraphs();
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('ledfx-cloud-userid');
    localStorage.removeItem('ledfx-cloud-role');
    setIsLogged(false);
  };

  useEffect(() => {
    setIsLogged(!!localStorage.getItem('jwt'))
  }, [pathname])

  useEffect(() => {
    const handleDisconnect = (e) => {
      if (e.detail) {
        if (window.localStorage.getItem('ledfx-newbase') !== '1') {
          setDisconnected(e.detail.isDisconnected)
        }
        if (e.detail.isDisconnected === false) {
          window.localStorage.removeItem('undefined')
          setDialogOpen(false, true)
          clearSnackbar()
          if (window.localStorage.getItem("core-init") !== 'initialized') {
            window.localStorage.setItem("core-init", 'initialized')
          }
        }
      }
      if (window.localStorage.getItem('ledfx-newbase') === '1') {
        setDialogOpen(false, true)
      }
    }
    document.addEventListener("disconnected", handleDisconnect);
    return () => {
      // document.removeEventListener("disconnected", handleDisconnect)
    }
  }, []);

  return (
    <AppBar
      color={"secondary"}
      position="fixed"
      style={{ marginTop: isElectron() ? '30px' : 0 }}
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleLeftBarOpen}
            edge="start"
            className={clsx(classes.menuButton, "step-three", open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          {((pathname.split('/').length === 3 && pathname.split('/')[1] === 'device') || pathname === '/Settings') &&
            <Button variant="text" color="inherit" className={classes.backButton} startIcon={<ChevronLeft />} onClick={() => history.goBack()} >
              Back
            </Button>}
        </div>

        <Typography variant="h6" noWrap>
          {pathname === '/' ? `LedFx`
            : (pathname.split('/').length === 3 && pathname.split('/')[1] === 'device') ? virtuals[pathname.split('/')[2]]?.config.name
              : pathname.split('/').pop()}
        </Typography>
        <div style={{ display: 'flex' }}>
          {disconnected &&
            <Box>
              <IconButton
                aria-label="display more actions"
                edge="end"
                color="inherit"
                onClick={changeHost}
                className={'step-two'}
                style={{ position: 'absolute', right: '4rem' }}
              >
                <BladeIcon
                  style={{ position: 'relative' }}
                  name={success ? "mdi:lan-connect" : "mdi:lan-disconnect"}
                />
                {loading && (
                  <CircularProgress
                    size={44}
                    style={{
                      color: 'rgba(0,0,0,0.6)',
                      position: 'absolute',
                      top: 3,
                      left: 0,
                      zIndex: 1,
                    }}
                  />
                )}
              </IconButton>
            </Box>
          }
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
        </div>


        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          className={classes.bladeMenu}
        >
          {features['cloud'] && isLogged && <MenuItem disabled divider>
            <ListItemIcon style={{ marginTop: -13 }}>
              <StyledBadge badgeContent={localStorage.getItem('ledfx-cloud-role') === 'authenticated' ? 'logged in' : localStorage.getItem('ledfx-cloud-role')} color="secondary">
                <GitHub />
              </StyledBadge>
            </ListItemIcon>
            <div>
              <div>{localStorage.getItem('username')}</div>
            </div>
          </MenuItem>}
          <MenuItem onClick={changeHost}>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            Change Host
          </MenuItem>
          <MenuItem onClick={changePause}>
            <ListItemIcon>
              {paused ? <PlayCircleOutline /> : <Pause />}
            </ListItemIcon>
            {paused ? 'Play' : 'Pause'}
          </MenuItem>
          <MenuItem onClick={changeGraphs}>
            <ListItemIcon >
              <BarChart color={graphs ? "inherit" : "secondary"} />
            </ListItemIcon>
            {!graphs ? 'Enable Graphs' : 'Disable Graphs'}
          </MenuItem>
          {pathname.split('/')[1] === 'device' ? <TourDevice cally={() => setAnchorEl(null)} />
            : pathname.split('/')[1] === 'Scenes' ? <TourScenes cally={() => setAnchorEl(null)} />
              : pathname.split('/')[1] === 'Settings' ? <TourSettings cally={() => setAnchorEl(null)} />
                : pathname.split('/')[1] === 'Devices' ? <TourDevices cally={() => setAnchorEl(null)} />
                  : pathname.split('/')[1] === 'Integrations' ? <TourIntegrations cally={() => setAnchorEl(null)} />
                    : null}
          {/* <Doc type={'menuItem'} label={'Docs'} onClick={() => setAnchorEl(null)} /> */}
          <MenuItem onClick={() => setAnchorEl(null)} component={Link} to={"/Settings"} >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            Settings
          </MenuItem>
          {features['cloud'] &&
            <MenuItem onClick={(e) => isLogged ? logout(e) : window.location.href = `https://strapi.yeonv.com/connect/github?callback=${window.location.origin}`} >
              <ListItemIcon>
                {isLogged ? <Logout /> : <Login />}
              </ListItemIcon>
              {isLogged ? 'Logout' : 'Login with Gihub'}
            </MenuItem>}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
