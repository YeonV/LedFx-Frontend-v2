import { Fragment } from 'react'
import type { FieldSchema } from '../../../api/ledfx.types'
import { sliderMarks, widgetFor } from '../fields'
import { styled } from '@mui/material/styles'
import BladeBoolean from '../components/Boolean/BladeBoolean'
import BladeSelect from '../components/String/BladeSelect'
import BladeSlider from '../components/Number/BladeSlider'
import GradientPickerWrapper from '../components/GradientPicker/GradientPicker.wrapper'
import BladeMultiSelect from '../components/MultiSelect/BladeMultiSelect'
import { EffectSchemaFormProps } from './EffectSchemaForm.props'
import useStore from '../../../store/useStore'
import VirtualPickerSchemaForm from '../components/VirtualPicker/VirtualPickerSchemaForm'

const PREFIX = 'EffectSchemaForm'

const classes = {
  bladeSchemaForm: `${PREFIX}-bladeSchemaForm`
}

const Root = styled('div')({
  [`&.${classes.bladeSchemaForm}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& *': {
      boxSizing: 'border-box'
    }
  }
})

const EffectSchemaForm = ({
  schemaProperties,
  model,
  virtId,
  handleEffectConfig,
  descriptions,
  selectedType,
  errors
}: EffectSchemaFormProps) => {
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)
  const change = (id: string, value: unknown) =>
    handleEffectConfig && handleEffectConfig({ [id]: value })
  return (
    <Root className={classes.bladeSchemaForm}>
      {schemaProperties &&
        model &&
        schemaProperties.map((s, i) => {
          const w = widgetFor(s, s.id, selectedType, true)
          const f: FieldSchema = { ...w.field, id: s.id }
          const error = errors?.[s.id]
          switch (w.kind) {
            case 'hidden':
              return null
            case 'multiselect':
              return (
                <BladeMultiSelect
                  key={s.id}
                  index={i}
                  model={model}
                  model_id={s.id}
                  schema={f}
                  hideDesc={descriptions !== 'Show'}
                  error={error}
                  onChange={change}
                />
              )
            case 'boolean':
              return (
                <BladeBoolean
                  key={s.id}
                  index={i}
                  model={model}
                  model_id={s.id}
                  schema={f}
                  hideDesc={descriptions !== 'Show'}
                  error={error}
                  onClick={change}
                />
              )
            case 'virtual':
              return (
                <VirtualPickerSchemaForm
                  key={s.id}
                  title={f.title ?? s.id}
                  id={s.id}
                  model={model}
                  // hand-built `virtual` fields and blender's layers follow blender automagic
                  hide={blenderAutomagic && (s.type === 'virtual' || selectedType === 'blender')}
                  handleEffectConfig={handleEffectConfig}
                />
              )
            case 'text':
            case 'select':
              return (
                <BladeSelect
                  model={model}
                  schema={f}
                  nullable={w.nullable}
                  wrapperStyle={{ width: '49%' }}
                  model_id={s.id}
                  key={s.id}
                  index={i}
                  hideDesc={descriptions === 'Hide'}
                  error={error}
                  onChange={change}
                />
              )
            case 'slider':
              return (
                <BladeSlider
                  key={s.id}
                  index={i}
                  hideDesc={descriptions !== 'Show'}
                  model_id={s.id}
                  model={model}
                  schema={f}
                  error={error}
                  onChange={change}
                />
              )
            case 'integerSlider': {
              const marks = sliderMarks(f)
              return (
                <BladeSlider
                  step={marks ? undefined : 1}
                  marks={marks}
                  key={s.id}
                  index={i}
                  hideDesc={descriptions !== 'Show'}
                  model_id={s.id}
                  model={model}
                  schema={f}
                  style={{ margin: '0.5rem 0' }}
                  error={error}
                  onChange={change}
                />
              )
            }
            case 'color':
            case 'gradient':
              return (
                <GradientPickerWrapper
                  pickerBgColor={model[s.id]}
                  key={s.id}
                  index={i}
                  title={s.id}
                  hideDesc={descriptions === 'Hide'}
                  virtId={virtId}
                  wrapperStyle={{ width: '49%' }}
                  isGradient={w.kind === 'gradient'}
                />
              )
            case 'audioDevice':
            case 'autocomplete':
            case 'unsupported':
              return (
                <Fragment key={s.id}>
                  Unsupported type:--
                  {f.type}
                </Fragment>
              )
            default: {
              const _exhaustive: never = w.kind
              return _exhaustive
            }
          }
        })}
    </Root>
  )
}

export default EffectSchemaForm
