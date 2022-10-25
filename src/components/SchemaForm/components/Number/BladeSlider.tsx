import { useState, useEffect } from 'react';
import { Slider, Input, TextField, Typography } from '@mui/material';
import useStyles from './BladeSlider.styles';
import {
  BladeSliderDefaultProps,
  BladeSliderInnerDefaultProps,
  BladeSliderInnerProps,
  BladeSliderProps,
} from './BladeSlider.props';

const BladeSliderInner = ({
  schema,
  model,
  model_id,
  step,
  onChange,
  textfield,
  style,
  disabled,
  marks,
  hideDesc,
  disableUnderline,
}: BladeSliderInnerProps) => {
  const classes = useStyles();
  // eslint-disable-next-line
  const [value, setValue] = useState((model_id && typeof model[model_id]) === 'number' ? model_id && model[model_id] : typeof schema.default === 'number' ? schema.default : 1 );
  const handleSliderChange = (_event: any, newValue: any) => {
    if (newValue !== value) {
      setValue(newValue);
    }
  };

  const handleInputChange = (event: any) => {
    if (value !== event.target.value) {
      setValue(event.target.value === '' ? '' : Number(event.target.value));
      if (event.target.value < schema.minimum) {
        setValue(schema.minimum);
      } else if (event.target.value > schema.maximum) {
        setValue(schema.maximum);
      }
      onChange(model_id, Number(event.target.value));
    }
  };
  const handleBlur = () => {
    if (value < schema.minimum) {
      setValue(schema.minimum);
    } else if (value > schema.maximum) {
      setValue(schema.maximum);
    }
  };
  const handleTextChange = (event: any) => {
    if (value < schema.minimum) {
      setValue(schema.minimum);
    } else if (value > schema.maximum) {
      setValue(schema.maximum);
    }
    onChange(model_id, Number(event.target.value));
  };

  useEffect(() => {
    // eslint-disable-next-line
    setValue(model_id && typeof model[model_id] === 'number' ? model[model_id] : typeof schema.default === 'number' ? schema.default : 1);
  }, [model, model_id]);

  return schema.maximum && !textfield ? (
    <>
      <div style={{ width: '100%' }}>
        <Slider
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          disabled={disabled}
          step={step || (schema.maximum > 1 ? 0.1 : 0.01)}
          valueLabelFormat={
            model_id === 'delay_ms'
              ? `${typeof value === 'number' ? value : 0}\xa0ms`
              : `${typeof value === 'number' ? value : 0}`
          }
          min={schema.minimum || 0}
          max={schema.maximum}
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          onChangeCommitted={(e, b) => onChange(model_id, b)}
          style={{ color: '#aaa', ...style, width: '100%' }}
        />
        {!hideDesc && schema.description ? (
          <Typography variant="body2" className="MuiFormHelperText-root">
            {schema.description}{' '}
          </Typography>
        ) : null}
      </div>
      <Input
        disableUnderline
        disabled={disabled}
        className={classes.input}
        style={
          model_id === 'delay_ms'
            ? { minWidth: 90, textAlign: 'right', paddingTop: 0 }
            : {}
        }
        value={value}
        margin="dense"
        onChange={handleInputChange}
        onBlur={handleBlur}
        endAdornment={model_id === 'delay_ms' ? 'ms\xa0' : null}
        inputProps={{
          step: step || (schema.maximum > 1 ? 0.1 : 0.01),
          min: schema.minimum || 0,
          max: schema.maximum,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
      />
    </>
  ) : schema.enum && !textfield ? (
    <Slider
      aria-labelledby="input-slider"
      valueLabelDisplay="auto"
      disabled={disabled}
      marks={marks.map((m: any, i: number) => ({
        value: m,
        label: i === 0 || i === marks.length - 1 ? m : '',
      }))}
      step={null}
      min={marks[0]}
      max={marks[marks.length - 1]}
      value={typeof value === 'number' ? value : 0}
      onChange={handleSliderChange}
      onChangeCommitted={(e, b) => onChange(model_id, b)}
      style={{ ...style, width: '100%' }}
    />
  ) : (
    <TextField
      disabled={disabled}
      InputProps={{
        disableUnderline,
        endAdornment: model_id === 'delay_ms' ? 'ms' : null,
      }}
      type="number"
      value={value}
      onChange={handleTextChange}
      helperText={!hideDesc && schema.description}
      style={{ ...style, width: '100%' }}
    />
  );
};

BladeSliderInner.defaultProps = BladeSliderInnerDefaultProps;

/**
 * ## Number
 * ### render as `input fields` or `sliders`
 * Renders slider if:
 *
 *  - schema.maximum && !textfield
 *  - schema.enum && !textfield
 */
const BladeSlider = ({
  variant = 'outlined',
  disableUnderline,
  schema,
  model,
  model_id,
  step,
  onChange,
  marks = undefined,
  index = undefined,
  required = false,
  textfield = false,
  disabled = false,
  hideDesc = false,
  full = false,
  style = {},
}: BladeSliderProps) => {
  const classes = useStyles();
  return variant === 'outlined' ? (
    <div
      className={`${classes.wrapper} step-effect-${index}`}
      style={{
        ...style,
        width: full ? '100%' : style.width,
      }}
    >
      <label
        style={{
          color: disabled
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(255, 255, 255, 0.7)',
        }}
        className="MuiFormLabel-root"
      >
        {schema.title}
        {required ? '*' : ''}
      </label>
      <BladeSliderInner
        style={style}
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
      style={style}
      step={step}
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

BladeSlider.defaultProps = BladeSliderDefaultProps;

export default BladeSlider;
