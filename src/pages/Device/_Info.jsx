import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Icon,
  Popover,
  Typography,
} from '@material-ui/core';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import { makeStyles } from '@material-ui/core/styles';

import Moment from 'react-moment';
import moment from 'moment';
import useStore from '../../utils/apiStore';
import Wled from '../../assets/Wled';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.secondary,
  },
  deviceCard: { width: '100%', maxWidth: '540px' },
}));

const InfoCard = ({ virtual, style }) => {
  // console.log(virtual);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState();
  const [pingData, setPingData] = useState();
  const [wledData, setWledData] = useState();
  const getPing = useStore((state) => state.getPing);
  const getDevice = useStore((state) => state.getDevice);

  const handleClick = (event) => {
    ping();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPingData(null);
  };
  const ping = async () => {
    try {
      const response = await getPing(virtual.id);
      const wledResponse = await getDevice(virtual.id);
      const ip = wledResponse.config.ip_address;
      await fetch(`http://${ip}/json/info`)
        .then((res) => res.json())
        .then((res) => setWledData(res))
        .catch((err) => console.error(err));

      if (response.statusText === 'OK') {
        setPingData(response.data);
      }
    } catch (error) {
      console.log('Error pinging display', error.message);
    }
  };
  return (
    <>
      <Card className={classes.deviceCard} style={style}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">
              {virtual.config[virtual.id]
                && virtual.config[virtual.id].is_device
                ? 'Device Config'
                : 'Virtual Config'}
            </Typography>
            {virtual.config[virtual.id]
              && virtual.config[virtual.id].is_device && (
              <>
                <Button variant="outlined" onClick={handleClick}>
                  <NetworkCheckIcon />
                </Button>
                <Popover
                  id={virtual.id}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  style={{
                    marginTop: '0.25rem',
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      fontVariant: 'all-small-caps',
                    }}
                  >
                    {!pingData ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'column',
                          minWidth: '220px',
                          minHeight: '90px',
                        }}
                      >
                        <Typography className={classes.title}>
                          pinging...
                        </Typography>
                        <CircularProgress color="primary" />
                      </div>
                    ) : (
                      <>
                        <Grid
                          container
                          spacing={4}
                          style={{
                            width: 'calc(max(38.5vw, 480px))',
                            paddingLeft: '0.5rem',
                          }}
                        >
                          <Grid item xs={12} lg={6}>
                            <Divider
                              style={{
                                marginBottom: '0.25rem',
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                fontSize: '1.5rem',
                              }}
                            >
                              <Icon
                                style={{
                                  marginRight: '0.7rem',
                                }}
                              >
                                <Wled />
                              </Icon>

                              {wledData.name}
                            </div>
                            <Divider
                              style={{
                                margin: '0.25rem 0 1rem 0',
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '180px',
                              }}
                            >
                              <Typography className={classes.title}>
                                MAXIMUM PING
                              </Typography>
                              <Typography>
                                {pingData.max_ping
                                  ? pingData.max_ping.toFixed(2)
                                  : 0}
                                {' '}
                                ms
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                AVERAGE PING
                              </Typography>
                              <Typography>
                                {pingData.avg_ping
                                  ? pingData.avg_ping.toFixed(2)
                                  : 0}
                                {' '}
                                ms
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                MINIMUM PING
                              </Typography>
                              <Typography>
                                {pingData.min_ping
                                  ? pingData.min_ping.toFixed(2)
                                  : 0}
                                {' '}
                                ms
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                PACKETS LOST
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {pingData.packetlosspercent
                                  ? pingData.packetlosspercent.toFixed(2)
                                  : 0}
                                  &nbsp;%&nbsp;
                              </Typography>
                            </div>
                            <Divider style={{ margin: '1rem 0' }} />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                WiFi Signal strength
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.wifi.signal}
                                %
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                WiFi Channel
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.wifi.channel}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                MAC
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.mac}
                              </Typography>
                            </div>

                            {wledData.leds.fps > 0 && (
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  minWidth: '220px',
                                }}
                              >
                                <Typography className={classes.title}>
                                  Frames Per Second
                                </Typography>
                                <Typography
                                  style={{
                                    paddingRight: '0.1rem',
                                  }}
                                >
                                  {wledData.leds.fps}
                                </Typography>
                              </div>
                            )}
                          </Grid>
                          <Grid item xs={12} lg={6}>
                            {/* <div
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    minWidth: '220px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    className={classes.title}
                                                                >
                                                                    NAME
                                                                </Typography>
                                                                <Typography
                                                                    style={{
                                                                        paddingRight: '0.1rem',
                                                                    }}
                                                                >
                                                                    {wledData.name}
                                                                </Typography>
                                                            </div> */}
                            <Divider style={{ margin: ' 0 0 0.5rem 0' }} />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Version
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.ver}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Chip
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.arch}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                LED Count
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.leds.count}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                RGBW
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {JSON.stringify(wledData.leds.rgbw)}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Estimated Power
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.leds.pwr
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                mA
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Max power
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.leds.maxpwr
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                mA
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Live Mode
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {JSON.stringify(wledData.live)}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Live Mode Source
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.lip}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Live Mode Protocol
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.lm}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                UDP Port
                              </Typography>
                              <Typography
                                style={{
                                  paddingRight: '0.1rem',
                                }}
                              >
                                {wledData.udpport}
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '220px',
                              }}
                            >
                              <Typography className={classes.title}>
                                Uptime
                              </Typography>
                              <Moment
                                interval={1000}
                                format="hh:mm:ss"
                                durationFromNow
                              >
                                {moment().add(wledData.uptime * -1, 's')}
                              </Moment>
                            </div>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </div>
                </Popover>
              </>
            )}
          </div>
          <Typography className={classes.title} variant="subtitle1">
            Total Pixels:
            {' '}
            {virtual.config[virtual.id]
              && virtual.config[virtual.id].pixel_count}
          </Typography>
          <br />
          <Typography variant="caption">
            Active:
            {' '}
            {JSON.stringify(
              virtual.config[virtual.id] && virtual.config[virtual.id].active,
            )}
            <br />
            Type:
            {' '}
            {JSON.stringify(
              virtual.config[virtual.id]
              && virtual.config[virtual.id].config.icon_name,
            )}
            <br />
            Center Offset:
            {' '}
            {virtual.config[virtual.id]
              && virtual.config[virtual.id].config.center_offset}
            <br />
            Crossfade:
            {' '}
            {JSON.stringify(
              virtual.config[virtual.id]
              && virtual.config[virtual.id].config.crossfade,
            )}
            <br />
            Max Brightness:
            {' '}
            {virtual.config[virtual.id]
              && `${virtual.config[virtual.id].config.max_brightness * 100}%`}
            <br />
            Preview only:
            {' '}
            {JSON.stringify(
              virtual.config[virtual.id]
              && virtual.config[virtual.id].config.preview_only,
            )}
            <br />
          </Typography>
          {/* {JSON.stringify(wledData.brand) === '"WLED"'
                                ?
                                <Typography className={classes.title} variant="subtitle1">
                                    <br />
                                    WLED Device Info:
                                </Typography>
                                : ''}
                                {JSON.stringify(wledData.brand) === '"WLED"'
                                ?
                                <Typography variant="caption">
                                    Name: {JSON.stringify(wledData.name)}
                                    <br />
                                    Uptime: {secondsToString (JSON.stringify(wledData.uptime))}
                                    <br />
                                    WLED Version: {JSON.stringify(wledData.ver)},
                                    Chip: {JSON.stringify(wledData.arch)}
                                    <br />
                                    LED Count: {numberWithCommas (JSON.stringify(wledData.leds.count))},
                                    RGBW? {JSON.stringify(wledData.leds.rgbw)}
                                    <br />
                                    Estimated current: {numberWithCommas (JSON.stringify(wledData.leds.pwr))} mA,
                                    Max power: {numberWithCommas (JSON.stringify(wledData.leds.maxpwr))} mA
                                    <br />
                                    Live Mode: {JSON.stringify(wledData.live)} ,
                                    Live Mode Source: {JSON.stringify(wledData.lip)}, {JSON.stringify(wledData.lm)} ,
                                    UDP Port: {JSON.stringify(wledData.udpport)}
                                    <br />
                                    WiFi Signal strength: {JSON.stringify(wledData.wifi.signal)}%,
                                    WiFi Channel: {JSON.stringify(wledData.wifi.channel)},
                                    MAC: {JSON.stringify(wledData.mac)}
                                    <br />
                                    {JSON.stringify(wledData.leds.fps) > 0
                                    ? <Typography variant="caption">
                                        Frames Per Second: {numberWithCommas (JSON.stringify(wledData.leds.fps))} fps
                                    <br />
                                    </Typography>
                                    : ''}
                                    {JSON.stringify(wledData.freeheap) > 10000
                                    ?
                                    <Typography variant="caption">
                                        RAM available: {numberWithCommas (JSON.stringify(wledData.freeheap))} - Good
                                    </Typography>
                                    : <Typography className={classes.title} variant="subtitle1">
                                        RAM available: {JSON.stringify(wledData.freeheap)} (This is Problematic, as less than 10k)
                                    </Typography>}
                                    </Typography>
                                    : ''} */}
        </CardContent>
      </Card>
      <Card className={classes.deviceCard} style={{ marginTop: '1rem' }}>
        <CardContent>
          <Typography variant="h5">
            {virtual.config[virtual.id] && virtual.config[virtual.id].is_device
              ? 'Device Segments'
              : 'Virtual Segments'}
          </Typography>
          <Typography variant="subtitle1">
            Segments:
            {' '}
            {virtual.config[virtual.id]
              && virtual.config[virtual.id].segments.length}
          </Typography>
          <br />
          {virtual.config[virtual.id]
            && virtual.config[virtual.id].segments.map((s, i) => (
              <li key={i}>{s.join(',')}</li>
            ))}
        </CardContent>
      </Card>
    </>
  );
};

export default InfoCard;
