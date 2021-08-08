import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
} from '@material-ui/core';
import logoCircle from '../assets/ring.png';
import TourHome from '../components/Tours/TourHome';
import useStore from '../utils/apiStore';
import FX from "../assets/FX";
// import { deleteFrontendConfig } from "../utils/helpers";

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export default function Home() {
  const scanForDevices = useStore((state) => state.scanForDevices);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const [scanning, setScanning] = useState(false)
  

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
          // background: '#303030',
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
          <TourHome className={'step-one'} />
          {/* <Button disabled variant="outlined">
            Docs
          </Button> */}
          {/* {parseInt(window.localStorage.getItem('BladeMod')) > 10 && <Button disabled={!(parseInt(window.localStorage.getItem('BladeMod')) > 10)}  variant="outlined" onClick={()=>{
            deleteFrontendConfig()
            }}>
            Clear Data
          </Button>} */}
          <Button onClick={() => handleScan()} variant="outlined">
            {scanning ? <CircularProgress
              variant="determinate"
              value={(scanning / 30) * 100}
              size={24}
            /> : 'WLED-scan'}
          </Button>
        </CardActions>
      </Card>      
    </>
  );
}
