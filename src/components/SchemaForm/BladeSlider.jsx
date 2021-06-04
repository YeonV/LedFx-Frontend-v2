import PropTypes from 'prop-types';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Slider, Input, TextField } from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: '1rem',
    backgroundColor: '#88888888',
    paddingLeft: '0.5rem',
    borderRadius: '5px'
  },
  wrapper: {
    minWidth: '250px',
    padding: '16px 1.2rem 6px 1.2rem',
    border: '1px solid #999',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    order: 1,
    margin: '0.5rem 0',
    "@media (max-width: 580px)": {
      width: '100% !important',
    },
    '& > label': {
      top: '-0.7rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',      
    },
    '& .sortable-handler': {
      touchAction: 'none',
    }
  },
}));
const BladeSlider = ({
  variant = 'outlined',
  schema,
  model,
  model_id,
  step,
  onChange,
  required=false,
  textfield = false,
  style = {},
}) => {
  const classes = useStyles();
  // console.log(schema)
  return variant === 'outlined' ? (
    <div className={classes.wrapper}  style={{ ...style, ...{ order: required ? -1 : 1 }}}>
      <label>{schema.title}{required ? '*' : ''}</label>
      <BladeSliderInner
        schema={schema}
        model={model}
        model_id={model_id}
        step={step}
        onChange={onChange}
        textfield={textfield}
      />
    </div>
  ) : (
    <BladeSliderInner
      schema={schema}
      model={model}
      model_id={model_id}
      onChange={onChange}
      textfield={textfield}
      style={{ order: required ? -1 : 1 }}
    />
  );
};

const BladeSliderInner = ({
  schema, model, model_id, step, onChange, textfield, style
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
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };
  const handleBlur = () => {
    if (value < schema.minimum) {
      setValue(schema.minimum);
    } else if (value > schema.maximum) {
      setValue(schema.maximum);
    }
  };

  return (schema.maximum && !textfield )? (
    <>
      <Slider
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
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
      <Input
        disableUnderline
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
  ) : (
    
    <TextField
      // defaultValue={schema.default || 1}
      defaultValue={value}
      // onChange={()=>handleInputChange}
      onBlur={(e,b) => onChange(model_id, parseInt(e.target.value))}
      helperText={schema.description}
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
