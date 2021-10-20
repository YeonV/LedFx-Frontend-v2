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

export default function App() {
  const classes = useStyles();

  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);

  const ledfxTheme = window.localStorage.getItem('ledfx-theme')|| 'Dark' ;
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
    // console.log(ledfxTheme, ledfxThemes, ledfxThemes[ledfxTheme])
  }, []);

  useEffect(() => {
    // const { Menu, MenuItem } = require('@electron/remote');
    if (process.versions.hasOwnProperty('electron')) {
      const customTitleBar = window.require('custom-electron-titlebar');
      const titlebar = new customTitleBar.Titlebar({
        backgroundColor: customTitleBar.Color.fromHex('#444'),
        icon: '/images/logo.png',
      });
      const menu = Menu.getApplicationMenu()

      titlebar.updateMenu(menu);
    }
    return () => {
      if (process.versions.hasOwnProperty('electron')) {
        titlebar.dispose();
      }
    };
  }, []);

  return (
    <MuiThemeProvider theme={ledfxThemes[ledfxTheme|| 'Dark']}>
      <WsContext.Provider value={ws}>
        <div className={classes.root}>
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
