import React from 'react';
import {
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  select: {
    color: '#ffffff',
    width: '90%',
    '&:before': {
      borderColor: '#ffffff',
    },
    '&:after': {
      borderColor: '#ffffff',
    },
  },
  icon: {
    fill: '#ffffff',
  },
}));

const chords: { [key: string]: any } = {
  'Major Chords': {
    All: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'C Major': [0, 4, 7],
    'C Sharp Major': [1, 5, 8],
    'D Major': [2, 6, 9],
    'E Flat Major': [3, 7, 10],
    'E Major': [4, 8, 11],
    'F Major': [5, 9, 0],
    'F Sharp Major': [6, 10, 1],
    'G Major': [7, 11, 2],
    'A Flat Major': [8, 0, 3],
    'A Major': [9, 1, 4],
    'B Flat Major': [10, 2, 5],
    'B Major': [11, 3, 6],
  },
  'Minor Chords': {
    All: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'C Minor': [0, 3, 7],
    'C Sharp Minor': [1, 4, 8],
    'D Minor': [2, 5, 9],
    'E Flat Minor': [3, 6, 10],
    'E Minor': [4, 7, 11],
    'F Minor': [5, 8, 0],
    'F Sharp Minor': [6, 9, 1],
    'G Minor': [7, 10, 2],
    'A Flat Minor': [8, 11, 3],
    'A Minor': [9, 0, 4],
    'B Flat Minor': [10, 1, 5],
    'B Minor': [11, 2, 6],
  },
  'Diminished Chords': {
    All: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'C Diminished': [0, 3, 6],
    'C Sharp Diminished': [1, 4, 7],
    'D Diminished': [2, 5, 8],
    'E Flat Diminished': [3, 6, 9],
    'E Diminished': [4, 7, 10],
    'F Diminished': [5, 8, 11],
    'F Sharp Diminished': [6, 9, 0],
    'G Diminished': [7, 10, 1],
    'A Flat Diminished': [8, 11, 2],
    'A Diminished': [9, 0, 3],
    'B Flat Diminished': [10, 1, 4],
    'B Diminished': [11, 2, 5],
  },
  'Augmented Chords': {
    All: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'C Augmented': [0, 4, 8],
    'C Sharp Augmented': [1, 5, 9],
    'D Augmented': [2, 6, 10],
    'E Flat Augmented': [3, 7, 11],
    'E Augmented': [4, 8, 0],
    'F Augmented': [5, 9, 1],
    'F Sharp Augmented': [6, 10, 2],
    'G Augmented': [7, 11, 3],
    'A Flat Augmented': [8, 0, 4],
    'A Augmented': [9, 1, 5],
    'B Flat Augmented': [10, 2, 6],
    'B Augmented': [11, 3, 7],
  },
};

export default function PitchSelect({ handleChordClick }: any) {
  return (
    <Grid container spacing={1}>
      {Object.keys(chords).map((group) => (
        <Grid item xs={6} sm={3}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id={group}>
              <Typography>{group}</Typography>
            </InputLabel>
            <Select
              defaultValue="0,1,2,3,4,5,6,7,8,9,10,11"
              onChange={handleChordClick}
              labelId={group}
              className={useStyles}
              // inputProps={{ classes: { icon: useStyles.icon } }}
            >
              {Object.keys(chords[group]).map((chord) => {
                return (
                  <MenuItem value={chords[group][chord]}>{chord}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </Grid>
  );
}
