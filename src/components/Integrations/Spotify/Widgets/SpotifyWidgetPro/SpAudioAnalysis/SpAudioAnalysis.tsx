/* eslint-disable @typescript-eslint/indent */
import { useEffect } from 'react';
import {
  // Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  // TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
} from '@material-ui/core';
import { Stack } from '@mui/material';
// import {
//   ComposedChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Area,
// } from 'recharts';
import { getTrackAnalysis } from '../../../../../../utils/spotifyProxies';
import useStore from '../../../../../../store/useStore';

export default function SpAudioAnalysis() {
  const playerState = useStore(
    (state) => state.spotify.spotifyData.playerState
  );
  const audioAnalysis = useStore(
    (state) => state.spotify.spotifyData.audioAnalysis
  );
  const songID = playerState?.track_window?.current_track?.id || '';
  const spotifyToken = useStore((state) => state.spotify.spotifyAuthToken);
  const setSpotifyData = useStore((state) => state.setSpData);

  const meta = playerState?.context?.metadata?.current_item?.name;

  useEffect(() => {
    if (songID)
      getTrackAnalysis(songID, spotifyToken).then((res) => {
        // console.log(res);
        setSpotifyData('audioAnalysis', res);
      });
  }, [meta]);

  return (
    <Grid xl={12} container item alignItems="center">
      <Grid xl={2} md={2} xs={6} item>
        <Card>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="flex-end">
                      Bars
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {audioAnalysis?.bars.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="flex-end">
                      Beats
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {audioAnalysis?.beats.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="flex-end">
                      Sections
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {audioAnalysis?.sections.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="flex-end">
                      Segments
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {audioAnalysis?.segments.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="flex-end">
                      Tatums
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {audioAnalysis?.tatums.length}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
}
