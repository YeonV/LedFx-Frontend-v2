import { useState } from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';

const useStyles = makeStyles((theme) => ({
  FormRow: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid rgba(255, 255, 255, 0.23)',
    borderRadius: '10px',
    margin: '0 0 0.5rem',
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
  FormListHeaders: {
    pointerEvents: 'none',
    background: theme.palette.secondary.main,
    color: '#fff',
  },
  FormListItem: {
    paddingLeft: '2rem',
  },
  FormToggleWrapper: {
    '@media (max-width: 580px)': {
      order: -1,
    },
  },

  FormToggle: {
    '@media (max-width: 580px)': {
      flexGrow: 1,
    },
  },
}));

const BladeEffectDropDown = ({ effects, virtual }) => {
  const classes = useStyles();
  const setVirtualEffect = useStore((state) => state.setVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);

  const effectNames = effects
    && Object.keys(effects).map((eid) => ({
      name: effects[eid].name,
      id: effects[eid].id,
      category: effects[eid].category,
    }));

  const group = effectNames
    && effectNames.reduce((r, a) => {
      r[a.category] = [...(r[a.category] || []), a];
      return r;
    }, {});

  const [formats, setFormats] = useState(
    () => group && Object.keys(group).map((c) => c || []),
  );

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };
  const onEffectTypeChange = (e) => setVirtualEffect(virtual.id, {
    type: e.target.value,
  }).then(() => {
    getVirtuals();
  });

  return (
    <>
      <FormControl className={`${classes.FormRow} step-device-one`}>
        <InputLabel htmlFor="grouped-select" className={classes.FormLabel}>
          Effect Type
        </InputLabel>
        <Select
          value={virtual && virtual.effect && virtual.effect.type || ""}
          onChange={(e) => onEffectTypeChange(e)}
          id="grouped-select"
          className={classes.FormSelect}
        >
          <MenuItem value="" disabled>
            <em>None</em>
          </MenuItem>
          {effects
            && group
            && Object.keys(group).map(
              (c) => formats
                && formats.indexOf(c) !== -1 && [
                  <ListSubheader
                  className={classes.FormListHeaders}
                  color="primary"
                >
                  {c}
                </ListSubheader>,
                group[c].map((e) => (
                    <MenuItem className={classes.FormListItem} value={e.id}>
                    {e.name}
                  </MenuItem>
                )),
              ],
            )}
        </Select>
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
          className={classes.FormToggleWrapper}
        >
          {effects
            && Object.keys(group).map((c, i) => (
              <ToggleButton
                className={classes.FormToggle}
                key={i}
                value={c}
                aria-label={c}
              >
                {c}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </FormControl>
    </>
  );
};

export default BladeEffectDropDown;
