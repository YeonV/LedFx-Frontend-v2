// import React from 'react';
import {
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Slider,
  Switch,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const marks = [
  { value: 1, label: '1' },
  { value: 255, label: '255' },
];

export default function ThisDropDown({
  value,
  onChange,
  options,
  error,
  helperText,
  disabled,
  ...props
}: any) {
  return (
    <>
    <FormControl error={error} disabled={disabled}>
          <InputLabel htmlFor="grouped-select">Then Do This</InputLabel>
          <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="qlc_payload"
              value={value}
              onChange={onChange}
              {...props}
          >
              {options.map((option: any, index: number) => (
                  <MenuItem key={index} value={option.value}>
                      {option.label}
                  </MenuItem>
              ))}
          </Select>
          <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
      <button 
      color="primary" 
      onClick={() => props.handleTypeRemoveDropDown(props.idx)}>
        <DeleteIcon />
        </button>
        <div style={{ minWidth: '150px' }}></div></>);
        {props.showSwitch && <label>QLC+ widget selected above (On/Off) </label>}
            {props.showSwitch &&
            <Switch
                color="primary"
                name={props.value}
                checked={props.switchValue}
                onChange={(event)=>props.handleDropTypeChange(event,props.idx)}
            />
            }
            <div style={{ minWidth: '150px' }}>
                {props.showSlider &&<label>QLC Slider Widget Value</label>}
                {props.showSlider &&<Slider
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    marks={marks}
                    step={1}
                    min={0}
                    max={255}
                    defaultValue={1}
                    onChange={(event,value)=>props.handleDropTypeChange(event,props.idx,value,props.value)}
                    />}
                </div>
            </>
    );
}
