import { makeStyles } from '@material-ui/core/styles';
import BladeBoolean from '../components/Boolean/BladeBoolean';
import BladeSelect from '../components/String/BladeSelect';
import BladeSlider from '../components/Number/BladeSlider';
import GradientPickerWrapper from '../components/GradientPicker/GradientPicker.wrapper';
import {
  EffectSchemaFormDefaultProps,
  EffectSchemaFormProps,
} from './EffectSchemaForm.props';

const useStyles = makeStyles({
  bladeSchemaForm: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& *': {
      boxSizing: 'border-box',
    },
  },
});

const EffectSchemaForm = ({
  schema,
  model,
  virtId,
  handleEffectConfig,
}: EffectSchemaFormProps) => {
  const classes = useStyles();

  const yzSchema =
    schema &&
    schema.properties &&
    Object.keys(schema.properties)
      .map((sk) => ({
        ...schema.properties[sk],
        id: sk,
      }))
      .sort((a) => (a.type === 'number' ? -1 : 1))
      .sort((a) => (a.type === 'integer' ? -1 : 1))
      .sort((a) => (a.type === 'string' && a.enum && a.enum.length ? -1 : 1))
      .sort((a) => (a.id === 'gradient_name' ? -1 : 1))
      .sort((a) => (a.type === 'color' ? -1 : 1))
      .sort((a) => (a.id === 'color' ? -1 : 1));

  return (
    <div className={classes.bladeSchemaForm}>
      {yzSchema &&
        model &&
        yzSchema.map((s: any, i: number) => {
          switch (s.type) {
            case 'boolean':
              return (
                <BladeBoolean
                  key={i}
                  index={i}
                  model={model}
                  model_id={s.id}
                  schema={s}
                  hideDesc
                  onClick={(model_id: string, value: any) => {
                    const c: any = {};
                    c[model_id] = value;
                    return handleEffectConfig && handleEffectConfig(c);
                  }}
                />
              );
            case 'string':
              return (
                <BladeSelect
                  variant="outlined"
                  model={model}
                  schema={s}
                  wrapperStyle={{ width: '49%' }}
                  model_id={s.id}
                  key={i}
                  index={i}
                  onChange={(model_id: string, value: any) => {
                    const c: any = {};
                    c[model_id] = value;
                    return handleEffectConfig && handleEffectConfig(c);
                  }}
                />
              );

            case 'number':
              return (
                <BladeSlider
                  key={i}
                  index={i}
                  hideDesc
                  model_id={s.id}
                  model={model}
                  schema={s}
                  onChange={(model_id: string, value: any) => {
                    const c: any = {};
                    c[model_id] = value;
                    return handleEffectConfig && handleEffectConfig(c);
                  }}
                />
              );

            case 'integer':
              return (
                <BladeSlider
                  step={1}
                  key={i}
                  index={i}
                  hideDesc
                  model_id={s.id}
                  model={model}
                  schema={s}
                  style={{ margin: '0.5rem 0' }}
                  onChange={(model_id: string, value: any) => {
                    const c: any = {};
                    c[model_id] = value;
                    return handleEffectConfig && handleEffectConfig(c);
                  }}
                />
              );
            case 'color':
              return (
                <GradientPickerWrapper
                  pickerBgColor={model[s.id]}
                  key={i}
                  index={i}
                  title={s.id}
                  // selectedType={selectedType}
                  // model={model}
                  virtId={virtId}
                  wrapperStyle={{ width: '49%' }}
                  isGradient={s.gradient}
                />
              );
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

EffectSchemaForm.defaultProps = EffectSchemaFormDefaultProps;

export default EffectSchemaForm;
