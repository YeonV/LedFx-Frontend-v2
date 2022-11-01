/* eslint-disable no-promise-executor-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Badge,
} from '@mui/material';
import logoCircle from '../../assets/ring.png';
import TourHome from '../../components/Tours/TourHome';
import useStore from '../../store/useStore';
import FX from '../../components/Icons/FX';
// import { deleteFrontendConfig } from '../../utils/helpers';
import ButtonBar from '../../components/ButtonBar';
import Dashboard from './Dashboard';
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function Home() {
  const scanForDevices = useStore((state) => state.scanForDevices);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const [scanning, setScanning] = useState(-1);
  const invisible = useStore((state) => state.tours.home);
  const features = useStore((state) => state.features);

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
  return features.dashboard ? (
    <Dashboard />
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
            color="primary"
            invisible={invisible}
            sx={{ mr: 1 }}
          >
            <TourHome />
          </Badge>
          <Button onClick={() => handleScan()} variant="outlined">
            <BladeIcon name="wled" style={{ marginTop: -3, marginRight: 10 }} />
            {scanning > -1 ? (
              <div style={{ position: 'relative', marginLeft: 20, height: 24 }}>
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
          </Button>
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
