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
  ListSubheader,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import BladeBoolean from './BladeBoolean';
import BladeSelect from './BladeSelect';
import BladeSlider from './BladeSlider';
import BladeFrame from './BladeFrame';

const useStyles = makeStyles((theme) => ({
  bladeSchemaForm: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  FormListHeaders: {
    background: theme.palette.secondary.main,
    color: '#fff',
  },
}));

const BladeSchemaFormNew = (props) => {
  const {
    schema,
    model,
    disableUnderline,
    colorMode = 'picker',
    boolMode = 'switch',
    boolVariant = 'outlined',
    selectVariant = 'outlined',
    sliderVariant = 'outlined',
    onModelChange = (e) => e,
  } = props;



  // console.log(schema)
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [_boolMode, _setBoolMode] = useState(boolMode);
  const [_boolVariant, _setBoolVariant] = useState(boolVariant);
  const [_selectVariant, _setSelectVariant] = useState(selectVariant);
  const [_sliderVariant, _setSliderVariant] = useState(sliderVariant);
  const [_colorMode, _setColorMode] = useState(colorMode);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

      {schema && schema.properties && Object.keys(schema.properties).map((s, i) => {
        let permitted = true
        if (schema.permitted_keys && schema.permitted_keys.indexOf(s) === -1) {
          permitted = false
        }

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
                required={schema.required && schema.required.indexOf(s) !== -1}
                style={{ margin: '0.5rem 0', flexBasis: '48%' }}
                schema={schema.properties[s]}
                onClick={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return onModelChange(c);
                }}
              />
            );
          case 'string':
            const group = {}
            let audio_groups = []
            if (schema?.properties?.audio_device?.enum) {
              for (const [key, value] of Object.entries(schema.properties.audio_device?.enum)) {
                // console.log(`${key}: ${value.split(':')[0]}`);
                if (!group[value.split(':')[0]]) {
                  group[value.split(':')[0]] = {}
                }
                group[value.split(':')[0]][key] = value.split(':')[1]
              }
              function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
              audio_groups = (Object.values(schema.properties.audio_device?.enum).map(d => d.split(':')[0]).filter(onlyUnique))
            }
            // console.log(group, audio_groups)
            return audio_groups?.length
              ? <BladeFrame key={i} style={{ order: -1 }} title={"Audio Device"} full={true}>
                  <Select
                    value={model && model["audio_device"] || 0}
                    fullWidth
                    disableUnderline
                    // onChange={(e) => console.log(e.target.value)}
                    onChange={(e) => {
                      const c = {};
                      c["audio_device"] = parseInt(e.target.value);
                      return onModelChange(c);
                    }}
                    id="grouped-select"
                    className={classes.FormSelect}
                  >
                    {audio_groups?.map((c, ind) =>
                      [
                        <ListSubheader
                          className={classes.FormListHeaders}
                          color="primary"
                          key={ind}
                        >
                          {c}
                        </ListSubheader>
                        ,


                        Object.keys(group[c]).map((e) =>
                          <MenuItem className={classes.FormListItem} value={e}>
                            {group[c][e]}
                          </MenuItem>
                        ),
                      ],
                    )}
                  </Select>
                </BladeFrame>
              : <BladeSelect
                model={model}
                disabled={!permitted}
                style={{ margin: '0.5rem 0', width: '48%' }}
                variant={_selectVariant}
                schema={schema.properties[s]}
                required={schema.required && schema.required.indexOf(s) !== -1}
                model_id={s}
                key={i}
                index={i}
                onChange={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return onModelChange(c);
                }}
              />

          case 'number':
            return (
              <BladeSlider
                variant={_sliderVariant}
                disabled={!permitted}
                disableUnderline={disableUnderline}
                key={i}
                model_id={s}
                model={model}
                required={schema.required && schema.required.indexOf(s) !== -1}
                schema={schema.properties[s]}
                onChange={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return onModelChange(c);
                }}
              />
            );

          case 'integer':
            return <BladeSlider
              variant={_sliderVariant}
              disabled={!permitted}
              disableUnderline={disableUnderline}
              step={1}
              key={i}
              model_id={s}
              model={model}
              required={schema.required && schema.required.indexOf(s) !== -1}
              schema={schema.properties[s]}
              textfield={true}
              style={{ margin: '0.5rem 0', width: '48%' }}
              onChange={(model_id, value) => {
                const c = {};
                c[model_id] = value;
                return onModelChange(c);
              }}
            />
          case 'int':
            return schema.properties[s]?.enum?.length > 10 ? <BladeSlider
              variant={_sliderVariant}
              disabled={!permitted}
              disableUnderline={disableUnderline}
              marks={schema.properties[s]?.enum}
              step={null}
              key={i}
              model_id={s}
              model={model}
              required={schema.required && schema.required.indexOf(s) !== -1}
              schema={schema.properties[s]}
              textfield={false}
              style={{ margin: '0.5rem 0', width: '48%' }}
              onChange={(model_id, value) => {
                const c = {};
                c[model_id] = value;
                return onModelChange(c);
              }}
            /> : <BladeSlider
              variant={_sliderVariant}
              disabled={!permitted}
              disableUnderline={disableUnderline}
              marks={schema.properties[s]?.enum}
              step={null}
              key={i}
              model_id={s}
              model={model}
              required={schema.required && schema.required.indexOf(s) !== -1}
              schema={schema.properties[s]}
              textfield={false}
              style={{ margin: '0.5rem 0', width: '48%' }}
              onChange={(model_id, value) => {
                const c = {};
                c[model_id] = value;
                return onModelChange(c);
              }}
            />
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

BladeSchemaFormNew.propTypes = {
  colorMode: PropTypes.oneOf(['picker', 'select']),
  boolMode: PropTypes.oneOf(['switch', 'checkbox', 'button']),
  boolVariant: PropTypes.oneOf(['outlined', 'contained', 'text']),
  selectVariant: PropTypes.string, // outlined | any
  sliderVariant: PropTypes.string, // outlined | any
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
};

export default BladeSchemaFormNew;
