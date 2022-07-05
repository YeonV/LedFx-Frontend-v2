/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  useTheme,
} from '@material-ui/core';
import {
  Stack,
  CircularProgress as CircularProgress5,
  Fab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  DeleteForever,
  PauseOutlined,
  PlayArrow,
} from '@material-ui/icons';
import green from '@material-ui/core/colors/green';
import { Dvr } from '@mui/icons-material';
import useStore from '../../store/useStore';
import { deleteFrontendConfig } from '../../utils/helpers';
import Gauge from './Gauge';
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scanForDevices = useStore((state) => state.scanForDevices);
  const devices = useStore((state) => state.devices);
  const virtuals = useStore((state) => state.virtuals);
  const scenes = useStore((state) => state.scenes);
  const integrations = useStore((state) => state.integrations);
  const paused = useStore((state) => state.paused);
  const togglePause = useStore((state) => state.togglePause);
  const getDevices = useStore((state) => state.getDevices);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const [scanning, setScanning] = useState(-1);

  const pixelTotal = Object.keys(devices)
    .map((d) => devices[d].config.pixel_count)
    .reduce((a, b) => a + b);

  const devicesOnline = Object.keys(devices).filter((d) => devices[d].online);
  const virtualsReal = Object.keys(virtuals).filter(
    (d) => !virtuals[d].is_device
  );

  const pixelTotalOnline = Object.keys(devices)
    .map((d) => devices[d].online && devices[d].config.pixel_count)
    .reduce((a, b) => a + b);

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

  const setSmartBarOpen = useStore(
    (state) => state.ui.bars && state.ui.setSmartBarOpen
  );

  return (
    <div className="Content">
      <Stack spacing={2} alignItems="center">
        <Stack spacing={2} direction="row">
          <Gauge
            value={pixelTotal > 0 ? 100 : 0}
            unit="Pixels"
            total={pixelTotal}
            current={pixelTotal}
          />
          <Gauge
            value={Object.keys(devices).length > 0 ? 100 : 0}
            unit="Devices"
            total={Object.keys(devices).length}
            current={Object.keys(devices).length}
            onClick={() => navigate('/Devices')}
          />
          <Gauge
            value={virtualsReal.length > 0 ? 100 : 1}
            unit="Virtuals"
            total={Object.keys(virtuals).length}
            current={virtualsReal.length}
            onClick={() => navigate('/Devices')}
          />
          <Gauge
            unit="Scenes"
            total={Object.keys(scenes).length}
            current={Object.keys(scenes).length}
            onClick={() => navigate('/Scenes')}
          />
        </Stack>

        <Stack spacing={2} direction="row">
          <Gauge
            unit="Pixels online"
            total={pixelTotal}
            current={pixelTotalOnline}
          />
          <Gauge
            unit="Devices online"
            total={Object.keys(devices).length}
            current={Object.keys(devicesOnline).length}
            onClick={() => navigate('/Devices')}
          />
        </Stack>

        <Stack spacing={2} direction="row">
          <Box sx={{ m: 1, position: 'relative' }}>
            <Fab
              aria-label="scan-wled"
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                },
                ...(scanning > -1 && {
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                  },
                }),
              }}
              onClick={handleScan}
            >
              {scanning > -1 ? (
                <Typography
                  variant="caption"
                  style={{ fontSize: 10 }}
                  component="div"
                >
                  {`${Math.round((scanning / 30) * 100)}%`}
                </Typography>
              ) : (
                <BladeIcon name="wled" />
              )}
            </Fab>
            {scanning > -1 && (
              <CircularProgress5
                size={68}
                sx={{
                  color: theme.palette.primary.main,
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
          <Fab
            aria-label="clear-data"
            onClick={() => {
              deleteFrontendConfig();
            }}
            style={{
              margin: '8px',
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.light,
              },
            }}
          >
            <DeleteForever />
          </Fab>
          <Fab
            aria-label="play-pause"
            onClick={() => {
              togglePause();
            }}
            style={{
              margin: '8px',
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.light,
              },
            }}
          >
            {paused ? <PauseOutlined /> : <PlayArrow />}
          </Fab>
          <Fab
            aria-label="play-pause"
            onClick={() => setSmartBarOpen(true)}
            style={{
              margin: '8px',
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.light,
              },
            }}
          >
            <Dvr />
          </Fab>
        </Stack>
      </Stack>
    </div>
  );
};

export default Dashboard;
