import { useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import useStore from './utils/apiStore';
import ScrollToTop from './utils/scrollToTop';
import ws, { WsContext, HandleWs } from "./utils/Websocket";
import { BladeDarkTheme, BladeDarkOrangeTheme, BladeLightTheme, BladeDarkGreenTheme, BladeDarkBlueTheme, BladeDarkGreyTheme } from './AppThemes'
import useStyles from './App.styles';
import './App.css';
import './assets/materialdesignicons.css';
import LeftBar from './components/Bars/BarLeft';
import TopBar from './components/Bars/BarTop';
import BottomBar from './components/Bars/BarBottom';
import MessageBar from './components/Bars/BarMessage';
import NoHostDialog from './components/Dialogs/NoHostDialog';
import Home from './pages/Home';
import Devices from './pages/Devices/Devices';
import Device from './pages/Device/Device';
import Scenes from './pages/Scenes/Scenes';
import Settings from './pages/Settings/Settings';
import Integrations from './pages/Integrations/Integrations';
import { initFrontendConfig } from './utils/helpers';
import LoginRedirect from './pages/LoginRedirect';
import isElectron from 'is-electron';


export default function App() {
  const classes = useStyles();
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);
  const shutdown = useStore((state) => state.shutdown);

  const ledfxTheme = window.localStorage.getItem('ledfx-theme') || (window.location.origin === 'https://my.ledfx.app' ? 'DarkGreen' : 'Dark');
  const ledfxThemes = {
    "Dark": BladeDarkTheme,
    "DarkOrange": BladeDarkOrangeTheme,
    "Light": BladeLightTheme,
    "DarkGreen": BladeDarkGreenTheme,
    "DarkBlue": BladeDarkBlueTheme,
    "DarkGrey": BladeDarkGreyTheme
  }

  useEffect(() => {
    getVirtuals();
    getSystemConfig();
    getSchemas();
  }, [getVirtuals, getSystemConfig, getSchemas]);

  useEffect(() => {
    initFrontendConfig();
  }, []);

  window.api?.receive('fromMain', (parameters) => {
    if (parameters === 'trigger-function') {
      shutdown()
    }
  });

  return (
    <MuiThemeProvider theme={ledfxThemes[ledfxTheme || 'Dark']}>
      <WsContext.Provider value={ws}>
        <div className={classes.root} style={{ paddingTop: isElectron() ? '30px' : 0 }}>
          <CssBaseline />
          <Router basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <HandleWs />
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
                <Route exact path="/connect/:providerName/redirect" component={LoginRedirect} />
                <Route exact path="/" component={Home} />
                <Route path="/devices" component={Devices} />
                <Route path="/device/:virtId" component={Device} />
                <Route path="/scenes" component={Scenes} />
                <Route path="/integrations" component={Integrations} />
                <Route path="/settings" component={Settings} />
              </Switch>
              <NoHostDialog />
            </main>
            <BottomBar />
          </Router>
        </div>
      </WsContext.Provider>
    </MuiThemeProvider>
  );
}
