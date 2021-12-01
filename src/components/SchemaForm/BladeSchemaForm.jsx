import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  DialogContentText,
  Select,
  MenuItem,
  ListSubheader,
  Switch,
  FormControlLabel,
  Divider,
} from '@material-ui/core';
import BladeBoolean from './BladeBoolean';
import BladeSelect from './BladeSelect';
import BladeSlider from './BladeSlider';
import BladeFrame from './BladeFrame';
import { Info } from '@material-ui/icons';

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

const BladeSchemaForm = (props) => {
  const {
    schema,
    model,
    disableUnderline,
    hideToggle,
    onModelChange = (e) => e,
    type,
  } = props;

  // console.log(schema)
  const classes = useStyles();
  const [hideDesc, setHideDesc] = useState(true);

  const yzSchema = schema && schema.properties &&
    Object.keys(schema.properties)
      .map(sk => ({
        ...schema.properties[sk],
        id: sk,
        required: schema.required && schema.required.indexOf(sk) !== -1,
        permitted: schema.permitted_keys ? schema.permitted_keys.indexOf(sk) > -1 : true
      }))
      .sort((a, b) => a.required ? -1 : 1)
      .sort((a, b) => a.id === 'name' ? -1 : 1)

  return (
    <div>

      <div className={classes.bladeSchemaForm}>
        {yzSchema && yzSchema.map((s, i) => {

          switch (s.type) {
            case 'boolean':
              return (
                <BladeBoolean
                  hideDesc={hideDesc}
                  key={i}
                  index={i}
                  model={model}
                  model_id={s.id}
                  required={s.required}
                  style={{ margin: '0.5rem 0', flexBasis: '48%' }}
                  schema={s}
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

              return audio_groups?.length
                ? <BladeFrame key={i} style={{ order: -1 }} title={"Audio Device"} full={true}>
                  <Select
                    value={model && model["audio_device"] || 0}
                    fullWidth
                    disableUnderline
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
                : !((type === 'mqtt_hass' && s.id === 'name') || (type === 'mqtt_hass' && s.id === 'description')) &&
                <BladeSelect
                  hideDesc={hideDesc}
                  hide={"test"}
                  model={model}
                  disabled={!s.permitted}
                  style={{ margin: '0.5rem 0', width: '48%' }}
                  textStyle={{ width: '100%' }}
                  schema={s}
                  required={s.required}
                  model_id={s.id}
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
                  hideDesc={hideDesc}
                  disabled={!s.permitted}
                  disableUnderline={disableUnderline}
                  key={i}
                  model_id={s.id}
                  model={model}
                  required={s.required}
                  schema={s}
                  onChange={(model_id, value) => {
                    const c = {};
                    c[model_id] = value;
                    return onModelChange(c);
                  }}
                />
              );

            case 'integer':
              return <BladeSlider
                hideDesc={hideDesc}
                disabled={!s.permitted}
                disableUnderline={disableUnderline}
                step={1}
                key={i}
                model_id={s.id}
                model={model}
                required={s.required}
                schema={s}
                textfield={false}
                style={{ margin: '0.5rem 0', width: '48%' }}
                onChange={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return onModelChange(c);
                }}
              />
            case 'int':
              return s?.enum?.length > 10 ? <BladeSlider
                hideDesc={hideDesc}
                disabled={!s.permitted}
                disableUnderline={disableUnderline}
                marks={s?.enum}
                step={null}
                key={i}
                model_id={s.id}
                model={model}
                required={s.required}
                schema={s}
                textfield={false}
                style={{ margin: '0.5rem 0', width: '48%' }}
                onChange={(model_id, value) => {
                  const c = {};
                  c[model_id] = value;
                  return onModelChange(c);
                }}
              /> : <BladeSlider
                hideDesc={hideDesc}
                disabled={!s.permitted}
                disableUnderline={disableUnderline}
                marks={s?.enum}
                step={null}
                key={i}
                model_id={s.id}
                model={model}
                required={s.required}
                schema={s}
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
                  {s.type}
                </>
              );
          }
        })}
      </div>
      {!hideToggle && <>
        <Divider style={{ margin: '1rem 0 0.5rem 0' }} />
        <FormControlLabel
          value="start"
          control={<Switch checked={!hideDesc} onChange={(e) => setHideDesc(!hideDesc)} />}
          label={<DialogContentText style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>Field-Descriptions<Info style={{ marginLeft: '0.5rem' }} /></DialogContentText>}
          labelPlacement="end"
        />
      </>}
    </div>
  );
};

BladeSchemaForm.propTypes = {
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
};

export default BladeSchemaForm;
