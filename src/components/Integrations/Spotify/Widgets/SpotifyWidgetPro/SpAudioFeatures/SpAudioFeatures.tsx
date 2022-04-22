// import { useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@material-ui/core';
import useStore from '../../../../../../utils/apiStore';
import { getTrackFeatures } from '../../../../../../utils/spotifyProxies';
import RadarChart from '../SpSceneTrigger/SpAudioFeaturesRadarChart';

export default function SpAudioFeatures() {
  getTrackFeatures('spotify', 'spotify:track:5Z9ZyQXyX5QZxYX5Z9ZyQX').then(
    console.log
  );

  const getSpotifyTriggers = useStore(
    (state) => (state as any).getSpotifyTriggers
  );
  console.log('getSpotifyTriggers', getSpotifyTriggers);
  return (
    <Grid md={12} container item style={{ margin: '0px 20px' }}>
      <Grid xs={6} item>
        <TableContainer component={Paper}>
          <div>
            <Typography>Audio Features</Typography>
          </div>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  BPM (Tempo)
                </TableCell>
                <TableCell align="right">112</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Pitch class (Key)
                </TableCell>
                <TableCell align="right">C#</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Modality/Mode (Major/Minor)
                </TableCell>
                <TableCell align="right">Minor</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Time Signature (How many beats in each bar)
                </TableCell>
                <TableCell align="right">4</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={6} item>
        <TableContainer component={Paper}>
          <div>
            <RadarChart />
          </div>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
