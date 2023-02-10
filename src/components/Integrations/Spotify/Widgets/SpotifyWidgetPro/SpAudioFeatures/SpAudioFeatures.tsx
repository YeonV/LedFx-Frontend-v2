/* eslint-disable @typescript-eslint/indent */
import { useContext, useEffect } from 'react';
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
  Stack,
  Switch,
  // useTheme,
} from '@mui/material';
import {
  BarChart,
  MusicNote,
  Speed,
  Wallpaper,
  Piano,
  Insights,
} from '@mui/icons-material';
import {
  getTrackFeatures,
  getTrackAnalysis,
} from '../../../../../../utils/spotifyProxies';
import RadarChart from './SpRadarChart';
import useStore from '../../../../../../store/useStore';
import { SpotifyStateContext } from '../../../SpotifyProvider';

export default function SpAudioFeatures() {
  // const theme = useTheme();
  const spotifyState = useContext(SpotifyStateContext);
  const audioFeatures = useStore(
    (state) => state.spotify.spotifyData.audioFeatures
  );
  const songID = spotifyState?.track_window?.current_track?.id || '';
  // const getTrackFeaturesData = useStore(
  //   (state) => (state as any).getTrackFeaturesData
  // );
  const showAdvancedSpotify = useStore(
    (state) => state.spotify.showAdvancedSpotify
  );
  const setShowAdvancedSpotify = useStore(
    (state) => state.setShowAdvancedSpotify
  );
  const spotifyToken = useStore((state) => state.spotify.spotifyAuthToken);
  const setSpotifyData = useStore((state) => state.setSpData);

  const meta = spotifyState?.context?.metadata?.current_item?.name;

  useEffect(() => {
    if (songID) {
      getTrackFeatures(songID, spotifyToken).then((res) => {
        setSpotifyData('audioFeatures', res);
      });
      if (showAdvancedSpotify) {
        getTrackAnalysis(songID, spotifyToken).then((data) => {
          setSpotifyData('trackAnalysis', data);
        });
      }
    }
  }, [meta, showAdvancedSpotify]);

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
    <>
      <Grid xl={2} lg={3} md={6} sm={12} xs={12} item>
        <Card style={{ border: '1px solid rgb(102,102,102)', height: 300 }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell style={{ padding: '13px 16px' }}>
                    <Stack direction="row" alignItems="flex-end">
                      <Speed style={{ marginRight: '0.5rem' }} />
                      Tempo
                    </Stack>
                  </TableCell>
                  <TableCell align="right" style={{ padding: '13px 16px' }}>
                    {parseInt(audioFeatures?.tempo, 10)} BPM
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" style={{ padding: '13px 16px' }}>
                    <Stack direction="row" alignItems="flex-end">
                      <Piano style={{ marginRight: '0.5rem' }} />
                      Pitch class
                    </Stack>
                  </TableCell>
                  <TableCell align="right" style={{ padding: '13px 16px' }}>
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
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ padding: '13px 16px' }}
                  >
                    <Stack direction="row" alignItems="flex-end">
                      <MusicNote style={{ marginRight: '0.5rem' }} />
                      Modality
                    </Stack>
                  </TableCell>
                  <TableCell align="right" style={{ padding: '13px 16px' }}>
                    {audioFeatures?.mode === 0 ? 'Minor' : 'Major'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ padding: '13px 16px' }}
                  >
                    <Stack direction="row" alignItems="flex-end">
                      <BarChart style={{ marginRight: '0.5rem' }} />
                      Beats per bar
                    </Stack>
                  </TableCell>
                  <TableCell align="right" style={{ padding: '13px 16px' }}>
                    {audioFeatures?.time_signature}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ padding: '13px 16px' }}
                  >
                    <Stack direction="row" alignItems="flex-end">
                      <Wallpaper style={{ marginRight: '0.5rem' }} />
                      Triggers
                    </Stack>
                  </TableCell>
                  <TableCell align="right" style={{ padding: '13px 16px' }}>
                    0
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ padding: '2px 16px' }}>
                    <Stack direction="row" alignItems="flex-end">
                      <Insights style={{ marginRight: '0.5rem' }} />
                      Advanced
                    </Stack>
                  </TableCell>
                  <TableCell align="right" style={{ padding: '2px 0' }}>
                    <Switch
                      checked={showAdvancedSpotify}
                      onChange={() =>
                        setShowAdvancedSpotify(!showAdvancedSpotify)
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      <Grid xl={3} lg={4} md={6} sm={12} xs={12} item>
        <Card>
          <div
            style={{
              height: '250px',
              overflow: 'hidden',
              border: '1px solid rgb(102, 102, 102)',
              borderRadius: 4,
              // background: theme.palette.background.paper,
            }}
          >
            <RadarChart {...audioFeatures} />
          </div>
        </Card>
      </Grid>
    </>
  );
}
