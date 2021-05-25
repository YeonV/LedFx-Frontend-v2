import React from "react";
import useStore from "../utils/Api";
import { camelToSnake } from "../utils";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ChevronLeft, ChevronRight, Inbox, Mail } from "@material-ui/icons";
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

import { drawerWidth } from "../utils";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

const LeftBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const displays = useStore((state) => state.displays);
  const open = useStore((state) => state.bars.leftBar.open);
  const setOpen = useStore((state) => state.setLeftBarOpen);

  const handleDrawerClose = () => {
    setOpen(false);
  };
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
        logo
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
                  // d.effect && d.effect.active === true
                  //   ? isViewActive(`/displays/${d.id}`)
                  //     ? "inherit"
                  //     : "primary"
                  //   : "inherit"
                  "inherit"
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
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <Inbox /> : <Mail />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default LeftBar;
