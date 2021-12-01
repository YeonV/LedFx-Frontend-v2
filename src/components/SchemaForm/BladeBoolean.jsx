import { makeStyles } from '@material-ui/core/styles';
import {
  FormControlLabel, Switch, Checkbox, Button, Typography
} from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
  paper: {    
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '320px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  wrapper: {
    padding: '10px 10px 2px 10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexBasis: '23.5%',
    minWidth: 'unset',
    margin: '0.5rem 0',

    "@media (max-width: 580px)": {
      flexBasis: "37vw",
    },
    '& > label': {
      top: '-0.5rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      fontSize: '0.9rem',
      letterSpacing: '0.1rem',
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
    },
  },
}));
const BladeBoolean = ({
  onClick,
  type = 'switch', // unused
  variant = 'outlined', // unused
  schema,
  model,
  required = false,
  hideDesc = false,
  model_id,
  style = {},
  index
}) => {
  // console.log(schema);
  const classes = useStyles();

  const Frame = ({ children }) => (variant === 'outlined' ? (
    <div className={`${classes.wrapper} step-effect-${index}`} style={style}>
      <label className={'MuiFormLabel-root'}>{schema.title.replaceAll('_', ' ').replaceAll('Color', 'c')}{required ? '*' : ''}</label>
      {children}
    </div>
  ) : variant === 'text' ? (
    <FormControlLabel control={children} label={schema.title.replaceAll('_', ' ').replaceAll('color', 'c')} />
  ) : (
    { children }
  ));
  // console.log(model_id);
  switch (type) {
    case 'switch':
      return (
        <Frame>
          <Switch
            defaultValue={(model && model[model_id]) || schema.default}
            checked={model && model[model_id]}
            onChange={(e, b) => onClick(model_id, b)}
            name={schema.title.replaceAll('_', ' ').replaceAll('color', 'c')}
            color="primary"
          />
          {!hideDesc && schema.description
            ? <>
              <Typography variant={'body2'} className={'MuiFormHelperText-root'} >{schema.description} </Typography>
            </>
            : <></>
          }
        </Frame>
      );
    case 'checkbox':
      return (
        <Frame>
          <Checkbox
            defaultValue={schema.default}
            checked={model && model[model_id]}
            onChange={(e, b) => onClick(model_id, b)}
            name={model_id}
            color="primary"
          />
        </Frame>
      );
    case 'button':
      return (
        <Button
          color="primary"
          variant={model[model_id] ? 'contained' : 'outlined'}
          onClick={() => onClick(model_id, !model[model_id])}
        >
          {schema.title.replaceAll('_', ' ').replaceAll('color', 'c')}
        </Button>
      );

    default:
      return <div>unset</div>;
  }
};

export default BladeBoolean;
