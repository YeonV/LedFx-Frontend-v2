import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import { Slider, Switch } from '@material-ui/core';

const marks = [
  { value: 1, label: '1' },
  { value: 255, label: '255' },
];
interface DropDownProps {
  // key: any;
  idx: number;
  QLCWidgets: Array<[]>;
  // id: any;
  value: any;
  switchValue: any;
  showSwitch: any;
  showSlider: boolean;
  handleDropTypeChange: any;
  handleTypeRemoveDropDown: any;
}

const ThisDropDown: React.FC<DropDownProps> = (props) => {
  const {
    // key,
    idx,
    QLCWidgets,
    // id,
    value,
    switchValue,
    showSwitch,
    showSlider,
    handleDropTypeChange,
    handleTypeRemoveDropDown,
  } = props;
  return (
    <>
      <FormControl>
        <InputLabel htmlFor="grouped-select">Then Do This</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          name="qlc_payload"
          // value={value}
          onChange={(event) => handleDropTypeChange(event, idx)}
        >
          {QLCWidgets &&
            QLCWidgets.length > 0 &&
            QLCWidgets.map((e: any, f: any) => (
              <MenuItem key={f} value={e}>
                ID: {e[0]}, Type: {e[1]}, Name: {e[2]}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>Some important helper text</FormHelperText>
      </FormControl>
      <button
        type="button"
        // variant="contained"
        color="primary"
        onClick={() => handleTypeRemoveDropDown(idx)}
      >
        <DeleteIcon />
      </button>
      <div style={{ minWidth: '150px' }} />
      {showSwitch && <label>QLC+ widget selected above (On/Off) </label>}
      {showSwitch && (
        <Switch
          color="primary"
          name={value}
          checked={switchValue}
          onChange={(event) => handleDropTypeChange(event, idx)}
        />
      )}
      <div style={{ minWidth: '150px' }}>
        {showSlider && <label>QLC Slider Widget Value</label>}
        {showSlider && (
          <Slider
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            marks={marks}
            step={1}
            min={0}
            max={255}
            defaultValue={1}
            onChange={(event, val) =>
              handleDropTypeChange(event, idx, val, val)
            }
          />
        )}
      </div>
    </>
  );
};
export default ThisDropDown;
