import { useState } from "react";
import { useHistory } from "react-router-dom";
import useStore from "../utils/Api";
import clsx from "clsx";
import { drawerWidth } from "../utils";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@material-ui/core";
import logo from "../assets/logo.png";
import logoCircle from "../assets/ring.png";

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
    "@media (max-width: 480px)": {
      marginLeft: "-100vw",
    },
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <>
      <div className="Content">
        <div style={{ position: "relative" }}>
          <img src={logoCircle} className="App-logo" alt="logo-circle" />
          <img src={logo} className="Logo" alt="logo" />
        </div>
      </div>
      <Card
        variant="outlined"
        style={{
          background: "#303030",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
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
          <Button variant="outlined">Tour</Button>
          <Button variant="outlined">Docs</Button>
          <Button variant="outlined">Scan</Button>
        </CardActions>
      </Card>
    </>
  );
}
