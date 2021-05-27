import useStore from "../../utils/apiStore";
import { camelToSnake } from "../../utils/helpers";
import { useTheme } from "@material-ui/core/styles";
import useStyles from "./BarLeft.styles";
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
import logoAsset from "../../assets/logo.png";
import Wled from "../../assets/Wled";
import { Link } from "react-router-dom";
// import { useHistory, Link } from "react-router-dom";

const LeftBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const displays = useStore((state) => state.displays);
  const open = useStore((state) => state.bars.leftBar.open);
  const setOpen = useStore((state) => state.setLeftBarOpen);
  // const history = useHistory();

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
      <div className={classes.devbadge}></div>
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
          <Link
            style={{ textDecoration: "none" }}
            key={i}
            to={`/device/${displays[d].id}`}
            onClick={() => {
              handleDrawerClose();
            }}
          >
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
                    <Wled />
                  ) : displays[d].config.icon_name.startsWith("mdi:") ? (
                    <span
                      className={`mdi mdi-${displays[d].config.icon_name.split("mdi:")[1]
                        }`}
                    ></span>
                  ) : (
                    camelToSnake(
                      displays[d].config.icon_name || "SettingsInputComponent"
                    )
                  )}
                </Icon>
              </ListItemIcon>
              <ListItemText
                style={{ color: "#fff" }}
                primary={displays[d].config.name}
              />
            </ListItem>
          </Link>
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
