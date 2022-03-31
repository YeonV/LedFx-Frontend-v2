import React from 'react';
import {
  ListItemIcon,
  Typography,
  Toolbar,
  AppBar,
  Dialog,
  Button,
} from '@material-ui/core';
import { Settings, NavigateBefore } from '@material-ui/icons';
import {
  MuiMenuItem,
  SpotifyScreenDefaultProps,
  SpotifyScreenProps,
  Transition,
} from './SpotifyScreen.props';
import { useEditVirtualsStyles } from '../../../Devices/EditVirtuals/EditVirtuals.styles';

// import SpotifyWidgetDev from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetDev';
// import SpotifyWidgetSmall from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetSmall';
import SpotifyWidgetLarge from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetPro/SpotifyWidgetPro';

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
              startIcon={<NavigateBefore />}
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
        {/* <SpotifyWidgetSmall thePlayer={thePlayer} />
        <div style={{ marginTop: '2rem' }} />
        <SpotifyWidgetDev thePlayer={thePlayer} /> */}
      </Dialog>
    </>
  );
}

SpotifyScreen.defaultProps = SpotifyScreenDefaultProps;
