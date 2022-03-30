import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { ListItemIcon, MenuItem } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { TransitionProps } from '@material-ui/core/transitions';
import { useEditVirtualsStyles } from '../../../Devices/EditVirtuals/EditVirtuals.styles';
import SpotifyWidgetDev from '../Widgets/SpotifyWidgetDev';
import SpotifyWidgetSmall from '../Widgets/SpotifyWidgetSmall';
import SpotifyWidgetLarge from '../Widgets/SpotifyWidgetLarge';
import {
  SpotifyScreenDefaultProps,
  SpotifyScreenProps,
} from './SpotifyScreen.props';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

Transition.defaultProps = {
  children: <div>loading</div>,
};

const MuiMenuItem = React.forwardRef((props: any, ref: React.Ref<unknown>) => {
  return <MenuItem ref={ref} {...props} />;
});

export default function SpotifyScreen({
  icon = <Settings />,
  startIcon,
  label = '',
  type,
  className,
  color = 'default',
  variant = 'contained',
  innerKey,
  disabled = false,
  size = 'small',
  thePlayer,
}: SpotifyScreenProps) {
  const classes = useEditVirtualsStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {type === 'menuItem' ? (
        <MuiMenuItem
          key={innerKey}
          className={className}
          onClick={(e: any) => {
            e.preventDefault();
            handleClickOpen();
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {label}
        </MuiMenuItem>
      ) : (
        <Button
          variant={variant}
          startIcon={startIcon}
          color={color}
          onClick={() => {
            handleClickOpen();
          }}
          size={size}
          disabled={disabled}
          className={className}
        >
          {label}
          {!startIcon && icon}
        </Button>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button
              autoFocus
              color="primary"
              variant="contained"
              startIcon={<NavigateBeforeIcon />}
              onClick={handleClose}
              style={{ marginRight: '1rem' }}
            >
              back
            </Button>
            <Typography variant="h6" className={classes.title}>
              Spotify
            </Typography>
          </Toolbar>
        </AppBar>

        <SpotifyWidgetLarge thePlayer={thePlayer} />
        <div style={{ marginTop: '2rem' }} />
        <SpotifyWidgetSmall thePlayer={thePlayer} />
        <div style={{ marginTop: '2rem' }} />
        <SpotifyWidgetDev thePlayer={thePlayer} />
      </Dialog>
    </>
  );
}

SpotifyScreen.defaultProps = SpotifyScreenDefaultProps;
