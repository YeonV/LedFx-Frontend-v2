import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import { setDisplayEffect } from "modules/selectedDisplay";
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import BladeColorPicker from './BladeColorPicker';
import BladeColorNewPicker from './BladeColorNewPicker';

const useStyles = makeStyles((theme) => ({
  FormRow: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid',
    borderRadius: '10px',
    '@media (max-width: 580px)': {
      flexDirection: 'column',
    },
  },
  FormLabel: {
    marginLeft: '1rem',
    paddingTop: '0.5rem',
    '@media (max-width: 580px)': {
      display: 'none',
    },
  },
  FormSelect: {
    flexGrow: 1,
    marginLeft: '1rem',
    paddingTop: '0.5rem',
    '&:before, &:after': {
      display: 'none',
    },
    '& > .MuiSelect-select:focus': {
      backgroundColor: 'unset',
    },
  },
}));

const BladeColorDropDown = ({
  effects = {},
  display = {},
  clr = 'color',
  type = 'both',
  selectedType,
  model,
}) => {
  const classes = useStyles();

  const setDisplayEffect = useStore((state) => state.setDisplayEffect);
  const updateDisplayEffect = useStore((state) => state.updateDisplayEffect);
  const getDisplays = useStore((state) => state.getDisplays);

  const displays = useStore((state) => state.displays);
  const effectyz = displays[Object.keys(displays).find((d) => d === display.id)];
  const curEffSchema = effects[selectedType];
  const colors = curEffSchema
    && curEffSchema.schema.properties[clr]
    && curEffSchema.schema.properties[clr].enum;

  const sendColor = (e) => display
    && updateDisplayEffect(display.id, {
      displayId: display.id,
      type: effectyz.effect.type,
      config: { [clr]: e },
    }).then(() => {
      getDisplays();
    });

  const onEffectTypeChange = (e) => display
    && setDisplayEffect(display.id, {
      displayId: display.id,
      type: display.config[display.id].effect.type,
      config: { [clr]: e.target.value },
    }).then(() => {
      getDisplays();
    });
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {(type === 'text' || type === 'both') && (
        <FormControl className={classes.FormRow}>
          <InputLabel htmlFor="grouped-select" className={classes.FormLabel}>
            {clr.replaceAll('_', ' ')}
          </InputLabel>
          <Select
            value={model[clr]}
            onChange={onEffectTypeChange}
            id="grouped-select"
            className={classes.FormSelect}
          >
            {colors
              && colors.map((c) => (
                <MenuItem className={classes.FormListItem} key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}

      {(type === 'color' || type === 'both') && (
        <BladeColorPicker
          col={model[clr]}
          clr={clr}
          sendColor={sendColor}
          selectedType={selectedType}
          model={model}
        />
      )}
      {type === 'colorNew'
        && (console.log('DAMN', clr, model, selectedType) || (
          <BladeColorNewPicker
            col={model[clr]}
            clr={clr}
            sendColor={sendColor}
            selectedType={selectedType}
            model={model}
          />
        ))}
    </div>
  );
};

export default BladeColorDropDown;
