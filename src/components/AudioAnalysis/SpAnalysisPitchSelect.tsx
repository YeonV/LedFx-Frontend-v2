import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel } from '@material-ui/core';

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
  const { pitches, handleCheck } = props;
  return (
    <FormGroup row>
      {pitchClasses.map((p, idx) => {
        return (
          <FormControlLabel
            key={idx}
            control={
              <Checkbox checked={pitches[p]} onClick={handleCheck} name={p} />
            }
            label={p}
          />
        );
      })}
    </FormGroup>
  );
}
