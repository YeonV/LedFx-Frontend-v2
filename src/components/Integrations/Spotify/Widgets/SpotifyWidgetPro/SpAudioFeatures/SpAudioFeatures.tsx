/* eslint-disable @typescript-eslint/indent */
import { useEffect } from 'react';
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
import RadarChart from './SpAudioFeaturesRadarChart';

export default function SpAudioFeatures() {
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const songID = spotifyData?.track_window?.current_track?.id || '';
  // const getTrackFeaturesData = useStore((state) =>
  //   (state as any).getTrackFeaturesData
  // );
  const spotifyToken = useStore((state) => (state as any).spotifyAuthToken);
  const { setSpotifyData }: any = useStore((state: any) => state);
  const { audioFeatures } = useStore((state) => (state as any).spotifyData);
  useEffect(() => {
    getTrackFeatures(songID, spotifyToken).then((res) => {
      console.log(res);
      setSpotifyData('audioFeatures', res);
    });
  }, []);

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
                <TableCell align="right">{audioFeatures?.tempo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Pitch class (Key)
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
                  Modality/Mode (Major/Minor)
                </TableCell>
                <TableCell align="right">
                  {audioFeatures?.mode === 0 ? 'Minor' : 'Major'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Time Signature (How many beats in each bar)
                </TableCell>
                <TableCell align="right">
                  {audioFeatures?.time_signature}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={6} item>
        <TableContainer component={Paper}>
          <div>
            <RadarChart {...audioFeatures} />
          </div>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
