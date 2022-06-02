import { useState } from 'react';
import Box from '@mui/material/Box';
import { AddPhotoAlternate } from '@material-ui/icons';
import { MenuItem, Select, Checkbox, InputAdornment } from '@material-ui/core';
import { OutlinedInput } from '@mui/material';
import useStore from '../../../../../utils/apiStore';

import { formatTime } from '../../../../../utils/helpers';
import Popover from '../../../../Popover/Popover';

export default function SpSceneTrigger() {
  const scenes = useStore((state) => (state as any).scenes);
  const [spotifyScene, setSpotifyScene] = useState(0);
  const [includeTime, setIncludeTime] = useState(false);
  const spotifyPos = useStore((state) => (state as any).spotifyPos);

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
        console.log(spotifyScene, includeTime, spotifyPos)
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
                  value={formatTime(spotifyPos).split(':')[0]}
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
                  value={formatTime(spotifyPos).split(':')[1]}
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
  );
}
