/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {
  AddPhotoAlternate,
  VolumeDown,
  VolumeMute,
  VolumeUp,
} from '@material-ui/icons';
import { MenuItem, Select, Checkbox, InputAdornment } from '@material-ui/core';
import { OutlinedInput } from '@mui/material';
import useStore from '../../../../utils/apiStore';
import useStyle, { CoverImage, VolSliderStyles } from './Spotify.styles';

import { formatTime } from '../../../../utils/utils';
import Popover from '../../../Popover/Popover';
import SpotifyControls from './SpotifyWidgetPro/SpotifyControls';
import SpotifyTrackInfo from './SpotifyWidgetPro/SpotifyTrackInfo';
import SpotifyVolume from './SpotifyWidgetPro/SpotifyVolume';

export default function SpotifyWidgetLarge({ thePlayer }: any) {
  const classes = useStyle();
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const { position, paused } = spotifyData;
  const title = spotifyData.track_window?.current_track?.name || 'Not playing';
  const image =
    spotifyData.track_window?.current_track?.album.images[0].url ||
    'https://github.com/LedFx/LedFx/raw/master/icons/discord.png';
  const artist = spotifyData.track_window?.current_track?.artists || [
    { name: 'on LedFx' },
  ];
  const album = spotifyData.track_window?.current_track?.album.name || '';
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
          <SpotifyTrackInfo />
          <SpotifyControls thePlayer={thePlayer} hijack={album === ''} />

          <Stack className={classes.spotifyDesktopVolStyles}>
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
                            <InputAdornment position="end">min</InputAdornment>
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
            <SpotifyVolume thePlayer={thePlayer} />
          </Stack>
        </Box>
      </div>
    </Box>
  );
}
