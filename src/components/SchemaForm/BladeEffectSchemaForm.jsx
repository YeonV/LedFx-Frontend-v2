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
    colorMode = 'picker',
    colorKeys = [],
    boolMode = 'switch',
    boolVariant = 'outlined',
    selectVariant = 'outlined',
    sliderVariant = 'outlined',
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
  const [_boolMode, _setBoolMode] = useState(boolMode);
  const [_boolVariant, _setBoolVariant] = useState(boolVariant);
  const [_selectVariant, _setSelectVariant] = useState(selectVariant);
  const [_sliderVariant, _setSliderVariant] = useState(sliderVariant);
  const [_colorMode, _setColorMode] = useState(colorMode);
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);

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

  return (
    <div className={classes.bladeSchemaForm}>
      {parseInt(window.localStorage.getItem('BladeMod')) > 20 && (
        <Fab
          onClick={handleClickOpen}
          variant="circular"
          color="primary"
          size="small"
          style={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <SettingsIcon />
        </Fab>
      )}
      {pickerKeys && pickerKeys.map(
        (k, i) => model && Object.keys(model).indexOf(k) !== -1 && (
          <BladeColorDropDown
            virtual={virtual}
            effects={effects}
            selectedType={selectedType}
            model={model}
            key={k}
            index={i}
            type={_colorMode === 'select' ? 'text' : 'color'}
            clr={k}
          />
        ),
      )}
      { }
      {Object.keys(schema.properties).map((s, i) => {
        switch (schema.properties[s].type) {
          case 'boolean':
            return (
              <BladeBoolean
                type={_boolMode}
                variant={_boolVariant}
                key={i}
                index={i}
                model={model}
                model_id={s}
                schema={schema.properties[s]}
                hideDesc={true}
                onClick={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return handleEffectConfig(virtual_id, c);
                }}
              />
            );
          case 'string':
            return schema.properties[s].enum && pickerKeys.indexOf(s) === -1 ?
              (s === 'gradient_name')
                ? (
                  <BladeGradientPicker
                    col={model[s]}
                    key={i}
                    clr={s}
                    selectedType={selectedType}
                    model={model}
                    virtual={virtual}
                  />
                )
                : (
                  <BladeSelect
                    model={model}
                    variant={_selectVariant}
                    schema={schema.properties[s]}
                    wrapperStyle={{ width: '49%' }
                    }
                    model_id={s}
                    key={i}
                    index={i}
                    onChange={(model_id, value) => {
                      const c = {};
                      c[model_id] = value;
                      return handleEffectConfig(virtual_id, c);
                    }}
                  />
                ) : (
                pickerKeys.indexOf(s) === -1 && (
                  <BladeColorDropDown
                    selectedType={selectedType}
                    index={i}
                    model={model}
                    type="colorNew"
                    clr="blade_color"
                    key={i}
                  />
                )
              );

          case 'number':
            return (
              <BladeSlider
                variant={_sliderVariant}
                key={i}
                index={i}
                hideDesc={true}
                model_id={s}
                model={model}
                schema={schema.properties[s]}
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
                variant={_sliderVariant}
                step={1}
                key={i}
                index={i}
                hideDesc={true}
                model_id={s}
                model={model}
                schema={schema.properties[s]}
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
                {schema.properties[s].type}
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
          <FormControl>
            <InputLabel id="ColorVariantLabel">Color Mode</InputLabel>
            <Select
              labelId="ColorVariantLabel"
              id="ColorVariant"
              value={_colorMode}
              onChange={(e) => _setColorMode(e.target.value)}
            >
              <MenuItem value="picker">Picker</MenuItem>
              <MenuItem value="select">Select</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="BoolModeLabel">Bool Mode</InputLabel>
            <Select
              labelId="BoolModeLabel"
              id="BoolMode"
              value={_boolMode}
              onChange={(e) => _setBoolMode(e.target.value)}
            >
              <MenuItem value="switch">Switch</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="button">Button</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="BoolVariantLabel">Bool Variant</InputLabel>
            <Select
              labelId="BoolVariantLabel"
              id="BoolVariant"
              value={_boolVariant}
              onChange={(e) => _setBoolVariant(e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="outlined">Outlined</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="SelectVariantLabel">Select Variant</InputLabel>
            <Select
              labelId="SelectVariantLabel"
              id="SelectVariant"
              value={_selectVariant}
              onChange={(e) => _setSelectVariant(e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="outlined">Outlined</MenuItem>
              <MenuItem value="contained">Contained</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="SliderVariantLabel">Slider Variant</InputLabel>
            <Select
              labelId="SliderVariantLabel"
              id="SliderVariant"
              value={_sliderVariant}
              onChange={(e) => _setSliderVariant(e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="outlined">Outlined</MenuItem>
            </Select>
          </FormControl>

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
  boolVariant: PropTypes.oneOf(['outlined', 'contained', 'text']),
  selectVariant: PropTypes.string, // outlined | any
  sliderVariant: PropTypes.string, // outlined | any
  colorKeys: PropTypes.array,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  virtual_id: PropTypes.string.isRequired,
  selectedType: PropTypes.string.isRequired,
};

export default BladeEffectSchemaForm;
