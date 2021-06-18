import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
} from '@material-ui/core';
import logo from '../assets/logo.png';
import logoCircle from '../assets/ring.png';
import Guide from '../components/Guide';
import useStore from '../utils/apiStore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  Logo: {
    height: '20vmin',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff000'
  }
}));


const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export default function Home() {
  const classes = useStyles();
  const scanForDevices = useStore((state) => state.scanForDevices);
  const getDevices = useStore((state) => state.getDevices);
  const getDisplays = useStore((state) => state.getDisplays);
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    scanForDevices().then(async () => {
      for (let sec = 1; sec <= 10; sec++) {
        await sleep(1000).then(() => {
          getDevices();
          getDisplays();
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
          <img src={logo} className={classes.Logo} alt="logo" />
        </div>
      </div>
      <Card
        variant="outlined"
        style={{
          // background: '#303030',
          maxWidth: '400px',
          margin: '0 auto',
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
            <li>...</li>
            <li>by Blade</li>
          </ul>
        </CardContent>
        <CardActions>
          <Guide className={'step-one'} />
          <Button disabled variant="outlined">
            Docs
          </Button>
          <Button variant="outlined" onClick={()=>{
            window.localStorage.removeItem('undefined')
            window.localStorage.removeItem('ledfx-host')
            window.localStorage.removeItem('ledfx-hosts')
            window.localStorage.removeItem('ledfx-ws')
            }}>
            Clear Data
          </Button>
          <Button onClick={() => handleScan()} variant="outlined">
            {scanning ? <CircularProgress
              variant="determinate"
              value={(scanning / 10) * 100}
              size={24}
            /> : 'Scan'}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
