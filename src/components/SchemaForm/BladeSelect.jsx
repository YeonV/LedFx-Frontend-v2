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
  schema,
  model,
  model_id,
  onChange,
  required=false,
  style = {}
}) => {
  // console.log(model, schema, model_id);
  const classes = useStyles();

  const Frame = ({ children }) => (variant === 'outlined' ? (
    <div className={classes.wrapper} style={{ ...style, ...{ order: schema.title === 'Name' ? -2 : required ? -1 : 1 }}}>
      <label>{schema.title}{required ? '*' : ''}</label>
      {children}
    </div>
  ) : (
    children
  ));
    // console.log(schema)
  return (
    <Frame>
      {variant === 'contained' ? (
        schema.enum 
        ? (
          <Select
            variant="filled"
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
        schema.enum 
        ? (
        <Select
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
