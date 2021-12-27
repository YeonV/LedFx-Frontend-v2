import React, { useEffect } from 'react';
import { Button, Dialog, AppBar, Toolbar, Typography, Slide } from '@material-ui/core';
import { BugReport, NavigateBefore } from '@material-ui/icons';
import { useEditVirtualsStyles } from '../Devices/EditVirtuals/EditVirtuals.styles'
import useStore from '../../utils/apiStore';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TroubleshootButton({ virtual }) {
  const classes = useEditVirtualsStyles();
  const devices = useStore((state) => state.devices);
  const getPing = useStore((state) => state.getPing);
  const [open, setOpen] = React.useState(false);
  const [wledData, setWledData] = React.useState({});
  const [pingData, setPingData] = React.useState({});

  useEffect(async () => {
    if (devices[virtual.id]) {
      const res = await fetch(`http://${devices[virtual.id]["config"]["ip_address"]}/json/info`)
      const resp = await res.json()
      setWledData(resp)
      const ping = getPing(virtual.id)
      const resPing = await ping
      setPingData(resPing)
    }
  }, [devices])

  return virtual && virtual.config && devices[virtual.id] && devices[virtual.id].type === 'wled' ? (
    <>
      <Button
        variant={'outlined'}
        color={'default'}
        onClick={() => setOpen(true)}
        style={{ marginRight: '.5rem' }}
      >
        <BugReport />
      </Button>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button
              autoFocus
              color="primary"
              variant="contained"
              startIcon={<NavigateBefore />}
              onClick={() => setOpen(false)}
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
        {pingData && <div style={{ margin: '0 1rem' }}><pre>{JSON.stringify(pingData, null, 2)}</pre></div>}
      </Dialog>
    </>
  ) : (<></>);
}
