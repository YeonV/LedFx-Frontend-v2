import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem, TextField } from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minWidth: '200px',
    padding: '16px 1.2rem 6px 1.2rem',
    border: '1px solid #999',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 'auto',
    margin: '0.5rem 0',
    "@media (max-width: 580px)": {
      width: '100% !important',
      margin: '0.5rem 0',
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
  },
}));
const BladeSelect = ({
  variant = 'outlined',
  disabled = false,
  schema,
  model,
  model_id,
  onChange,
  required = false,
  style = {}
}) => {
  // console.log(model, schema, model_id);
  const classes = useStyles();

  const Frame = ({ children, full = false }) => (variant === 'outlined' ? (
    <div className={classes.wrapper} style={{
      ...style,
      order: schema.title === 'Name' ? -2 : required ? -1 : 1,
      width: full ? '100%' : style.width
    }}>
      <label>{schema.title}{required ? '*' : ''}</label>
      {children}
    </div>
  ) : (
    children
  ));
console.log(model, model_id);
  return (
    <Frame full={schema.enum && schema.enum[0] && schema.enum[0].length > 20}>
      {variant === 'contained' ? (
        schema.enum
          ? (
            <Select
              variant="filled"
              disabled={disabled}
              style={{ flexGrow: variant === 'outlined' ? 1 : 'unset' }}
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

            />
          )
      ) : (
        schema.enum && Array.isArray(schema.enum)
          ? (
            <Select
              disabled={disabled}
              style={{ flexGrow: variant === 'outlined' ? 1 : 'unset' }}
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
          : schema.enum && !Array.isArray(schema.enum)
            ? (
              <Select
                disabled={disabled}
                style={{ flexGrow: variant === 'outlined' ? 1 : 'unset' }}
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

              />
            )
      )}
    </Frame>
  );
};

BladeSelect.propTypes = {
  variant: PropTypes.string,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  model_id: PropTypes.string.isRequired,
};

export default BladeSelect;

