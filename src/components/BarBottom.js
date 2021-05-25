import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Settings from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";
import Wallpaper from "@material-ui/icons/Wallpaper";
import SettingsInputSvideoIcon from "@material-ui/icons/SettingsInputSvideo";
import SettingsInputComponent from "@material-ui/icons/SettingsInputComponent";
import { useHistory, Link } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    background: "#121212",
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState("home");
  const history = useHistory();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.root}
      showLabels
    >
      <BottomNavigationAction
        component={Link}
        label="Home"
        value="home"
        to={"/"}
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        label="Devices"
        value="devices"
        component={Link}
        to={"/Devices"}
        icon={<SettingsInputComponent />}
      />
      <BottomNavigationAction
        component={Link}
        to={"/Scenes"}
        label="Scenes"
        value="scenes"
        icon={<Wallpaper />}
      />

      {/* <BottomNavigationAction
        label="Integrations"
        value="integrations"
        component={Link}
        to={"/Integrations"}
        icon={<SettingsInputSvideoIcon />}
      /> */}

      <BottomNavigationAction
        label="Settings"
        value="settings"
        icon={<Settings />}
        component={Link}
        to={"/Settings"}
      />
    </BottomNavigation>
  );
}
