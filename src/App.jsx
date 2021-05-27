import { useEffect } from "react";
import useStore from "./utils/apiStore";
import useStyles from "./App.styles";
import "./App.css";
import "./assets/materialdesignicons.css";

import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";

import LeftBar from "./components/Bars/BarLeft";
import TopBar from "./components/Bars/BarTop";
import BottomBar from "./components/Bars/BarBottom";
import MessageBar from "./components/Bars/BarMessage";

import { MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import DialogNoHost from "./components/DialogNoHost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Device from "./pages/Device/Device";
import Scenes from "./pages/Scenes";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";

const curacaoDarkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#0dbedc",
    },
    secondary: {
      main: "#999",
    },
    background: { default: "#030303", paper: "#151515" },
  },
  props: {
    MuiCard: {
      variant: "outlined",
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
