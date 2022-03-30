import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {
  AddPhotoAlternate,
  Devices,
  QueueMusic,
  Repeat,
  RepeatOne,
  Shuffle,
  SkipNext,
  SkipPrevious,
  VolumeDown,
  VolumeMute,
  VolumeUp,
} from '@material-ui/icons';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import { MenuItem, Select, TextField, Checkbox } from '@material-ui/core';
import useStore from '../../../../utils/apiStore';
import {
  Widget,
  CoverImage,
  TinyText,
  VolSliderStyles,
  PosSliderStyles,
} from './Spotify.styles';
import { formatTime } from '../../../../utils/utils';
import { spotifyRepeat, spotifyShuffle } from '../proxies';
import Popover from '../../../../components/Popover/Popover';

export default function SpotifyWidgetLarge({ thePlayer }: any) {
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const { position, duration, paused, repeat_mode, shuffle } = spotifyData;
  const title = spotifyData.track_window?.current_track?.name || 'loading';
  const image =
    spotifyData.track_window?.current_track?.album.images[0].url || 'loading';
  const artist = spotifyData.track_window?.current_track?.artists || 'loading';
  const album =
    spotifyData.track_window?.current_track?.album.name || 'loading';
  const spotifyDevice = useStore((state) => (state as any).spotifyDevice);
  const scenes = useStore((state) => (state as any).scenes);
  const spotifyVol = useStore((state) => (state as any).spotifyVol);
  const setSpotifyVol = useStore((state) => (state as any).setSpotifyVol);
  const [pos, setPos] = useState(position || 0);
  const [volu, setVolu] = useState(spotifyVol || 0);
  const [spotifyScene, setSpotifyScene] = useState(0);
  const setVol = (vol: number) =>
    thePlayer.current
      .setVolume(vol)
      .then(() =>
        thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v))
      );

  useEffect(() => {
    setPos(position);
  }, [position]);

  useEffect(() => {
    setVolu(spotifyVol);
  }, [spotifyVol]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPos(pos + 1000);
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <Box sx={{}}>
      <Widget sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '26%',
            }}
          >
            <CoverImage>
              <img alt="album_image" src={image} />
            </CoverImage>
            <Box sx={{ ml: 1.5, minWidth: 0 }}>
              {album}
              <Typography noWrap>
                <b>{title}</b>
              </Typography>
              <Typography noWrap letterSpacing={-0.25}>
                {artist.length > 1
                  ? artist.map((art: any) => art.name).join(',s')
                  : artist[0].name}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '45%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: -1,
              }}
            >
              <IconButton
                aria-label="previous song"
                onClick={() => spotifyShuffle(spotifyDevice, !shuffle)}
              >
                {shuffle ? (
                  <Shuffle color="primary" />
                ) : (
                  <Shuffle htmlColor="#bbb" />
                )}
              </IconButton>
              <IconButton
                aria-label="previous song"
                onClick={() => thePlayer.current.previousTrack()}
              >
                <SkipPrevious fontSize="large" htmlColor="#bbb" />
              </IconButton>
              <IconButton
                aria-label={paused ? 'play' : 'pause'}
                onClick={() => thePlayer.current.togglePlay()}
              >
                {paused ? (
                  <PlayCircle sx={{ fontSize: '3rem' }} htmlColor="#fff" />
                ) : (
                  <PauseCircle sx={{ fontSize: '3rem' }} htmlColor="#fff" />
                )}
              </IconButton>
              <IconButton
                aria-label="next song"
                onClick={() => thePlayer.current.nextTrack()}
              >
                <SkipNext fontSize="large" htmlColor="#bbb" />
              </IconButton>
              <IconButton
                aria-label="next song"
                onClick={() => spotifyRepeat(spotifyDevice, repeat_mode)}
              >
                {repeat_mode === 0 ? (
                  <Repeat htmlColor="#bbb" />
                ) : repeat_mode === 1 ? (
                  <Repeat color="primary" />
                ) : (
                  <RepeatOne color="primary" />
                )}
              </IconButton>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TinyText>{formatTime(pos)}</TinyText>
              <Slider
                aria-label="time-indicator"
                size="small"
                value={pos}
                min={0}
                step={1}
                max={duration}
                onChange={(_, value) => setPos(value as number)}
                onChangeCommitted={(_, value) => setPos(value as number)}
                sx={{ ...VolSliderStyles, margin: '0 10px' }}
              />
              <TinyText>{formatTime(duration)}</TinyText>
            </Box>
          </Box>
          <Stack
            spacing={2}
            direction="column"
            sx={{ mb: 1, px: 1, width: '26%' }}
            alignItems="center"
          >
            <Stack
              spacing={2}
              direction="row"
              sx={{ width: '80%' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                spacing={2}
                direction="row"
                sx={{ width: '80%' }}
                alignItems="center"
              >
                <IconButton
                  aria-label="next song"
                  sx={{ marginLeft: '0 !important' }}
                  onClick={() => setVol(0)}
                >
                  <QueueMusic htmlColor="rgba(255,255,255,0.4)" />
                </IconButton>
                <IconButton
                  aria-label="next song"
                  sx={{ marginLeft: '0 !important' }}
                  onClick={() => setVol(0)}
                >
                  <Devices htmlColor="rgba(255,255,255,0.4)" />
                </IconButton>
              </Stack>
              <Popover
                style={{ '&&': { marginLeft: 0 } }}
                content={
                  <div>
                    <Box sx={{ minWidth: 220, margin: 0 }}>
                      <Select
                        labelId="scenelabel"
                        id="scene"
                        value={spotifyScene}
                        label="Scene"
                        variant="outlined"
                        onChange={(_, v: any) => setSpotifyScene(v.props.value)}
                      >
                        <MenuItem value={0}>select a scene</MenuItem>
                        {scenes &&
                          Object.keys(scenes).length &&
                          Object.keys(scenes).map((s: any, i: number) => (
                            <MenuItem key={i} value={scenes[s].name || s}>
                              {scenes[s].name || s}
                            </MenuItem>
                          ))}
                      </Select>
                      <Checkbox />
                      <TextField
                        style={{ width: 120 }}
                        variant="outlined"
                        type="number"
                      />
                      <TextField
                        style={{ width: 120 }}
                        variant="outlined"
                        type="number"
                      />
                    </Box>
                  </div>
                }
                variant="text"
                icon={<AddPhotoAlternate htmlColor="rgba(255,255,255,0.4)" />}
              />
            </Stack>
            <Stack
              spacing={2}
              direction="row"
              sx={{ width: '80%' }}
              alignItems="center"
            >
              <IconButton
                aria-label="next song"
                sx={{ marginLeft: '0 !important' }}
                onClick={() => setVol(0)}
              >
                {spotifyVol === 0 ? (
                  <VolumeMute htmlColor="rgba(255,255,255,0.4)" />
                ) : spotifyVol < 0.5 ? (
                  <VolumeDown htmlColor="rgba(255,255,255,0.4)" />
                ) : (
                  <VolumeUp htmlColor="rgba(255,255,255,0.4)" />
                )}
              </IconButton>
              <Slider
                aria-label="Volume"
                min={0}
                max={100}
                value={volu * 100}
                onChange={(_, v) => setVolu((v as number) / 100)}
                onChangeCommitted={(e, v: any) => setVol(v / 100)}
                sx={{ ...PosSliderStyles, '&&&': { marginLeft: 0 } }}
              />
            </Stack>
          </Stack>
        </Box>
      </Widget>
    </Box>
  );
}
