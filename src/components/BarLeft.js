import React from "react";
import useStore from "../utils/Api";
import { camelToSnake } from "../utils";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Home,
  Wallpaper,
  SettingsInputSvideo,
  SettingsInputComponent,
} from "@material-ui/icons";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  Icon,
  Divider,
  IconButton,
} from "@material-ui/core";
import logoAsset from "../assets/logo.png";
import { drawerWidth } from "../utils";
import blademod from "../assets/blademod.svg";
import { useHistory, Link } from "react-router-dom";

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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX: "hidden",
  },
  "@media (max-width: 480px)": {
    drawer: {
      width: "100vw",
    },
    drawerPaper: {
      width: "100vw",
    },
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  logo: {
    position: "relative",
    padding: "15px 15px",
    zIndex: "4",
  },
  logoLink: {
    padding: "5px 0",
    display: "block",
    fontSize: "18px",
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "30px",
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover": {
      color: "#FFFFFF",
    },
  },
  logoImage: {
    width: "30px",
    display: "inline-block",
    maxHeight: "30px",
    marginLeft: "10px",
    marginRight: "15px",

    "& img": {
      width: "35px",
      top: "17px",
      position: "absolute",
      verticalAlign: "middle",
      border: "0",
    },
  },
  devbadge: {
    backgroundImage: `url(${blademod})`,
    backgroundColor: "#0dbedc",
    border: "1px solid #0dbedc",
    color: "#fff",
    borderRadius: "15px",
    width: "150px",
    padding: "5px 25px",
    backgroundSize: "230px",
    height: "25px",
    marginBottom: "0.5rem",
    backgroundRepeat: "no-repeat",
    textAlign: "right",
    backgroundPosition: "-40px 50%",
  },
}));

const LeftBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const displays = useStore((state) => state.displays);
  const open = useStore((state) => state.bars.leftBar.open);
  const setOpen = useStore((state) => state.setLeftBarOpen);
  const history = useHistory();

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const logo = (
    <div className={classes.logo}>
      <a href="/#" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <img src={logoAsset} alt="logo" className={classes.img} />
        </div>
        LedFx
      </a>

      <div className={classes.devbadge}>
        {/* {process.env.REACT_APP_VERSION} */}
      </div>
    </div>
  );

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        {logo}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {Object.keys(displays).map((d, i) => (
          <ListItem button key={displays[d].config.name}>
            <ListItemIcon>
              <Icon
                color={
                  d.effect && d.effect.active === true ? "primary" : "inherit"
                  // "inherit"
                }
                style={{ position: "relative" }}
              >
                {displays[d].config.icon_name &&
                displays[d].config.icon_name.startsWith("wled") ? (
                  // <Wled />
                  <div>wled</div>
                ) : displays[d].config.icon_name.startsWith("mdi:") ? (
                  <span
                    className={`mdi mdi-${
                      displays[d].config.icon_name.split("mdi:")[1]
                    }`}
                  ></span>
                ) : (
                  camelToSnake(
                    displays[d].config.icon_name || "SettingsInputComponent"
                  )
                )}
              </Icon>
            </ListItemIcon>
            <ListItemText primary={displays[d].config.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Link key={"Home"} to={"/"}>
          <ListItem>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary={"Home"} />
          </ListItem>
        </Link>
        <Link key={"Devices"} to={"Devices"}>
          <ListItem>
            <ListItemIcon>
              <SettingsInputComponent />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary={"Devices"} />
          </ListItem>
        </Link>
        <Link key={"Scenes"} to={"Scenes"}>
          <ListItem>
            <ListItemIcon>
              <Wallpaper />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary={"Scenes"} />
          </ListItem>
        </Link>
        <Link key={"Integrations"} to={"Integrations"}>
          <ListItem>
            <ListItemIcon>
              <SettingsInputSvideo />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary={"Integrations"} />
          </ListItem>
        </Link>
        <Link key={"Settings"} to={"Settings"}>
          <ListItem>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary={"Settings"} />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default LeftBar;
