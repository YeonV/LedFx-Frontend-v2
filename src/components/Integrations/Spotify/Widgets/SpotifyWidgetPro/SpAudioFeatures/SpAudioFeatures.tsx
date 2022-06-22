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
} from '@material-ui/core';
import { BarChart, MusicNote, Speed } from '@material-ui//icons';
import { Piano } from '@mui/icons-material';
import { getTrackFeatures } from '../../../../../../utils/spotifyProxies';
import RadarChart from './SpRadarChart';
import useStore from '../../../../../../store/useStore';

export default function SpAudioFeatures() {
  const playerState = useStore(
    (state) => state.spotify.spotifyData.playerState
  );
  const audioFeatures = useStore(
    (state) => state.spotify.spotifyData.audioFeatures
  );
  const songID = playerState?.track_window?.current_track?.id || '';
  // const getTrackFeaturesData = useStore((state) =>
  //   (state as any).getTrackFeaturesData
  // );
  const spotifyToken = useStore((state) => state.spotify.spotifyAuthToken);
  const setSpotifyData = useStore((state) => state.setSpData);

  const meta = playerState?.context?.metadata?.current_item?.name;

  useEffect(() => {
    if (songID)
      getTrackFeatures(songID, spotifyToken).then((res) => {
        // console.log(res);
        setSpotifyData('audioFeatures', res);
      });
  }, [meta]);

  // const audioFeatures = {
  //   danceability: 0.76,
  //   energy: 0.964,
  //   key: 2,
  //   loudness: -5.844,
  //   mode: 1,
  //   speechiness: 0.0576,
  //   acousticness: 0.00182,
  //   instrumentalness: 0.7,
  //   liveness: 0.0974,
  //   valence: 0.641,
  //   tempo: 125,
  //   type: 'audio_features',
  //   id: '62WEkOD8TUO7wzkolOQW9v',
  //   uri: 'spotify:track:62WEkOD8TUO7wzkolOQW9v',
  //   track_href: 'https://api.spotify.com/v1/tracks/62WEkOD8TUO7wzkolOQW9v',
  //   analysis_url:
  //     'https://api.spotify.com/v1/audio-analysis/62WEkOD8TUO7wzkolOQW9v',
  //   duration_ms: 248036,
  //   time_signature: 4,
  // };

  return (
    <Grid xl={12} container item style={{ margin: '0px 20px' }} spacing={2}>
      <Grid xl={3} md={4} xs={6} item>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            {/* <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              <TableRow>
                <TableCell>
                  <Speed />
                  BPMs
                </TableCell>
                <TableCell align="right">{audioFeatures?.tempo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">
                  <Piano />
                  Pitch class
                </TableCell>
                <TableCell align="right">
                  {audioFeatures?.key
                    ? audioFeatures.key === 0
                      ? 'C'
                      : audioFeatures.key === 1
                      ? 'C#'
                      : audioFeatures.key === 2
                      ? 'D'
                      : audioFeatures.key === 3
                      ? 'D#'
                      : audioFeatures.key === 4
                      ? 'E'
                      : audioFeatures.key === 5
                      ? 'F'
                      : audioFeatures.key === 6
                      ? 'F#'
                      : audioFeatures.key === 7
                      ? 'G'
                      : audioFeatures.key === 8
                      ? 'G#'
                      : audioFeatures.key === 9
                      ? 'A'
                      : audioFeatures.key === 10
                      ? 'A#'
                      : audioFeatures.key === 11
                      ? 'B'
                      : 'N/A'
                    : 'N/A'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <MusicNote /> Modality
                </TableCell>
                <TableCell align="right">
                  {audioFeatures?.mode === 0 ? 'Minor' : 'Major'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <BarChart />
                  Beats per bar
                </TableCell>
                <TableCell align="right">
                  {audioFeatures?.time_signature}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xl={2} xs={6} item>
        <Paper>
          <div style={{ padding: '20px 0px' }}>
            <RadarChart {...audioFeatures} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
