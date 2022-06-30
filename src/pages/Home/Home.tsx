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
} from '@material-ui/core';
import { Badge } from '@mui/material';
import logoCircle from '../../assets/ring.png';
import TourHome from '../../components/Tours/TourHome';
import useStore from '../../store/useStore';
import FX from '../../components/Icons/FX';
import { deleteFrontendConfig } from '../../utils/helpers';
import ButtonBar from '../../components/ButtonBar';
// import useAddToHomescreenPrompt from "../utils/useAddToHomeScreenPromt";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function Home() {
  const scanForDevices = useStore((state) => state.scanForDevices);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const [scanning, setScanning] = useState(-1);
  const invisible = useStore((state) => state.tours.home);
  // const [promptable, promptToInstall, isInstalled] = useAddToHomescreenPrompt();
  // console.log(promptable, promptToInstall, isInstalled)
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
  return (
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
        }}
      >
        <CardHeader title="Welcome to LedFx" />
        <CardContent>
          Complete Frontend Rewrite... from scratch
          <ul>
            <li>Modern React</li>
            <li>Zustand as State-Management</li>
            <li>Typescript supported</li>
            <li>Mobile First</li>
            <li>by Blade</li>
          </ul>
        </CardContent>
        <CardActions>
          <Badge variant="dot" color="primary" invisible={invisible}>
            <TourHome className="step-one" />
          </Badge>
          <Button onClick={() => handleScan()} variant="outlined">
            {scanning > -1 ? (
              <>
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
              </>
            ) : (
              'WLED-scan'
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              deleteFrontendConfig();
            }}
          >
            Clear Data
          </Button>
        </CardActions>
      </Card>
      <ButtonBar />
      {/* {promptable && !isInstalled ? (
        <ButtonElement onClick={promptToInstall}>INSTALL APP</ButtonElement>
      ) : null} */}
    </>
  );
}
