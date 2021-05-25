import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Settings from "@material-ui/icons/Settings";
import SettingsInputComponent from "@material-ui/icons/SettingsInputComponent";
import Wallpaper from "@material-ui/icons/Wallpaper";
import SettingsInputSvideoIcon from "@material-ui/icons/SettingsInputSvideo";

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
  const [value, setValue] = React.useState("devices");

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
        label="Devices"
        value="devices"
        icon={<SettingsInputComponent />}
      />
      <BottomNavigationAction
        label="Scenes"
        value="scenes"
        icon={<Wallpaper />}
      />
      <BottomNavigationAction
        label="Integrations"
        value="integrations"
        icon={<SettingsInputSvideoIcon />}
      />
      <BottomNavigationAction
        label="Settings"
        value="settings"
        icon={<Settings />}
      />
    </BottomNavigation>
  );
}
