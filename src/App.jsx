import { useEffect, useState, createRef } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@mui/styles';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import { CssBaseline } from '@material-ui/core';
import useStore from './utils/apiStore';
import ScrollToTop from './utils/scrollToTop';
import ws, { WsContext, HandleWs } from "./utils/Websocket";
import { BladeDarkTheme, BladeDarkOrangeTheme, BladeLightTheme, BladeDarkGreenTheme, BladeDarkBlueTheme, BladeDarkGreyTheme } from './AppThemes'
import { BladeDarkTheme5, BladeDarkOrangeTheme5, BladeLightTheme5, BladeDarkGreenTheme5, BladeDarkBlueTheme5, BladeDarkGreyTheme5 } from './AppThemes5'
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
import { deleteFrontendConfig, initFrontendConfig, log } from './utils/helpers';
import LoginRedirect from './pages/LoginRedirect';
import isElectron from 'is-electron';
import WaveLines from './components/Icons/waves';
import useWindowDimensions from './utils/useWindowDimension';
import { useHotkeys } from 'react-hotkeys-hook'
import SmartBar from './components/Dialogs/SmartBar';
import wsNew, { HandleWsNew, WsContextNew } from './utils/WebsocketNew';
import { TrainRounded } from '@mui/icons-material';
import { SnackbarProvider } from 'notistack';
import { Close } from '@material-ui/icons';
import { useSnackbar } from 'notistack';


export default function App() {
  const classes = useStyles();
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);
  const shutdown = useStore((state) => state.shutdown);
  const features = useStore((state) => state.features);
  const setFeatures = useStore((state) => state.setFeatures);
  const setShowFeatures = useStore((state) => state.setShowFeatures);

  const showSnackbar = useStore((state) => state.showSnackbar);
  const setHost = useStore((state) => state.setHost);

  const [open, setOpen] = useState(false)
  useHotkeys('ctrl+alt+y', () => setOpen(!open));

  const { height, width } = useWindowDimensions();

  let newBase = !!window.localStorage.getItem('ledfx-newbase')

  if (window.location.hash.indexOf("newCore=1") > -1) {
    window.localStorage.setItem('ledfx-newbase', 1)
    window.localStorage.setItem('ledfx-host', 'http://localhost:8080')
    newBase = 1
  }

  const ledfxTheme = !!window.localStorage.getItem('ledfx-theme') ?
    window.localStorage.getItem('ledfx-theme')
    : !!window.localStorage.getItem('hassTokens') ? 'DarkBlue'
      : window.location.origin === 'https://my.ledfx.app' ? 'DarkGreen'
        : isElectron() ? 'DarkOrange'
          : 'DarkRed';

  const ledfxThemes = {
    "Dark": BladeDarkTheme,
    "DarkRed": BladeDarkTheme,
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
    if (features['go'] || window.location.hash.indexOf("newCore=1") > -1) {
      window.localStorage.setItem('ledfx-newbase', 1)
      window.localStorage.removeItem('undefined')
      window.localStorage.removeItem('ledfx-hosts')
      setShowFeatures('go', true);
      setFeatures('go', true);
      if (window.localStorage.getItem('ledfx-host') !== 'http://localhost:8080') {
        window.localStorage.setItem('ledfx-host', 'http://localhost:8080')
      }
      setHost('http://localhost:8080')
      newBase = true
    } else {
      window.localStorage.removeItem('ledfx-newbase')
      newBase = false
    }
  }, []);

  useEffect(() => {
    initFrontendConfig();
    console.info('%c Ledfx ' + '%c\n       © by Blade  ', 'padding: 10px 40px; color: #ffffff; border-radius: 5px 5px 0 0; background-image:url(https://my.ledfx.app/favicon/favicon-32x32.png); background-color: #800000; background-repeat: no-repeat; background-position: 10% 50%;', 'background: #fff; color: #800000; border-radius: 0 0 5px 5px;padding: 5px 0;');
    // log("Blade's Loggin Tools")
    // log("successSUCCESS", { id: 'test' })
    // log("warningWARNING", { id: 'test' })
    // log("infoINFO", { id: 'test' })
    if (features['go'] || window.location.hash.indexOf("newCore=1") > -1) {
      window.localStorage.setItem('ledfx-host', 'http://localhost:8080')
    }
  }, []);

  window.api?.receive('fromMain', (parameters) => {
    if (parameters === 'shutdown') {
      shutdown()
    }
    if (parameters === 'clear-frontend') {
      deleteFrontendConfig()
    }
  });

  useEffect(() => {
    const handleWebsockets = (e) => {
      showSnackbar({
        message: e.detail.message,
        messageType: e.detail.type,
      });
    }
    document.addEventListener("YZNEW", handleWebsockets);
    return () => {
      document.removeEventListener("YZNEW", handleWebsockets)
    }
  }, []);


  return (
    <ThemeProvider theme={BladeDarkGreyTheme5}>
      <MuiThemeProvider theme={ledfxThemes[ledfxTheme || 'DarkRed']}>
        <SnackbarProvider maxSnack={5}>
          <WsContextNew.Provider value={wsNew}>
            <WsContext.Provider value={ws}>
              <div className={classes.root} style={{ paddingTop: isElectron() ? '30px' : 0 }}>
                <CssBaseline />
                <Router basename={process.env.PUBLIC_URL}>
                  <ScrollToTop />
                  {!newBase && <HandleWs />}
                  {newBase && <HandleWsNew />}
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
                    <SmartBar open={open} setOpen={setOpen} />
                  </main>
                  <BottomBar />
                </Router>
                {features['waves'] && <WaveLines
                  startColor={ledfxThemes[ledfxTheme || 'DarkRed'].palette.primary.main}
                  stopColor={ledfxThemes[ledfxTheme || 'DarkRed'].palette.accent.main || '#ffdc0f'}
                  width={width - 8}
                  height={height}
                />}
              </div>
            </WsContext.Provider>
          </WsContextNew.Provider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}
