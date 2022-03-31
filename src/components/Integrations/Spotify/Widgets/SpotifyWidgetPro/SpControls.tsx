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
import useStore from '../../../../../utils/apiStore';
import useStyle, { TinyText, PosSliderStyles } from './SpWidgetPro.styles';

import { formatTime } from '../../../../../utils/utils';
import {
  spotifyRepeat,
  spotifyShuffle,
  spotifyPlay,
} from '../../../../../utils/spotifyProxies';
import SpSceneTrigger from './SpSceneTrigger';

export default function SpControls({ className }: any) {
  const classes = useStyle();

  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const { duration, paused, repeat_mode, shuffle } = spotifyData;
  const hijack = spotifyData.track_window?.current_track?.album.name || '';

  const spotifyDevice = useStore((state) => (state as any).spotifyDevice);
  const spotifyVol = useStore((state) => (state as any).spotifyVol);
  const setSpotifyVol = useStore((state) => (state as any).setSpotifyVol);
  const spotifyPos = useStore((state) => (state as any).spotifyPos);
  const setSpotifyPos = useStore((state) => (state as any).setSpotifyPos);
  const thePlayer = useStore((state) => (state as any).thePlayer);

  const setVol = (vol: number) =>
    thePlayer.current
      .setVolume(vol)
      .then(() =>
        thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v))
      );

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
            <TinyText>{formatTime(spotifyPos)}</TinyText>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={spotifyPos || 0}
              min={0}
              step={1}
              max={duration}
              onChange={(_, value) => setSpotifyPos(value as number)}
              onChangeCommitted={(_, value) =>
                thePlayer.current.seek(value as number)
              }
              sx={{ ...PosSliderStyles, margin: '0 10px' }}
            />
            <TinyText>{formatTime(duration)}</TinyText>
          </Box>
        </>
      )}
    </Box>
  );
}
