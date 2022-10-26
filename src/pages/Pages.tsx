import {
  HashRouter as Router,
  BrowserRouter,
  Routes,
  Route,
  // Link,
} from 'react-router-dom';

import clsx from 'clsx';
import { useHotkeys } from 'react-hotkeys-hook';
import isElectron from 'is-electron';
import { styled } from '@mui/material/styles';
import ScrollToTop from '../utils/scrollToTop';

// import useStyles from '../App.styles';
import '../App.css';

import LeftBar from '../components/Bars/BarLeft';
import TopBar from '../components/Bars/BarTop';
import BottomBar from '../components/Bars/BarBottom';
import MessageBar from '../components/Bars/BarMessage';
import NoHostDialog from '../components/Dialogs/NoHostDialog';
import Home from './Home/Home';
import Devices from './Devices/Devices';
import Device from './Device/Device';
import Scenes from './Scenes/Scenes';
import Settings from './Settings/Settings';
import Integrations from './Integrations/Integrations';
import LoginRedirect from './Login/LoginRedirect';
import SmartBar from '../components/Dialogs/SmartBar';
import useStore from '../store/useStore';
import SpotifyLoginRedirect from './Integrations/Spotify/SpotifyLoginRedirect';
import { drawerWidth } from '../utils/helpers';

const PREFIX = 'Pages';

const classes = {
  content: `${PREFIX}-content`,
  drawerHeader: `${PREFIX}-drawerHeader`,
  contentShift: `${PREFIX}-card`,
};
const Root = styled('div')(({ theme }: any) => ({
  [`& .${classes.content}`]: {
    flexGrow: 1,
    background: 'transparent',
    padding: theme.spacing(0),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    '@media (max-width: 580px)': {
      padding: '8px',
    },
  },

  [`& .${classes.drawerHeader}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },

  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const Routings = ({ handleWs }: any) => {
  const smartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.bars.smartBar.open
  );
  const setSmartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarOpen
  );
  const leftBarOpen = useStore(
    (state) => state.ui.bars && state.ui.bars.leftBar.open
  );

  useHotkeys('ctrl+alt+y', () => setSmartBarOpen(!smartBarOpen));
  useHotkeys('ctrl+alt+z', () => setSmartBarOpen(!smartBarOpen));

  return (
    <>
      <ScrollToTop />
      {handleWs}
      <MessageBar />
      <TopBar />
      <LeftBar />
      <Root
        className={clsx(classes.content, {
          [classes.contentShift]: leftBarOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <Routes>
          <Route
            path="/connect/:providerName/redirect"
            element={<LoginRedirect />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/device/:virtId" element={<Device />} />
          <Route path="/scenes" element={<Scenes />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <NoHostDialog />
        <SmartBar
          open={smartBarOpen}
          setOpen={(e) => setSmartBarOpen(!!e)}
          direct={false}
        />
      </Root>
      <BottomBar />
    </>
  );
};

const Pages = ({ handleWs }: any) => {
  return (
    <>
      {isElectron() ? (
        <Router>
          <Routings handleWs={handleWs} />
        </Router>
      ) : (
        <Router basename={process.env.PUBLIC_URL}>
          <Routings handleWs={handleWs} />
        </Router>
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/callback" element={<SpotifyLoginRedirect />} />
          <Route path="*" element={<></>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Pages;
