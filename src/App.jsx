import { useEffect } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';

import useStore from './utils/apiStore';
import useStyles from './App.styles';
import './App.css';
import './assets/materialdesignicons.css';

import LeftBar from './components/Bars/BarLeft';
import TopBar from './components/Bars/BarTop';
import BottomBar from './components/Bars/BarBottom';
import MessageBar from './components/Bars/BarMessage';

import DialogNoHost from './components/DialogNoHost';
import Home from './pages/Home';
import Devices from './pages/Devices/Devices';
import Device from './pages/Device/Device';
import Scenes from './pages/Scenes/Scenes';
import Settings from './pages/Settings/Settings';
import Integrations from './pages/Integrations/Integrations';
import ScrollToTop from './utils/scrollToTop';

const curacaoDarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      // main: '#0dbedc',
      main: '#800000',
    },
    secondary: {
      // main: '#04424D',
      main: '#800000',
    },
    background: { default: '#030303', paper: '#151515' },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const leftBarOpen = useStore((state) => state.bars.leftBar.open);
  const getDisplays = useStore((state) => state.getDisplays);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);

  useEffect(() => {
    getDisplays();
    getSystemConfig();
    getSchemas();
  }, [getDisplays, getSystemConfig, getSchemas]);

  return (
    <MuiThemeProvider theme={curacaoDarkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
          <ScrollToTop />
          <MessageBar />
          <TopBar />
          <LeftBar />
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: leftBarOpen,
            })}
          >
            <div className={classes.drawerHeader} />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/devices" component={Devices} />
              <Route path="/device/:displayId" component={Device} />
              <Route path="/scenes" component={Scenes} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/settings" component={Settings} />
            </Switch>

            <DialogNoHost />
          </main>
          <BottomBar />
        </Router>
      </div>
    </MuiThemeProvider>
  );
}
