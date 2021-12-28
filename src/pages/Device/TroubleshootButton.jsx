import React, { useEffect } from 'react';
import { Button, Dialog, AppBar, Toolbar, Typography, Slide, Divider, Icon, Grid} from '@material-ui/core';
import { BugReport, NavigateBefore } from '@material-ui/icons';
import { useEditVirtualsStyles } from '../Devices/EditVirtuals/EditVirtuals.styles'
import useStore from '../../utils/apiStore';
import Wled from '../../components/Icons/Wled';
import Moment from 'react-moment';
import moment from 'moment';

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

      <Grid container spacing={4} style={{width: 'calc(max(38.5vw, 480px))', paddingLeft: '0.5rem',}}>
        <Grid item xs={12} lg={6}>
          <Divider style={{marginBottom: '0.25rem',}}/>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '1.5rem',}}>
          <Icon style={{marginRight: '0.7rem',}}> <Wled /></Icon> {wledData.name}</div>
          <Divider style={{margin: '0.25rem 0 1rem 0'}}/>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '180px'}}>
          <Typography className={classes.title}>MAXIMUM PING</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '180px'}}>
          <Typography>{pingData.max_ping ? pingData.max_ping.toFixed(2): 0}{' '} ms</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}> AVERAGE PING </Typography>
          <Typography>{pingData.avg_ping ? pingData.avg_ping.toFixed( 2) : 0}{' '} ms</Typography></div>
          <div style={{display: 'flex',justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>MINIMUM PING</Typography>
          <Typography>{pingData.min_ping ? pingData.min_ping.toFixed( 2) : 0}{' '} ms</Typography></div>
          <div style={{display: 'flex',justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>PACKETS LOST</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{pingData.packetlosspercent ? pingData.packetlosspercent.toFixed(2) : 0}{' '} %</Typography></div>
          <Divider style={{ margin: '1rem 0' }} />
          <div style={{display: 'flex',justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>WiFi Signal strength</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.wifi?.signal} %</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>WiFi Channel</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.wifi?.channel}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>MAC</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.mac}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Frames Per Second</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.leds?.fps} fps</Typography></div>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Divider style={{ margin: ' 0 0 0.5rem 0' }}/>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Version</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.ver}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Chip</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.arch}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>LED Count</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.leds?.count}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>RGBW</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.leds?.rgbw}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Estimated Power</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.leds?.pwr?.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')} mA</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Max power</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.leds?.max_pwr?.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')} mA</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Live Mode</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{JSON.stringify(wledData.live)}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Live Mode Source</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.lip}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Live Mode Protocol</Typography>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.lm}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>UDP Port</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography style={{paddingRight: '0.1rem',}}>{wledData.udpport}</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Typography className={classes.title}>Uptime</Typography></div>
          <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '220px',}}>
          <Moment interval={1000} format="hh:mm:ss" durationFromNow>{moment().add(wledData.uptime * -1, 's')}</Moment></div>
        </Grid>
      </Grid>
      {/*
        {pingData && <div style={{ margin: '0 1rem' }}><pre>{JSON.stringify(pingData, null, 2)}</pre></div>}
        {wledData && <div style={{ margin: '0 1rem' }}><pre>{JSON.stringify(wledData, null, 2)}</pre></div>}
        */}
      </Dialog>
    </>
  ) : (<></>);
}
