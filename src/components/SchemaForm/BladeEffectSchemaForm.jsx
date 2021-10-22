import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Select,
  DialogActions,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import useStore from '../../utils/apiStore';
import BladeColorDropDown from './BladeColorDropDown';
import BladeBoolean from './BladeBoolean';
import BladeSelect from './BladeSelect';
import BladeSlider from './BladeSlider';
import BladeGradientPicker from './BladeGradientPicker';

const useStyles = makeStyles({
  bladeSchemaForm: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

const BladeEffectSchemaForm = (props) => {
  const {
    effects,
    virtual,
    schema,
    model,
    virtual_id,
    selectedType,
    colorKeys = [],
  } = props;
  const pickerKeys = [
    'color',
    'background_color',
    'color_lows',
    'color_mids',
    'color_high',
    'strobe_color',
    'lows_colour',
    'mids_colour',
    'high_colour',
    ...colorKeys,
  ];

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const color_mode = useStore((state) => state.schemaForm.color_mode);
  const bool_mode = useStore((state) => state.schemaForm.bool_mode);
  const gradient_mode = useStore((state) => state.schemaForm.gradient_mode);
  const setSchemaForm = useStore((state) => state.setSchemaForm);

  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const viewMode = useStore((state) => state.viewMode);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEffectConfig = (virtual_id, config) => updateVirtualEffect(virtual_id, {
    virtId: virtual_id,
    type: selectedType,
    config,
  }).then(() => {
    getVirtuals();
  });

  const yzSchema = schema && schema.properties &&
    Object.keys(schema.properties)
      .map(sk => ({
        ...schema.properties[sk],
        id: sk,
      }))
      .sort((a) => (a.type === 'number') ? -1 : 1)
      .sort((a) => (a.type === 'integer') ? -1 : 1)
      .sort((a) => (a.type === 'string' && a.enum && a.enum.length) ? -1 : 1)
      .sort((a) => pickerKeys.indexOf(a.id) > -1 ? -1 : 1)
      .sort((a) => a.id === 'color' ? -1 : 1)
      .sort((a) => a.id === 'gradient_name' ? -1 : 1)

  return (
    <div className={classes.bladeSchemaForm}>
      {viewMode === 'expert' && (
        <Fab
          onClick={handleClickOpen}
          variant="circular"
          color="default"
          size="small"
          style={{ position: 'absolute', right: '3rem', top: '1rem' }}
        >
          <SettingsIcon />
        </Fab>
      )}

      {yzSchema && yzSchema.map((s, i) => {
        switch (s.type) {
          case 'boolean':
            return (
              <BladeBoolean
                type={bool_mode}
                key={i}
                index={i}
                model={model}
                model_id={s.id}
                schema={s}
                hideDesc={true}
                onClick={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return handleEffectConfig(virtual_id, c);
                }}
              />
            );
          case 'string':
            return s.enum && pickerKeys.indexOf(s.id) === -1 ?
              (s.id === 'gradient_name' && gradient_mode !== 'select')
                ? <BladeGradientPicker
                  col={model[s.id]}
                  key={i}
                  clr={s.id}
                  selectedType={selectedType}
                  model={model}
                  virtual={virtual}
                  variant={gradient_mode}
                />
                : <BladeSelect
                  model={model}
                  schema={s}
                  wrapperStyle={{ width: '49%' }
                  }
                  model_id={s.id}
                  key={i}
                  index={i}
                  onChange={(model_id, value) => {
                    const c = {};
                    c[model_id] = value;
                    return handleEffectConfig(virtual_id, c);
                  }}
                />

              : <BladeColorDropDown
                  virtual={virtual}
                  effects={effects}
                  selectedType={selectedType}
                  model={model}
                  key={i}
                  index={i}
                  type={color_mode === 'select' ? 'text' : 'color'} // colorNew
                  clr={s.id}
                />

          case 'number':
            return (
              <BladeSlider
                key={i}
                index={i}
                hideDesc={true}
                model_id={s.id}
                model={model}
                schema={s}
                onChange={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return handleEffectConfig(virtual_id, c);
                }}
              />
            );

          case 'integer':
            return (
              <BladeSlider
                step={1}
                key={i}
                index={i}
                hideDesc={true}
                model_id={s.id}
                model={model}
                schema={s}
                style={{ margin: '0.5rem 0' }}
                onChange={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return handleEffectConfig(virtual_id, c);
                }}
              />
            );

          default:
            return (
              <>
                Unsupported type:
                {s.type}
              </>
            );
        }
      })}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Blade's SchemaForm Settings
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Customize the appearance of dynamically generated forms
          </DialogContentText>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <InputLabel id="ColorVariantLabel">Color Mode</InputLabel>
              <Select
                labelId="ColorVariantLabel"
                id="ColorVariant"
                value={color_mode}
                onChange={(e) => setSchemaForm('color_mode', e.target.value)}
              >
                <MenuItem value="picker">Picker</MenuItem>
                <MenuItem value="select">Select</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="BoolModeLabel">Bool Mode</InputLabel>
              <Select
                labelId="BoolModeLabel"
                id="bool_mode"
                value={bool_mode}
                onChange={(e) => setSchemaForm('bool_mode', e.target.value)}
              >
                <MenuItem value="switch">Switch</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="button">Button</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="GradientModeLabel">Gradient Mode</InputLabel>
              <Select
                labelId="GradientModeLabel"
                id="gradient_mode"
                value={gradient_mode}
                onChange={(e) => setSchemaForm('gradient_mode', e.target.value)}
              >
                <MenuItem value="picker">Picker</MenuItem>
                <MenuItem value="picker-var2">Picker Variant 2</MenuItem>
                <MenuItem value="select">Select</MenuItem>
              </Select>
            </FormControl>
          </div>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary">
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

BladeEffectSchemaForm.propTypes = {
  colorMode: PropTypes.oneOf(['picker', 'select']),
  boolMode: PropTypes.oneOf(['switch', 'checkbox', 'button']),
  colorKeys: PropTypes.array,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  virtual_id: PropTypes.string.isRequired,
  selectedType: PropTypes.string.isRequired,
};

export default BladeEffectSchemaForm;
