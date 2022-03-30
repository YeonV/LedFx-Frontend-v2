/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import useStore from '../../../../utils/apiStore';
import {
  Widget,
  CoverImage,
  TinyText,
  VolSliderStyles,
  PosSliderStyles,
} from './Spotify.styles';
import { formatTime } from '../../../../utils/utils';

export default function SpotifyWidgetSmall({ thePlayer }: any) {
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const { position, duration, paused } = spotifyData;
  const title = spotifyData.track_window.current_track.name;
  const image = spotifyData.track_window.current_track.album.images[0].url;
  const artist = spotifyData.track_window.current_track.artists;
  const album = spotifyData.track_window.current_track.album.name;
  const spotifyVol = useStore((state) => (state as any).spotifyVol);
  const setSpotifyVol = useStore((state) => (state as any).setSpotifyVol);
  const [pos, setPos] = useState(position || 0);
  const [volu, setVolu] = useState(spotifyVol || 0);
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

  return (
    <Box sx={{}}>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img alt="can't win - Chilling Sunday" src={image} />
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
        <Slider
          aria-label="time-indicator"
          size="small"
          value={pos}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPos(value as number)}
          onChangeCommitted={(_, value) => setPos(value as number)}
          sx={VolSliderStyles}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatTime(position)}</TinyText>
          <TinyText>{formatTime(duration)}</TinyText>
        </Box>
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
            onClick={() => thePlayer.current.previousTrack()}
          >
            <FastRewindRounded fontSize="large" htmlColor="#fff" />
          </IconButton>
          <IconButton
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => thePlayer.current.togglePlay()}
          >
            {paused ? (
              <PlayArrowRounded sx={{ fontSize: '3rem' }} htmlColor="#fff" />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor="#fff" />
            )}
          </IconButton>
          <IconButton
            aria-label="next song"
            onClick={() => thePlayer.current.nextTrack()}
          >
            <FastForwardRounded fontSize="large" htmlColor="#fff" />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded
            htmlColor="rgba(255,255,255,0.4)"
            onClick={() => setVol(0)}
          />
          <Slider
            aria-label="Volume"
            min={0}
            max={100}
            value={volu * 100}
            onChange={(_, v) => setVolu((v as number) / 100)}
            onChangeCommitted={(e, v: any) => setVol(v / 100)}
            sx={PosSliderStyles}
          />
          <VolumeUpRounded
            htmlColor="rgba(255,255,255,0.4)"
            onClick={() => setVol(1)}
          />
        </Stack>
      </Widget>
    </Box>
  );
}
