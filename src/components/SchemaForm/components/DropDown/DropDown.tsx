import { useState } from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useStyles from './DropDown.styles';
import {
  EffectDropDownDefaultProps,
  EffectDropDownProps,
} from './DropDown.props';

const EffectDropDown = ({
  value,
  onChange,
  groups,
  showFilter,
  title,
}: EffectDropDownProps) => {
  const classes = useStyles();

  const [formats, setFormats] = useState(
    () => groups && Object.keys(groups).map((c) => c || [])
  );

  const handleFormat = (_: any, newFormats: any) => {
    setFormats(newFormats);
  };

  return (
    <FormControl className={`${classes.FormRow} step-device-one`}>
      <InputLabel htmlFor="groupsed-select" className={classes.FormLabel}>
        {title}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        id="groupsed-select"
        className={classes.FormSelect}
      >
        <MenuItem value="" disabled>
          <em>None</em>
        </MenuItem>
        {groups &&
          Object.keys(groups).map(
            (c) =>
              formats &&
              formats.indexOf(c) !== -1 && [
                <ListSubheader
                  className={classes.FormListHeaders}
                  color="primary"
                >
                  {c}
                </ListSubheader>,
                groups[c].map((e: any) => (
                  <MenuItem className={classes.FormListItem} value={e.id}>
                    {e.name}
                  </MenuItem>
                )),
              ]
          )}
      </Select>
      {showFilter && (
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
          className={classes.FormToggleWrapper}
        >
          {groups &&
            Object.keys(groups).map((c, i) => (
              <ToggleButton
                className={classes.FormToggle}
                key={i}
                value={c}
                aria-label={c}
              >
                {c}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      )}
    </FormControl>
  );
};
EffectDropDown.defaultProps = EffectDropDownDefaultProps;

export default EffectDropDown;
