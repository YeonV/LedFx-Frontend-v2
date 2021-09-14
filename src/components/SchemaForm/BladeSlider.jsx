import PropTypes from 'prop-types';
import { useState } from 'react';
import { Slider, Input, TextField, Typography } from '@material-ui/core/';
import useStyles from './BladeSlider.styles';

const BladeSlider = ({
  variant = 'outlined',
  schema,
  model,
  model_id,
  step,
  onChange,
  marks,
  index,
  required = false,
  textfield = false,
  disabled = false,
  hideDesc = false,
  style = {},
}) => {
  const classes = useStyles();
  // console.log(schema)
  return variant === 'outlined' ? (
    <div className={`${classes.wrapper} step-effect-${index}`} style={{ ...style, ...{ order: required ? -1 : 3 } }}>
      <label className={'MuiFormLabel-root'}>{schema.title}{required ? '*' : ''}</label>
      <BladeSliderInner
        schema={schema}
        model={model}
        model_id={model_id}
        disabled={disabled}
        step={step}
        onChange={onChange}
        textfield={textfield}
        marks={marks}
        hideDesc={hideDesc}
      />
    </div>
  ) : (
    <BladeSliderInner
      schema={schema}
      model={model}
      model_id={model_id}
      onChange={onChange}
      disabled={disabled}
      textfield={textfield}
      style={{ order: required ? -1 : 3 }}
      marks={marks}
      hideDesc={hideDesc}
    />
  );
};

const BladeSliderInner = ({
  schema, model, model_id, step, onChange, textfield, style, disabled, marks,hideDesc
}) => {
  // console.log(model, schema, model_id);
  const classes = useStyles();
  const [value, setValue] = useState(model[model_id] || schema.default || 1);

  const handleSliderChange = (event, newValue) => {
    if (newValue !== value) {
      setValue(newValue);
    }
  };

  const handleInputChange = (event) => {
    if (value !== event.target.value) {
      setValue(event.target.value === '' ? '' : Number(event.target.value));
      if (event.target.value < schema.minimum) {
        setValue(schema.minimum);
      } else if (event.target.value > schema.maximum) {
        setValue(schema.maximum);
      }
      onChange(model_id, Number(event.target.value))
    }
  };
  const handleBlur = () => {
    if (value < schema.minimum) {
      setValue(schema.minimum);
    } else if (value > schema.maximum) {
      setValue(schema.maximum);
    }
  };  
  const handleTextBlur = () => {
    if (value < schema.minimum) {
      setValue(schema.minimum);
    } else if (value > schema.maximum) {
      setValue(schema.maximum);
    }
    onChange(model_id, Number(event.target.value))
  };

  return (schema.maximum && !textfield) ? (
    <>
      <div style={{width: '100%'}}>
        <Slider
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          disabled={disabled}
          marks
          step={step || (schema.maximum > 1 ? 0.1 : 0.01)}
          min={schema.minimum || 0}
          max={schema.maximum}
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          onChangeCommitted={(e, b) => onChange(model_id, b)}
          style={style}
        // defaultValue={model[model_id] || schema.default}
        // value={model && model[model_id]}
        />
        {(!hideDesc && schema.description)
          ? <>
            <Typography variant={'body2'} className={'MuiFormHelperText-root'} >{schema.description} </Typography>
          </>
          : <></>
        }
      </div>
      <Input
        disableUnderline
        disabled={disabled}
        className={classes.input}
        value={value}
        margin="dense"
        onChange={handleInputChange}
        onBlur={handleBlur}
        inputProps={{
          step: schema.maximum > 1 ? 0.1 : 0.01,
          min: schema.minimum || 0,
          max: schema.maximum,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
      />
    </>
  ) :  (schema.enum && !textfield) ? (
    <Slider
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          disabled={disabled}
          marks={marks.map((m,i)=>({value: m, label: (i === 0 || i === marks.length - 1) ? m : ''}))}
          step={null}
          min={marks[0]}
          max={marks[marks.length - 1]}
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          onChangeCommitted={(e, b) => onChange(model_id, b)}
          style={style}
        // defaultValue={model[model_id] || schema.default}
        // value={model && model[model_id]}
        />
  ) : (

    <TextField
      // defaultValue={schema.default || 1}
      disabled={disabled}
      type="number"
      defaultValue={value}
      onChange={(e)=> handleInputChange(e)}
      onBlur={handleTextBlur}
      // onBlur={(e, b) => onChange(model_id, parseInt(e.target.value))}
      helperText={!hideDesc && schema.description}
      style={style}
    />
  );
};

BladeSlider.propTypes = {
  variant: PropTypes.string,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  model_id: PropTypes.string.isRequired,
};

export default BladeSlider;
