import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import { setVirtualEffect } from "modules/selectedDisplay";
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import BladeColorPicker from './BladeColorPicker';
import BladeColorNewPicker from './BladeColorNewPicker';
import { useEffect } from 'react';

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
  virtual = {},
  clr = 'color',
  type = 'both',
  selectedType,
  model,
}) => {
  const classes = useStyles();

  const setVirtualEffect = useStore((state) => state.setVirtualEffect);
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);

  const virtuals = useStore((state) => state.virtuals);
  const effectyz = virtuals[Object.keys(virtuals).find((d) => d === virtual.id)];
  const curEffSchema = effects[selectedType];
  const colors = curEffSchema
    && curEffSchema.schema.properties[clr]
    && curEffSchema.schema.properties[clr].enum;
  
  
  
  const sendColor = (e, v) => { 
    console.log(virtual,effectyz, v)
    if (virtual && effectyz && effectyz.effect && effectyz.effect.type) {
      
      updateVirtualEffect(virtual.id, {
        virtId: virtual.id,
        type: effectyz.effect.type,
        config: { [clr]: e },
      }).then(() => {
        getVirtuals();
      });
    }
 
  }

  const onEffectTypeChange = (e) => virtual
    && setVirtualEffect(virtual.id, {
      virtId: virtual.id,
      type: virtual.config[virtual.id].effect.type,
      config: { [clr]: e.target.value },
    }).then(() => {
      getVirtuals();
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
        && (
          <BladeColorNewPicker
            col={model[clr]}
            clr={clr}
            sendColor={sendColor}
            selectedType={selectedType}
            model={model}
            type={virtual}
          />
        )}
    </div>
  );
};

export default BladeColorDropDown;
