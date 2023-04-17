/* eslint-disable no-promise-executor-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Badge,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import logoCircle from '../../assets/ring.png';
import TourHome from '../../components/Tours/TourHome';
import useStore from '../../store/useStore';
import FX from '../../components/Icons/FX';
// import { deleteFrontendConfig } from '../../utils/helpers';
import ButtonBar from '../../components/ButtonBar';
import Dashboard from './Dashboard';
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon';
import DashboardDetailed from './DashboardDetailed';
import Popover from '../../components/Popover/Popover';
import ws from '../../utils/Websocket';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function Home() {
  const scanForDevices = useStore((state) => state.scanForDevices);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const [scanning, setScanning] = useState(-1);
  const [lastFound, setLastFound] = useState([] as string[]);
  const invisible = useStore((state) => state.tours.home);
  const features = useStore((state) => state.features);
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const setSystemConfig = useStore((state) => state.setSystemConfig);
  const { enqueueSnackbar } = useSnackbar();

  const onSystemSettingsChange = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig());
  };
  const handleScan = () => {
    setScanning(0);
    scanForDevices()
      .then(async () => {
        for (let sec = 1; sec <= 30; sec++) {
          await sleep(1000).then(() => {
            getDevices();
            getVirtuals();
            setScanning(sec);
          });
        }
      })
      .then(() => {
        setScanning(-1);
      });
  };

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      if (e.detail.id === 'device_created') {
        if (lastFound.indexOf(e.detail.device_name) === -1) {
          enqueueSnackbar(`New Device added: ${e.detail.device_name}`, {
            variant: 'info',
          });
          setLastFound([...lastFound, e.detail.device_name]);
        }
      }
    };
    document.addEventListener('YZ_device_created', handleWebsockets);
    return () => {
      document.removeEventListener('YZ_device_created', handleWebsockets);
    };
  }, []);

  useEffect(() => {
    const handleWebsockets = () => {
      const req = {
        event_type: 'device_created',
        id: 1337,
        type: 'subscribe_event',
      };
      // console.log("Send");
      (ws as any).send(JSON.stringify(++req.id && req));
    };
    document.addEventListener('subs_device_created', handleWebsockets);
    return () => {
      const removeGetWs = async () => {
        const request = {
          id: 1337,
          type: 'unsubscribe_event',
          event_type: 'device_created',
        };
        (ws as any).send(JSON.stringify(++request.id && request));
      };
      // console.log("Clean Up");
      removeGetWs();
      document.removeEventListener('subs_device_created', handleWebsockets);
    };
  }, []);

  return features.dashboard ? (
    features.dashboardDetailed ? (
      <DashboardDetailed />
    ) : (
      <Dashboard />
    )
  ) : (
    <>
      <div className="Content">
        <div style={{ position: 'relative' }}>
          <img src={logoCircle} className="App-logo" alt="logo-circle" />
          <FX />
        </div>
      </div>
      <Card
        variant="outlined"
        style={{
          maxWidth: '400px',
          margin: '0.5rem auto 2rem auto',
          textAlign: 'center',
        }}
      >
        <CardHeader title="Welcome to LedFx v2" />
        <CardContent>
          Use the Start-Tour-Button to get an introduction. Advanced users might
          explore Expert-Mode in settings.
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Badge
            variant="dot"
            color="error"
            invisible={invisible}
            sx={{ mr: 1 }}
          >
            <TourHome />
          </Badge>
          <Popover
            noIcon
            variant="outlined"
            color="inherit"
            onConfirm={() => {
              onSystemSettingsChange('create_segments', true);
              handleScan();
            }}
            onCancel={() => {
              onSystemSettingsChange('create_segments', false);
              handleScan();
            }}
            text="Import Segments?"
          >
            <>
              <BladeIcon
                name="wled"
                style={{ marginTop: -3, marginRight: 10 }}
              />
              {scanning > -1 ? (
                <div
                  style={{ position: 'relative', marginLeft: 20, height: 24 }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={(scanning / 30) * 100}
                    size={24}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="caption"
                      style={{ fontSize: 10 }}
                      component="div"
                      color="textSecondary"
                    >
                      {`${Math.round((scanning / 30) * 100)}%`}
                    </Typography>
                  </Box>
                </div>
              ) : (
                <>WLED-scan</>
              )}
            </>
          </Popover>
          {/* <Button
            onClick={() => {
              deleteFrontendConfig();
            }}
          >
            Clear Data
          </Button> */}
        </CardActions>
      </Card>
      <ButtonBar />
    </>
  );
}
