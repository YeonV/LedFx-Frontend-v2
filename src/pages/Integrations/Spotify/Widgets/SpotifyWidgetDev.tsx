/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Repeat,
  Shuffle,
  Devices,
  QueueMusic,
  VolumeUp,
  RepeatOne,
  VolumeDown,
  VolumeMute,
} from '@material-ui/icons';
import Slider from '@mui/material/Slider';
import useStore from '../../../../utils/apiStore';
import { spotifyRepeat, spotifyShuffle } from '../proxies';

const SpotifyWidgetDev = ({ thePlayer }: any) => {
  const spotifyDevice = useStore((state) => (state as any).spotifyDevice);
  const spotifyVol = useStore((state) => (state as any).spotifyVol);
  const setSpotifyVol = useStore((state) => (state as any).setSpotifyVol);
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const [volu, setVolu] = useState(spotifyVol || 0);
  const { position, duration, paused, repeat_mode, shuffle } = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const getTime = (dur: number) => {
    let seconds: string | number;
    let minutes: string | number;
    seconds = Math.floor((dur / 1000) % 60);
    minutes = Math.floor((dur / (1000 * 60)) % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
  };

  const setVol = (vol: number) =>
    thePlayer.current
      .setVolume(vol)
      .then(() =>
        thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v))
      );

  useEffect(() => {
    if (thePlayer.current) {
      thePlayer.current.getVolume().then((v: any) => setSpotifyVol(v));
    }
  }, []);

  useEffect(() => {
    setVolu(spotifyVol);
  }, [spotifyVol]);

  return spotifyData && duration && position ? (
    <div style={{ margin: '0 auto' }}>
      <img
        src={spotifyData.track_window.current_track.album.images[0].url}
        className="now-playing__cover"
        alt=""
      />
      <div className="now-playing__side">
        <div className="now-playing__name">
          {spotifyData.track_window.current_track.name}
        </div>

        <div className="now-playing__artist">
          {spotifyData.track_window.current_track.artists[0].name}
        </div>
      </div>
      <div>
        {getTime(position)} / {getTime(duration)}
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          variant="outlined"
          onClick={() => spotifyShuffle(spotifyDevice, !shuffle)}
        >
          {shuffle ? <Shuffle color="primary" /> : <Shuffle />}
        </Button>
        <Button
          variant="outlined"
          onClick={() => thePlayer.current.previousTrack()}
        >
          <SkipPrevious />
        </Button>
        <Button
          variant="outlined"
          onClick={() => thePlayer.current.togglePlay()}
        >
          {paused ? <PlayArrow /> : <Pause />}
        </Button>
        <Button
          variant="outlined"
          onClick={() => thePlayer.current.nextTrack()}
        >
          <SkipNext />
        </Button>
        <Button
          variant="outlined"
          onClick={() => spotifyRepeat(spotifyDevice, repeat_mode)}
        >
          {repeat_mode === 0 ? (
            <Repeat />
          ) : repeat_mode === 1 ? (
            <Repeat color="primary" />
          ) : (
            <RepeatOne color="primary" />
          )}
        </Button>
        <Button variant="outlined">
          <QueueMusic />
        </Button>
        <Button variant="outlined">
          <Devices />
        </Button>
        <Button
          variant="outlined"
          onClick={() => setVol(spotifyVol === 0 ? 1 : 0)}
        >
          {spotifyVol === 0 ? (
            <VolumeMute />
          ) : spotifyVol < 0.5 ? (
            <VolumeDown />
          ) : (
            <VolumeUp />
          )}
        </Button>
        <div
          style={{
            width: '130px',
            display: 'inline-flex',
            padding: '0 20px',
          }}
        >
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <Slider
              aria-label="Volume"
              min={0}
              max={100}
              value={volu * 100}
              onChange={(_, v) => setVolu((v as number) / 100)}
              onChangeCommitted={(e, v: any) => setVol(v / 100)}
              sx={{
                color: '#fff',
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  backgroundColor: '#fff',
                  '&:before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>Loading</>
  );
};

export default SpotifyWidgetDev;
