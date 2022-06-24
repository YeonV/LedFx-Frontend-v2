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
import useEditVirtualsStyles from '../../../Devices/EditVirtuals/EditVirtuals.styles';
import SpotifyWidgetPro from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetPro/SpWidgetPro';
// import RadarChart from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetPro/SpAudioFeatures/SpRadarChart';
import SpAudioFeatures from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetPro/SpAudioFeatures/SpAudioFeatures';
import SpAudioAnalysis from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetPro/SpAudioAnalysis/SpAudioAnalysis';
import SpotifyTriggerTable from '../../../../components/Integrations/Spotify/Widgets/SpotifyWidgetPro/SpTriggerTable';

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
        <div style={{ margin: '1rem' }}>
          <SpotifyWidgetPro />
          <div style={{ marginTop: '1rem' }} />
          <SpAudioFeatures />
          <div style={{ marginTop: '1rem' }} />
          <SpAudioAnalysis />
          <div style={{ marginTop: '1rem' }} />
          <SpotifyTriggerTable />
        </div>
        {/* <SpotifyWidgetSmall  />
        <div style={{ marginTop: '2rem' }} />
        <SpotifyWidgetDev  /> */}
      </Dialog>
    </>
  );
}

SpotifyScreen.defaultProps = SpotifyScreenDefaultProps;
