import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import useStore from '../../store/useStore';
import BladeFrame from '../../components/SchemaForm/components/BladeFrame';

const PREFIX = 'TransitionCard';

const classes = {
  content: `${PREFIX}-content`,
  formControl: `${PREFIX}-formControl`,
  card: `${PREFIX}-card`,
};

const StyledCard = styled(Card)(({ theme }) => ({
  [`& .${classes.content}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
  },

  [`& .${classes.formControl}`]: {
    marginRight: theme.spacing(3),
    flex: 1,
  },

  [`& .${classes.card}`]: { width: '100%', maxWidth: '540px' },
}));

const TransitionCard = ({ virtual, style }: any) => {
  const schemas = useStore(
    (state) =>
      state.schemas.virtuals && state.schemas.virtuals.schema.properties
  );
  const addVirtual = useStore((state) => state.addVirtual);
  const transition_mode =
    virtual && virtual.config && virtual.config.transition_mode;
  const transition_time =
    virtual && virtual.config && virtual.config.transition_time;

  const handleSetTransition = (virtId: string, config: any) =>
    addVirtual({
      id: virtId,
      config,
    });

  const onSliderChange = (_e: any, newValue: number | number[]) =>
    handleSetTransition(virtual.id, {
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
    <StyledCard
      variant="outlined"
      className={`${classes.card} step-device-two`}
      style={style}
    >
      <CardHeader
        title="Transitions"
        subheader="Seamlessly blend between effects"
      />
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
              style={{ color: '#aaa' }}
              valueLabelDisplay="auto"
            />
          </BladeFrame>
        </FormControl>
        <BladeFrame
          title="Mode"
          style={{
            flexGrow: 0,
            flexBasis: '180px',
            minWidth: '180px',
            minHeight: '72px',
          }}
        >
          <Select
            defaultValue={transition_mode || schemas?.transition_mode.default}
            onChange={(e) => {
              handleSetTransition(virtual.id, {
                transition_mode: e.target.value,
              });
            }}
          >
            {schemas?.transition_mode.enum.map((mode: string, i: number) => (
              <MenuItem key={i} value={mode}>
                {mode}
              </MenuItem>
            ))}
          </Select>
        </BladeFrame>
      </CardContent>
    </StyledCard>
  );
};

export default TransitionCard;
