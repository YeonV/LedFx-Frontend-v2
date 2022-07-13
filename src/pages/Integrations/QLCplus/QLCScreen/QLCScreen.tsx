import React from 'react';
import {
  Typography,
  Toolbar,
  AppBar,
  Dialog,
  Button,
  Grid,
} from '@material-ui/core';
import { Settings, NavigateBefore, Add } from '@material-ui/icons';
import {
  MuiMenuItem,
  QLCScreenDefaultProps,
  QLCScreenProps,
  Transition,
} from './QLCScreen.props';
import useEditVirtualsStyles from '../../../Devices/EditVirtuals/EditVirtuals.styles';
import QLCTriggerTable from '../../../../components/Integrations/QLC/QLCTriggerTable';

export default function QLCScreen({
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
}: QLCScreenProps) {
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
          <Add />
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
              QLC+ Triggers
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ margin: '1rem' }}>
          <div style={{ marginTop: '1rem' }} />
          <Button
            autoFocus
            color="primary"
            variant="contained"
            startIcon={<Add />}
            // onClick={handleClose}
            onClick={() => console.log(' Dialog popup coming soon...')}
            style={{ marginRight: '1rem' }}
          >
            ADD EVENT LISTENER
          </Button>
          <Grid xl={12} container item alignItems="center" spacing={1} />
          <div style={{ marginTop: '1rem' }} />
          <QLCTriggerTable />
        </div>
      </Dialog>
    </>
  );
}

QLCScreen.defaultProps = QLCScreenDefaultProps;
