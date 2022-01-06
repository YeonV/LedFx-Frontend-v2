import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import BladeBoolean from './components/BladeBoolean';
import BladeSelect from './components/BladeSelect';
import BladeSlider from './components/BladeSlider';
import BladeGradientPicker from './components/BladeGradientPicker';

const useStyles = makeStyles({
  bladeSchemaForm: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

const BladeEffectSchemaForm = (props) => {
  const {
    virtual,
    schema,
    model,
    virtual_id,
    selectedType,
  } = props;

  const classes = useStyles();
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);

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
      .sort((a) => a.id === 'gradient_name' ? -1 : 1)
      .sort((a) => (a.type === 'color') ? -1 : 1)
      .sort((a) => a.id === 'color' ? -1 : 1)

  return (
    <div className={classes.bladeSchemaForm}>
      {yzSchema && yzSchema.map((s, i) => {
        switch (s.type) {
          case 'boolean':
            return (
              <BladeBoolean
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
                return <BladeSelect
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
          case 'color':
            return (
              <BladeGradientPicker
                  col={model[s.id]}
                  key={i}
                  index={i}
                  clr={s.id}
                  selectedType={selectedType}
                  model={model}
                  virtual={virtual}
                  wrapperStyle={{ width: '49%' }}
                  gradient={s.gradient}
                />
            )
          default:
            return (
              <>
                Unsupported type:--
                {s.type}
              </>
            );
        }
      })}
    </div>
  );
};

BladeEffectSchemaForm.propTypes = {
  schema: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  virtual_id: PropTypes.string.isRequired,
  selectedType: PropTypes.string.isRequired,
};

export default BladeEffectSchemaForm;
