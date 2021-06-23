import { useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import useStore from './utils/apiStore';
import ScrollToTop from './utils/scrollToTop';
import ws, { WsContext, HandleWs } from "./utils/Websocket";
import { BladeDarkTheme, BladeLightTheme } from './AppThemes'
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


export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const leftBarOpen = useStore((state) => state.ui.bars && state.ui.bars.leftBar.open);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);

  useEffect(() => {
    getVirtuals();
    getSystemConfig();
    getSchemas();
  }, [getVirtuals, getSystemConfig, getSchemas]);

  return (
    <MuiThemeProvider theme={BladeDarkTheme}>
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
                <Route exact path="/" component={Home} />
                <Route path="/devices" component={Devices} />
                <Route path="/device/:virtId" component={Device} />
                <Route path="/scenes" component={Scenes} />
                <Route path="/integrations" component={Integrations} />
                <Route path="/settings" component={Settings} />
              </Switch>
              <DialogNoHost />
            </main>
            <BottomBar />
          </Router>
        </div>
      </WsContext.Provider>
    </MuiThemeProvider>
  );
}
