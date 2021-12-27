import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import useStore from '../../utils/apiStore';
import { useEditVirtualsStyles } from '../Devices/EditVirtuals/EditVirtuals.styles'
import { BugReport, NavigateBefore } from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TroubleshootButton({
  virtual,
  className
}) {
  const classes = useEditVirtualsStyles();
  const devices = useStore((state) => state.devices);
  const [open, setOpen] = React.useState(false);
  const [wledData, setWledData] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(async () => {
    if (devices[virtual.id]) {
      const res = await fetch(`http://${devices[virtual.id]["config"]["ip_address"]}/json/info`)
      const resp = await res.json()
      setWledData(resp)
    }
  }, [devices])

  return virtual && virtual.config && devices[virtual.id] && devices[virtual.id].type === 'wled' ? (
    <>
      <Button
        variant={'outlined'}
        color={'default'}
        onClick={handleClickOpen}
        style={{ marginRight: '.5rem' }}
        className={className}
      >
        <BugReport />
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
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
              {virtual.config.name}{' '}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.segmentTitle}>
          <Typography variant="caption">Troubleshoot</Typography>
        </div>
        {wledData && <div style={{ margin: '0 1rem' }}><pre>{JSON.stringify(wledData, null, 2)}</pre></div>}
      </Dialog>
    </>
  ) : (<></>);
}
