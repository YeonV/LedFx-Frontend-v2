import { useState } from "react";
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
} from '@material-ui/core';
import logoCircle from '../assets/ring.png';
import TourHome from '../components/Tours/TourHome';
import useStore from '../utils/apiStore';
import FX from "../components/Icons/FX";
// import useAddToHomescreenPrompt from "../utils/useAddToHomeScreenPromt";

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default function Home(props) {
  const scanForDevices = useStore((state) => state.scanForDevices);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const [scanning, setScanning] = useState(false)
  const invisible = useStore((state) => state.tours.home);
  // const [promptable, promptToInstall, isInstalled] = useAddToHomescreenPrompt();
  // console.log(promptable, promptToInstall, isInstalled)
  const handleScan = () => {
    setScanning(true)
    scanForDevices().then(async () => {
      for (let sec = 1; sec <= 30; sec++) {
        await sleep(1000).then(() => {
          getDevices();
          getVirtuals();
          setScanning(sec)
        });
      }
    }).then(() => {
      setScanning(false)
    })
  }
  return (
    <>
      <div className="Content">
        <div style={{ position: 'relative' }} >
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
            <TourHome className={'step-one'} />
          </Badge>
          <Button onClick={() => handleScan()} variant="outlined">
            {scanning ? <><CircularProgress
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
                <Typography variant="caption" style={{ fontSize: 10 }} component="div" color="textSecondary">{`${Math.round(
                  (scanning / 30) * 100,
                )}%`}</Typography>
              </Box>
            </> : 'WLED-scan'}
          </Button>
        </CardActions>
      </Card>
      {/* {promptable && !isInstalled ? (
        <ButtonElement onClick={promptToInstall}>INSTALL APP</ButtonElement>
      ) : null} */}
    </>
  );
}
