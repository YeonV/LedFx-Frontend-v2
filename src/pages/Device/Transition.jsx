import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import useStore from '../../utils/apiStore';
import BladeFrame from '../../components/SchemaForm/components/BladeFrame';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  formControl: {
    marginRight: theme.spacing(3),
    flex: 1,
  },
  card: { width: '100%', maxWidth: '540px' },
}));

const TransitionCard = ({ virtual, style }) => {
  const classes = useStyles();
  const schemas = useStore((state) => state.schemas.virtuals && state.schemas.virtuals.schema.properties);
  const addVirtual = useStore((state) => state.addVirtual);
  const transition_mode = virtual && virtual.config && virtual.config.transition_mode;
  const transition_time = virtual && virtual.config && virtual.config.transition_time;
  
  const handleSetTransition = (virtId, config) => addVirtual({
      "id": virtId, "config": config
  });

  const onSliderChange = (e, newValue) => handleSetTransition(virtual.id, {
    transition_time: newValue,
  });

  const marks = [
    {
      value: schemas?.transition_time.minimum,
      label: `${schemas?.transition_time.minimum}s`,
    },
    {
      value: schemas?.transition_time.maximum,
      label: `${schemas?.transition_time.maximum}s`,
    },
  ];

  return (
    <Card variant="outlined" className={`${classes.card} step-device-two`} style={style}>
      <CardHeader title="Transitions" subheader="Seamlessly blend between effects" />
      <CardContent className={classes.content}>
        <FormControl className={classes.formControl}>
          <BladeFrame title="Duration">
          <Slider
            defaultValue={transition_time || schemas?.transition_time.default}
            onChangeCommitted={onSliderChange}
            aria-labelledby="discrete-slider"
            step={0.1}
            min={schemas?.transition_time.minimum}
            max={schemas?.transition_time.maximum}
            marks={marks}
            style={{color: '#aaa'}}
            valueLabelDisplay="auto"
          />
          </BladeFrame>
        </FormControl>
        <BladeFrame title="Mode" style={{ flexGrow: 0, flexBasis: '180px', minWidth: '180px', minHeight: '72px' }}>
        <Select
            defaultValue={transition_mode || schemas?.transition_mode.default}
            onChange={(e) => {
              handleSetTransition(virtual.id, { transition_mode: e.target.value });
            }}
          >
            {schemas?.transition_mode.enum.map((mode, i) => <MenuItem key={i} value={mode}>{mode}</MenuItem>)}
          </Select>
        </BladeFrame>
      </CardContent>
    </Card>
  );
};

export default TransitionCard;
