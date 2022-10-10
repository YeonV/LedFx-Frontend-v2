/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import {
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
import { Button } from '@material-ui/core';
import { useEffect, useState, useContext } from 'react';

import useStore from '../../../../../store/useStore';
import useStyle, { TinyText, PosSliderStyles } from './SpWidgetPro.styles';
import { formatTime } from '../../../../../utils/helpers';
import {
  spotifyRepeat,
  spotifyShuffle,
  spotifyPlay,
} from '../../../../../utils/spotifyProxies';
import SpSceneTrigger from './SpSceneTrigger';
import {
  ControlSpotifyContext,
  SpotifyStateContext,
  SpotifyVolumeContext,
} from '../../SpotifyProvider';

export default function SpControls({ className }: any) {
  const classes = useStyle();
  const [marks, setMarks] = useState<any>([]);
  // const player = useStore((state) => state.spotify.player);

  const spotifyDevice = useStore((state) => state.spotify.spotifyDevice);
  // const spActTriggers = useStore((state) => state.spotify.spActTriggers);
  const spTriggersList = useStore((state) => state.spotify.spTriggersList);
  // const spotifyVol = useStore((state) => state.spotify.spotifyVol);
  // const setSpotifyVol = useStore((state) => state.setSpVol);
  // const setSpotifyPos = useStore((state) => state.setSpPos);
  // const getVolume = useStore((state) => state.getVolume);
  // const spotifyState = useStore((state) => state.spotify.spotifyState);

  // const marks = spActTriggers.map((m: any) => ({
  //   value: m.position_ms,
  //   label: m.sceneName,
  // }));

  const ctrlSpotify = useContext(ControlSpotifyContext);
  const spotifyVolume = useContext(SpotifyVolumeContext);
  const spotifyCtx = useContext(SpotifyStateContext);
  const hijack = spotifyCtx?.track_window?.current_track?.album.name || '';
  const [position, setPosition] = useState(-1);

  const duration = spotifyCtx?.duration || 0;
  const paused = spotifyCtx?.paused || false;
  const repeat_mode = spotifyCtx?.repeat_mode || 0;
  const shuffle = spotifyCtx?.shuffle || false;

  useEffect(() => {
    const hlp = spTriggersList
      .filter(
        (l: any) =>
          l.songId ===
          spotifyCtx?.context?.metadata?.current_item?.uri.split(':')[2]
      )
      .map((m: any) => ({
        value: m.position_ms,
        label: m.sceneName,
      }));
    // eslint-disable-next-line no-console
    // console.log(hlp);
    setMarks(hlp);
  }, [spotifyCtx?.context?.uri]);
  return (
    <Box
      className={`${classes.SpControlstyles} ${className}`}
      sx={{ width: '45%', margin: '0 auto' }}
    >
      {hijack === '' ? (
        <div>
          <Button onClick={() => spotifyPlay(spotifyDevice)}>HiJack</Button>
        </div>
      ) : (
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
                onClick={() => ctrlSpotify.setVol(spotifyVolume === 0 ? 1 : 0)}
              >
                {spotifyVolume === 0 ? (
                  <VolumeMute
                    style={{ fontSize: '1.5rem' }}
                    htmlColor="rgba(255,255,255,0.7)"
                  />
                ) : spotifyVolume < 0.5 ? (
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
              onClick={() => ctrlSpotify.prev()}
            >
              <SkipPrevious fontSize="large" htmlColor="#bbb" />
            </IconButton>
            <IconButton
              aria-label={paused ? 'play' : 'pause'}
              onClick={() => ctrlSpotify.togglePlay()}
            >
              {paused ? (
                <PlayCircle sx={{ fontSize: '3rem' }} htmlColor="#fff" />
              ) : (
                <PauseCircle sx={{ fontSize: '3rem' }} htmlColor="#fff" />
              )}
            </IconButton>
            <IconButton
              aria-label="next song"
              onClick={() => ctrlSpotify.next()}
            >
              <SkipNext fontSize="large" htmlColor="#bbb" />
            </IconButton>
            <IconButton
              aria-label="repeat"
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
              <SpSceneTrigger />
            </div>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TinyText>{formatTime(spotifyCtx?.position ?? 0)}</TinyText>
            <Slider
              aria-label="time-indicator"
              size="small"
              marks={marks}
              value={position >= 0 ? position : spotifyCtx?.position ?? 0}
              min={0}
              step={1}
              max={spotifyCtx?.duration}
              onChange={(_, value) => {
                setPosition(value as number);
              }}
              onChangeCommitted={(_, value) => {
                setTimeout(() => setPosition(-1), 1000);
                ctrlSpotify.setPos(value as number);
              }}
              sx={{ ...PosSliderStyles, margin: '0 10px' }}
            />
            <TinyText>{formatTime(duration)}</TinyText>
          </Box>
        </>
      )}
    </Box>
  );
}
