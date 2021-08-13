import PropTypes from 'prop-types';
import { Select, MenuItem, TextField } from '@material-ui/core/';
import BladeFrame from './BladeFrame';

const BladeSelect = ({
  variant = 'outlined',
  disabled = false,
  schema,
  model,
  model_id,
  onChange,
  index,
  required = false,
  wrapperStyle = {},
  selectStyle = {},
  textStyle = {},
  menuItemStyle = {}
}) =>
  <BladeFrame
    title={schema.title}
    className={`step-effect-${index}`}
    full={!(schema.enum && schema.enum.length && Object.values(schema.enum).every(a => a.length < 20))}
    required={required}
    style={wrapperStyle}>

    {variant === 'contained' ? (
      schema.enum
        ? (
          <Select
            variant="filled"
            disabled={disabled}
            style={{ flexGrow: variant === 'outlined' ? 1 : 'unset', selectStyle }}
            disableUnderline
            defaultValue={schema.default}
            value={model && model[model_id] || schema.enum[0]}
            onChange={(e) => onChange(model_id, e.target.value)}
          >
            {schema.enum.map((item, i) => (
              <MenuItem key={i} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>)
        : (
          <TextField
            helperText={schema.description}
            defaultValue={model && model[model_id] || (schema.enum && schema.enum[0]) || schema.default || ''}
            onBlur={(e) => onChange(model_id, e.target.value)}
            style={textStyle}

          />
        )
    ) : (
      schema.enum && Array.isArray(schema.enum)
        ? (
          <Select
            disabled={disabled}
            style={{ flexGrow: variant === 'outlined' ? 1 : 'unset', selectStyle }}
            disableUnderline
            defaultValue={schema.default}
            value={model && model[model_id] || schema.enum[0]}
            onChange={(e) => onChange(model_id, e.target.value)}
          >
            {schema.enum.map((item, i) => (
              <MenuItem key={i} value={item} style={menuItemStyle}>
                {item}
              </MenuItem>
            ))}
          </Select>)
        : schema.enum && !Array.isArray(schema.enum)
          ? (
            <Select
              disabled={disabled}
              style={{ flexGrow: variant === 'outlined' ? 1 : 'unset', selectStyle }}
              disableUnderline
              defaultValue={schema.default}
              value={model && schema.enum[model[model_id]] || schema.enum[0]}
              onChange={(e) => onChange(model_id, parseInt(Object.keys(schema.enum).find(en => schema.enum[en] === e.target.value)))}
            >
              {Object.keys(schema.enum).map((item, i) => (
                <MenuItem key={i} value={schema.enum[item]}>
                  {schema.enum[item]}
                </MenuItem>
              ))}
            </Select>)
          : (
            <TextField
              type={schema.description?.includes('password') ? "password" : "unset"}
              helperText={schema.description}
              defaultValue={model && model[model_id] || (schema.enum && schema.enum[0]) || schema.default || ''}
              onBlur={(e) => onChange(model_id, e.target.value)}
              style={textStyle}
            />
          )
    )}
  </BladeFrame>


BladeSelect.propTypes = {
  variant: PropTypes.string,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  model_id: PropTypes.string.isRequired,
};

export default BladeSelect;

