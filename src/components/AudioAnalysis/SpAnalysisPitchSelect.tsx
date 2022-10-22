import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    color: '#1ED760',
    '&$checked': {
      color: '#1ED760',
    },
  },
}));

export default function PitchSelect(props: any) {
  const pitchClasses = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const classes = useStyles();
  const { pitches, handleCheck } = props;
  return (
    <FormGroup row>
      {pitchClasses.map((p, idx) => {
        return (
          <FormControlLabel
            key={idx}
            control={
              <Checkbox
                color="primary"
                className={classes.root}
                checked={pitches[p]}
                onClick={handleCheck}
                name={p}
              />
            }
            label={p}
            style={{ color: '#1ED760' }}
          />
        );
      })}
    </FormGroup>
  );
}
