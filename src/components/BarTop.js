import React from "react";
import useStore from "../utils/Api";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuIcon from "@material-ui/icons/Menu";
import { drawerWidth } from "../utils";
import MoreIcon from "@material-ui/icons/MoreVert";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Refresh from "@material-ui/icons/Refresh";
import Play from "@material-ui/icons/PlayCircleOutline";
import Language from "@material-ui/icons/Language";
import CloudDownload from "@material-ui/icons/CloudDownload";
import { download } from "../utils";
const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}));

const TopBar = () => {
  const classes = useStyles();
  const open = useStore((state) => state.bars.leftBar.open);
  const setLeftBarOpen = useStore((state) => state.setLeftBarOpen);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const togglePause = useStore((state) => state.togglePause);
  const shutdown = useStore((state) => state.shutdown);
  const restart = useStore((state) => state.restart);
  const config = useStore((state) => state.config);

  const handleLeftBarOpen = () => {
    setLeftBarOpen(true);
  };
  const changeHost = () => {
    setDialogOpen(true, true);
    setAnchorEl(null);
  };
  const changePause = () => {
    togglePause();
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const configDownload = async () => {
    download(
      { config, ...{ ledfx_presets: undefined } },
      "config.json",
      "application/json"
    );
  };
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar style={{ justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleLeftBarOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap>
          LedFx - BladeMod 2.0
        </Typography>
        <IconButton
          aria-label="display more actions"
          edge="end"
          color="inherit"
          onClick={handleClick}
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={changeHost}>
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            Change Host
          </MenuItem>
          <MenuItem onClick={changePause}>
            <ListItemIcon>
              <Play />
            </ListItemIcon>
            Play/Pause
          </MenuItem>
          <MenuItem onClick={configDownload}>
            <ListItemIcon>
              <CloudDownload />
            </ListItemIcon>
            Export Config
          </MenuItem>
          <MenuItem onClick={restart}>
            <ListItemIcon>
              <Refresh />
            </ListItemIcon>
            Restart
          </MenuItem>
          <MenuItem onClick={shutdown}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            Shutdown
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
