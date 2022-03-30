import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {
  AddPhotoAlternate,
  // Devices,
  // QueueMusic,
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
import {
  MenuItem,
  Select,
  Checkbox,
  Button,
  InputAdornment,
} from '@material-ui/core';
import { OutlinedInput } from '@mui/material';
import useStore from '../../../../utils/apiStore';
import useStyle, {
  CoverImage,
  TinyText,
  VolSliderStyles,
  PosSliderStyles,
} from './Spotify.styles';

import { formatTime } from '../../../../utils/utils';
import {
  spotifyPlay,
  spotifyRepeat,
  spotifyShuffle,
} from '../../../../utils/spotifyProxies';
import Popover from '../../../Popover/Popover';

export default function SpotifyWidgetLarge({ thePlayer }: any) {
  const classes = useStyle();
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const { position, duration, paused, repeat_mode, shuffle } = spotifyData;
  const title = spotifyData.track_window?.current_track?.name || 'Not playing';
  const image =
    spotifyData.track_window?.current_track?.album.images[0].url ||
    'https://github.com/LedFx/LedFx/raw/master/icons/discord.png';
  const artist = spotifyData.track_window?.current_track?.artists || [
    { name: 'on LedFx' },
  ];
  const album = spotifyData.track_window?.current_track?.album.name || '';
  const spotifyDevice = useStore((state) => (state as any).spotifyDevice);
  const scenes = useStore((state) => (state as any).scenes);
  const spotifyVol = useStore((state) => (state as any).spotifyVol);
  const setSpotifyVol = useStore((state) => (state as any).setSpotifyVol);
  const [pos, setPos] = useState(position || 0);
  const posi = useRef(position || 0);
  const [volu, setVolu] = useState(spotifyVol || 0);
  const [spotifyScene, setSpotifyScene] = useState(0);
  const [includeTime, setIncludeTime] = useState(false);
  const setVol = (vol: number) =>
    thePlayer.current
      .setVolume(vol)
      .then(() =>
        thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v))
      );

  useEffect(() => {
    setPos(position);
    posi.current = position;
  }, [position]);

  useEffect(() => {
    setVolu(spotifyVol);
  }, [spotifyVol]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (posi.current && !paused) {
        posi.current += 1000;
        setPos(posi.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [position, paused]);

  return (
    <Box sx={{}}>
      <div className={classes.Widget}>
        <Box className={classes.spotifyWrapper}>
          <Box
            className={classes.spotifyTrackStyles}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '26%',
            }}
          >
            <CoverImage className={classes.albumImg}>
              <img alt="album_image" src={image} />
            </CoverImage>
            <Box sx={{ ml: 1.5, minWidth: 0 }}>
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.7)"
                fontSize={10}
                noWrap
              >
                {album}
              </Typography>
              <Typography noWrap>
                <b>{title}</b>
              </Typography>
              <Typography
                noWrap
                letterSpacing={-0.25}
                color="rgba(255,255,255,0.8)"
              >
                {artist.length > 1
                  ? artist.map((art: any) => art.name).join(',')
                  : artist[0].name}
              </Typography>
            </Box>
          </Box>

          <Box className={classes.spotifyControlStyles} sx={{ width: '45%' }}>
            {album !== '' ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: -1,
                  }}
                >
                  <div className="showTablet">
                    <IconButton
                      aria-label="next song"
                      sx={{ marginLeft: '0 !important' }}
                      onClick={() => setVol(spotifyVol === 0 ? 1 : 0)}
                    >
                      {spotifyVol === 0 ? (
                        <VolumeMute
                          style={{ fontSize: '1.5rem' }}
                          htmlColor="rgba(255,255,255,0.7)"
                        />
                      ) : spotifyVol < 0.5 ? (
                        <VolumeDown
                          style={{ fontSize: '1.5rem' }}
                          htmlColor="rgba(255,255,255,0.7)"
                        />
                      ) : (
                        <VolumeUp
                          style={{ fontSize: '1.5rem' }}
                          htmlColor="rgba(255,255,255,0.7)"
                        />
                      )}
                    </IconButton>
                  </div>
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
                  <div className="showTablet">
                    <Stack
                      spacing={2}
                      direction="row"
                      sx={{ width: '100%' }}
                      alignItems="baseline"
                      justifyContent="flex-end"
                    >
                      <Popover
                        variant="text"
                        size="large"
                        icon={
                          <AddPhotoAlternate
                            style={{ fontSize: '1.5rem' }}
                            htmlColor="rgba(255,255,255,0.7)"
                          />
                        }
                        onConfirm={() =>
                          // eslint-disable-next-line no-console
                          console.log(spotifyScene, includeTime, posi.current)
                        }
                        content={
                          <div>
                            <Box sx={{ minWidth: 220, margin: 0 }}>
                              <Select
                                labelId="scenelabel"
                                id="scene"
                                value={spotifyScene}
                                label="Scene"
                                variant="outlined"
                                onChange={(_, v: any) =>
                                  setSpotifyScene(v.props.value)
                                }
                              >
                                <MenuItem value={0}>select a scene</MenuItem>
                                {scenes &&
                                  Object.keys(scenes).length &&
                                  Object.keys(scenes).map(
                                    (s: any, i: number) => (
                                      <MenuItem
                                        key={i}
                                        value={scenes[s].name || s}
                                      >
                                        {scenes[s].name || s}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                              <Checkbox
                                checked={includeTime}
                                onChange={(_, v) => setIncludeTime(v)}
                              />
                              {includeTime ? (
                                <>
                                  <OutlinedInput
                                    style={{
                                      width: 115,
                                      color: '#fff',
                                      border: 0,
                                    }}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        min
                                      </InputAdornment>
                                    }
                                    type="number"
                                    value={
                                      formatTime(posi.current).split(':')[0]
                                    }
                                  />
                                  <OutlinedInput
                                    style={{
                                      width: 95,
                                      color: '#fff',
                                      borderColor: '#fff',
                                    }}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        s
                                      </InputAdornment>
                                    }
                                    value={
                                      formatTime(posi.current).split(':')[1]
                                    }
                                    type="number"
                                  />
                                </>
                              ) : (
                                <div
                                  style={{
                                    width: 210,
                                    display: 'inline-block',
                                  }}
                                >
                                  include current time?
                                </div>
                              )}
                            </Box>
                          </div>
                        }
                      />
                    </Stack>
                  </div>
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
                    // eslint-disable-next-line no-console
                    onChangeCommitted={(_, value) =>
                      thePlayer.current.seek(value as number)
                    }
                    sx={{ ...VolSliderStyles, margin: '0 10px' }}
                  />
                  <TinyText>{formatTime(duration)}</TinyText>
                </Box>
              </>
            ) : (
              <div>
                <Button onClick={() => spotifyPlay(spotifyDevice)}>
                  HiJack
                </Button>
              </div>
            )}
          </Box>

          <Stack
            className={classes.spotifyDesktopVolStyles}
            spacing={2}
            direction="column"
            sx={{ mb: 1, px: 1, width: '26%' }}
            alignItems="center"
          >
            <Stack
              spacing={2}
              direction="row"
              sx={{ width: '100%' }}
              alignItems="baseline"
              justifyContent="flex-end"
            >
              {/* <Stack
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
              </Stack> */}
              <Popover
                variant="text"
                size="large"
                icon={
                  <AddPhotoAlternate
                    style={{ fontSize: '2rem' }}
                    htmlColor="rgba(255,255,255,0.7)"
                  />
                }
                onConfirm={() =>
                  // eslint-disable-next-line no-console
                  console.log(spotifyScene, includeTime, posi.current)
                }
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
                      <Checkbox
                        checked={includeTime}
                        onChange={(_, v) => setIncludeTime(v)}
                      />
                      {includeTime ? (
                        <>
                          <OutlinedInput
                            style={{
                              width: 115,
                              color: '#fff',
                              border: 0,
                            }}
                            endAdornment={
                              <InputAdornment position="end">
                                min
                              </InputAdornment>
                            }
                            type="number"
                            value={formatTime(posi.current).split(':')[0]}
                          />
                          <OutlinedInput
                            style={{
                              width: 95,
                              color: '#fff',
                              borderColor: '#fff',
                            }}
                            endAdornment={
                              <InputAdornment position="end">s</InputAdornment>
                            }
                            value={formatTime(posi.current).split(':')[1]}
                            type="number"
                          />
                        </>
                      ) : (
                        <div style={{ width: 210, display: 'inline-block' }}>
                          include current time?
                        </div>
                      )}
                    </Box>
                  </div>
                }
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
                onClick={() => setVol(spotifyVol === 0 ? 1 : 0)}
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
      </div>
    </Box>
  );
}
