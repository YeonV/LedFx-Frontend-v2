import React, { useEffect } from "react";
import useStore from "./utils/Api";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import logo from "./assets/logo.png";
import logoCircle from "./assets/ring.png";
import "./App.css";
import "./assets/materialdesignicons.css";
import LeftBar from "./components/BarLeft";
import TopBar from "./components/BarTop";
import BottomBar from "./components/BarBottom";
import MessageBar from "./utils/MessageBar";
import { drawerWidth } from "./utils";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@material-ui/core";
import DialogNoHost from "./components/DialogNoHost";

const curacaoDarkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#0dbedc",
    },
    secondary: {
      main: "#999",
    },
    background: { default: "#030303" },
  },
  props: {
    MuiCard: {
      variant: "outlined",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      backgroundColor: "#ffffff30",
      width: "8px",
      borderRadius: "8px",
    },
    "*::-webkit-scrollbar-track": {
      backgroundColor: "#00000060",
      borderRadius: "8px",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#555555",
      borderRadius: "8px",
    },
    "*::-webkit-scrollbar-button": {
      display: "none",
    },
  },
  root: {
    display: "flex",
  },

  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    background: "transparent",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const leftBarOpen = useStore((state) => state.bars.leftBar.open);
  const getDisplays = useStore((state) => state.getDisplays);
  const getSystemConfig = useStore((state) => state.getSystemConfig);

  useEffect(() => {
    getDisplays();
    getSystemConfig();
  }, [getDisplays, getSystemConfig]);

  return (
    <MuiThemeProvider theme={curacaoDarkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <MessageBar />
        <TopBar />
        <LeftBar />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: leftBarOpen,
          })}
        >
          <div className={classes.drawerHeader} />

          <div className="Content">
            <div style={{ position: "relative" }}>
              <img src={logoCircle} className="App-logo" alt="logo-circle" />
              <img src={logo} className="Logo" alt="logo" />
            </div>
          </div>
          <Card variant="outlined" style={{ background: "#303030" }}>
            <CardHeader title="Welcome to LedFx" />
            <CardContent>
              Complete Frontend Rewrite... from scratch
              <ul>
                <li>Modern React</li>
                <li>Zustand as State-Management</li>
                <li>Typescript supported</li>
                <li>Mobile First</li>
                <li>...</li>
                <li>by Blade</li>
              </ul>
            </CardContent>
            <CardActions>
              <Button variant="outlined">Start Tour</Button>
              <Button variant="outlined"> Docs</Button>
              <Button variant="outlined"> Scan for WLED</Button>
            </CardActions>
          </Card>
          <DialogNoHost />
        </main>
        <BottomBar />
      </div>
    </MuiThemeProvider>
  );
}
