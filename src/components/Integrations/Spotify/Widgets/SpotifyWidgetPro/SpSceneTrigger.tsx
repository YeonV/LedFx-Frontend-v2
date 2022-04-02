import { useState } from 'react';
import Box from '@mui/material/Box';
import { AddPhotoAlternate } from '@material-ui/icons';
import { MenuItem, Select, InputAdornment } from '@material-ui/core';
import { OutlinedInput } from '@mui/material';
import useStore from '../../../../../utils/apiStore';

import { formatTime } from '../../../../../utils/utils';
import Popover from '../../../../Popover/Popover';

export default function SpSceneTrigger() {
  const scenes = useStore((state) => (state as any).scenes);
  const [spotifyScene, setSpotifyScene] = useState('');
  const spotifyPos = useStore((state) => (state as any).spotifyPos);
  const spotifyData = useStore(
    (state) => (state as any).spotifyData.playerState
  );
  const addSpotifyTrigger = useStore(
    (state) => (state as any).spotifyTriggerData
  );
  const songID = spotifyData?.track_window?.current_track?.id || '';
  const songTitleAndArtist = `${spotifyData?.track_window?.current_track?.name} - ${spotifyData?.track_window?.current_track?.artists[0]?.name}`;
  const spotifyTriggerData = {
    scene_id: spotifyScene,
    song_id: songID,
    song_name: songTitleAndArtist,
    song_position: spotifyPos,
  };

  return (
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
        // console.log(spotifyTriggerData)
        addSpotifyTrigger(spotifyTriggerData)
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
            <OutlinedInput
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
              style={{
                width: 95,
                color: '#fff',
                borderColor: '#fff',
              }}
              endAdornment={<InputAdornment position="end">s</InputAdornment>}
              value={formatTime(spotifyPos).split(':')[1]}
              type="number"
            />
          </Box>
        </div>
      }
    />
  );
}
