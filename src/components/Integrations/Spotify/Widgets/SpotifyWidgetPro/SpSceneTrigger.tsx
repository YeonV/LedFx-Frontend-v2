import { useState } from 'react';
import Box from '@mui/material/Box';
import { MenuItem, Select, InputAdornment } from '@material-ui/core';
import { OutlinedInput } from '@mui/material';
import useStore from '../../../../../store/useStore';

// import { formatTime } from '../../../../../utils/helpers';
import Popover from '../../../../Popover/Popover';
import BladeIcon from '../../../../Icons/BladeIcon/BladeIcon';

export default function SpSceneTrigger() {
  const scenes = useStore((state) => state.scenes);
  const [spotifyScene, setSpotifyScene] = useState(0);
  const spotifyPos = useStore((state) => state.spotify.spotifyPos);
  const player = useStore((state) => state.spotify.player);
  const spNetworkTime = useStore((state) => state.spotify.spNetworkTime);
  const setSpNetworkTime = useStore((state) => state.setSpNetworkTime);

  const playerState = useStore(
    (state) => state.spotify.spotifyData.playerState
  );
  const addSpotifySongTrigger = useStore((state) => state.addSpSongTrigger);
  const getIntegrations = useStore((state) => state.getIntegrations);
  const songID = playerState?.track_window?.current_track?.id || '';
  const songTitleAndArtist = `${playerState?.track_window?.current_track?.name} - ${playerState?.track_window?.current_track?.artists[0]?.name}`;
  const spotifyTriggerData = {
    scene_id: spotifyScene, // Incorrectly sending scene_name instead of scene_id
    song_id: songID,
    song_name: songTitleAndArtist,
    song_position: spotifyPos,
  };

  const onConfirmHandler = (spotifyTriggerDataTemp: any) => {
    // console.log(spotifyTriggerDataTemp);
    player.getCurrentState().then((state: any) => {
      if (!state) {
        // eslint-disable-next-line no-console
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }
      const data = {
        ...spotifyTriggerDataTemp,
        ...{ song_position: state.position },
      };
      addSpotifySongTrigger(data).then(() => getIntegrations());
    });
  };

  return (
    <Popover
      variant="text"
      size="large"
      confirmDisabled={spotifyScene === 0}
      icon={<BladeIcon name="mdi:timer-music-outline" />}
      onConfirm={() => onConfirmHandler(spotifyTriggerData)}
      content={
        <div>
          <Box sx={{ minWidth: 220, margin: 0 }}>
            <Select
              labelId="scenelabel"
              id="scene"
              value={spotifyScene}
              label="Scene"
              variant="outlined"
              onChange={(_, v: any) => {
                setSpotifyScene(v.props.value);
              }}
            >
              <MenuItem value={0}>select a scene</MenuItem>
              {scenes &&
                Object.keys(scenes).length &&
                Object.keys(scenes).map((s: any, i: number) => (
                  <MenuItem key={i} value={scenes[s].id || s}>
                    {scenes[s].name || s}
                  </MenuItem>
                ))}
            </Select>
            <OutlinedInput
              style={{
                width: 115,
                color: '#fff',
                border: 0,
              }}
              endAdornment={<InputAdornment position="end">ms</InputAdornment>}
              type="number"
              value={spNetworkTime}
              onChange={(e: any) => setSpNetworkTime(e.target.value)}
            />
            {/* <OutlinedInput
              disabled
              style={{
                width: 115,
                color: '#fff',
                border: 0,
              }}
              endAdornment={<InputAdornment position="end">min</InputAdornment>}
              type="number"
              value={formatTime(spotifyPos).split(':')[0]}
            />
            <OutlinedInput
              disabled
              style={{
                width: 95,
                color: '#fff',
                borderColor: '#fff',
              }}
              endAdornment={<InputAdornment position="end">s</InputAdornment>}
              value={formatTime(spotifyPos).split(':')[1]}
              type="number"
            /> */}
          </Box>
        </div>
      }
    />
  );
}
