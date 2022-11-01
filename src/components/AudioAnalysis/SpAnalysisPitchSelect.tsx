import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import pitchClasses from './constants';

export default function PitchSelect(props: any) {
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
