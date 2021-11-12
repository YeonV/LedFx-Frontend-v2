import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Slider, Input, TextField, Typography } from '@material-ui/core/';
import useStyles from './BladeSlider.styles';
import BladeFrame from './BladeFrame';

const BladeSlider = ({
  variant = 'outlined',
  disableUnderline,
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
      <div className={`${classes.wrapper} step-effect-${index}`} style={style}>
      <label style={{ color: disabled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.7)' }} className={'MuiFormLabel-root'}>{schema.title}{required ? '*' : ''}</label>
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
        disableUnderline={disableUnderline}
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
      marks={marks}
      hideDesc={hideDesc}
      disableUnderline={disableUnderline}
    />
  );
};

const BladeSliderInner = ({
  schema, model, model_id, step, onChange, textfield, style, disabled, marks,hideDesc, disableUnderline
}) => {
  
  const classes = useStyles();
  const [value, setValue] = useState(typeof model[model_id] === 'number' ? model[model_id] : typeof schema.default === 'number' ? schema.default : 1);
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
  const handleTextChange = (event) => {
    if (value < schema.minimum) {
      setValue(schema.minimum);
    } else if (value > schema.maximum) {
      setValue(schema.maximum);
    }
    onChange(model_id, Number(event.target.value))
  };

  useEffect(() => {
    setValue(typeof model[model_id] === 'number' ? model[model_id] : typeof schema.default === 'number' ? schema.default : 1)
    
  }, [model, model_id])

  return (schema.maximum && !textfield) ? (
    <>
      <div style={{width: '100%' }}>
        <Slider
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          disabled={disabled}
          step={step || (schema.maximum > 1 ? 0.1 : 0.01)}
          min={schema.minimum || 0}
          max={schema.maximum}
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          onChangeCommitted={(e, b) => onChange(model_id, b)}
          style={{color: '#aaa', ...style}}
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
          step: step || (schema.maximum > 1 ? 0.1 : 0.01),
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
          style={!hideDesc ? {...style, width: '100%'} : style}
        />
  ) : (

    <TextField
      disabled={disabled}
      InputProps={{
        disableUnderline:disableUnderline
      }}      
      type="number"
      value={value}
      onChange={handleTextChange}
      helperText={!hideDesc && schema.description}
      style={!hideDesc ? {...style, width: '100%'} : style}
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
