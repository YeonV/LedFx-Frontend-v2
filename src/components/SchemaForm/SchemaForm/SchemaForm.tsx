import { Fragment, ReactElement, useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  DialogContentText,
  Switch,
  FormControlLabel,
  Divider,
  Autocomplete,
  TextField
} from '@mui/material'
import { Info } from '@mui/icons-material'
import type { FieldSchema } from '../../../api/ledfx.types'
import {
  audioDeviceName,
  enumOptions,
  orderFormProperties,
  sliderMarks,
  widgetFor
} from '../fields'
import BladeBoolean from '../components/Boolean/BladeBoolean'
import BladeSelect from '../components/String/BladeSelect'
import BladeSlider from '../components/Number/BladeSlider'
import GradientPicker from '../components/GradientPicker/GradientPicker'
import BladeMultiSelect from '../components/MultiSelect/BladeMultiSelect'
import { SchemaFormProps } from './SchemaForm.props'
import useStore from '../../../store/useStore'

const PREFIX = 'SchemaForm'

const classes = {
  bladeSchemaForm: `${PREFIX}-bladeSchemaForm`,
  FormListHeaders: `${PREFIX}-FormListHeaders`,
  bladeSelect: `${PREFIX}-bladeSelect`
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.bladeSchemaForm}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  [`& .${classes.FormListHeaders}`]: {
    background: theme.palette.secondary.main,
    color: '#fff'
  },

  [`& .${classes.bladeSelect}`]: {
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center'
    }
  }
}))

/**
 * Dynamically render Forms based on a `schema` <br />
 * most schemas retrived from ledfx/api/schema are read-only <br />
 * to enable write, please provide the key `permitted_keys`
 */
const SchemaForm = ({
  schema,
  model,
  hideToggle,
  onModelChange,
  type,
  errors
}: SchemaFormProps): ReactElement<any, any> => {
  const [hideDesc, setHideDesc] = useState(true)
  const perDeviceDelay = useStore((state) => state?.perDeviceDelay)
  const setPerDeviceDelay = useStore((state) => state.setPerDeviceDelay)
  const usePerDeviceDelay = useStore((state) => state?.usePerDeviceDelay)

  const change = (id: string, value: unknown) => onModelChange?.({ [id]: value })
  const order = (id: string) => (id.startsWith('stem') ? 1 : 0)

  return (
    <Root>
      <div className={classes.bladeSchemaForm}>
        {orderFormProperties(schema).map((s, i) => {
          const w = widgetFor(s, s.id, type, Boolean(schema?.$schema))
          // the widgets read id, title, enum, ... from the unwrapped field
          const f: FieldSchema = { ...w.field, id: s.id }
          const disabled = !s.permitted
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
                  disabled={disabled}
                  required={s.required}
                  hideDesc={hideDesc}
                  error={error}
                  onChange={change}
                />
              )
            case 'boolean':
              return (
                <BladeBoolean
                  hideDesc={hideDesc}
                  key={s.id}
                  index={i}
                  model={model}
                  model_id={s.id}
                  required={s.required}
                  style={{ margin: '0.5rem 0', flexBasis: '49%', order: order(s.id) }}
                  schema={f}
                  error={error}
                  onClick={change}
                />
              )
            case 'text':
            case 'select':
              return (
                <BladeSelect
                  children={undefined}
                  hideDesc={hideDesc}
                  type={type}
                  model={model}
                  nullable={w.nullable}
                  disabled={disabled}
                  wrapperStyle={{
                    margin: '0.5rem 0',
                    // a name is long free text; half a row truncates it for
                    // no benefit, unlike the short numeric fields
                    width: s.id === 'audio_device_name' ? '100%' : '49%',
                    flexBasis: 'unset',
                    order: order(s.id)
                  }}
                  textStyle={{ width: '100%' }}
                  schema={f}
                  required={s.required}
                  model_id={s.id}
                  key={s.id}
                  index={i}
                  error={error}
                  onChange={change}
                />
              )
            case 'slider':
              return (
                <BladeSlider
                  step={undefined}
                  hideDesc={hideDesc}
                  disabled={disabled}
                  key={s.id}
                  model_id={s.id}
                  model={model}
                  required={s.required}
                  schema={f}
                  error={error}
                  onChange={change}
                />
              )
            case 'integerSlider': {
              // an enum (hand-built `int`) or `examples` (fps) make a marks slider; plain integers step by 1
              const marks = sliderMarks(f)
              return (
                <BladeSlider
                  full={s.id === 'delay_ms'}
                  hideDesc={hideDesc}
                  disabled={disabled}
                  step={marks ? undefined : 1}
                  marks={marks}
                  key={s.id}
                  model_id={s.id}
                  model={model}
                  required={s.required}
                  schema={f}
                  textfield={false}
                  style={{ margin: '0.5rem 0', width: '49%', order: order(s.id) }}
                  error={error}
                  onChange={(model_id: string, value: any) => {
                    const device = audioDeviceName(
                      schema.properties?.audio_device,
                      model?.audio_device
                    )
                    if (
                      model_id === 'delay_ms' &&
                      usePerDeviceDelay &&
                      device &&
                      value !== perDeviceDelay[device]
                    ) {
                      setPerDeviceDelay({ ...perDeviceDelay, [device]: value })
                    }
                    change(model_id, value)
                  }}
                />
              )
            }
            case 'color':
            case 'gradient':
              return (
                <GradientPicker
                  key={s.id}
                  pickerBgColor={model[s.id] || f.default || '#000000'}
                  title={f.title}
                  index={i}
                  isGradient={w.kind === 'gradient'}
                  wrapperStyle={{ margin: '0.5rem 0', width: '49%', order: order(s.id) }}
                  colors={undefined}
                  handleAddGradient={() => {}}
                  sendColorToVirtuals={(color: string) => change(s.id, color)}
                  showHex={false}
                />
              )
            case 'autocomplete':
              return (
                <Autocomplete
                  key={s.id}
                  size="medium"
                  options={enumOptions(f)?.map((o) => o.value) ?? []}
                  value={model[s.id] || f.default || ''}
                  onChange={(_event, newValue) => change(s.id, newValue || '')}
                  inputValue={model[s.id] || f.default || ''}
                  onInputChange={(event, newInputValue) => {
                    if (event?.type === 'change') change(s.id, newInputValue)
                  }}
                  disabled={disabled}
                  freeSolo={f.freeSolo !== false}
                  renderOption={(props, option, state) => (
                    <li {...props} key={`${s.id}-option-${state.index}`}>
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!error}
                      label={f.title?.toUpperCase()}
                      helperText={error ?? (!hideDesc && f.description ? f.description : undefined)}
                    />
                  )}
                  sx={{ width: '100%', mb: 1 }}
                />
              )
            case 'audioDevice':
            case 'virtual':
            case 'unsupported':
              return (
                <Fragment key={s.id}>
                  Unsupported type:
                  {f.type}
                </Fragment>
              )
            default: {
              const _exhaustive: never = w.kind
              return _exhaustive
            }
          }
        })}
      </div>
      {!hideToggle && (
        <>
          <Divider style={{ margin: '1rem 0 0.5rem 0' }} />
          <FormControlLabel
            value="start"
            control={<Switch checked={!hideDesc} onChange={(_e) => setHideDesc(!hideDesc)} />}
            label={
              <DialogContentText
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 0
                }}
              >
                Show help text for fields
                <Info style={{ marginLeft: '0.5rem' }} />
              </DialogContentText>
            }
            labelPlacement="end"
          />
        </>
      )}
    </Root>
  )
}

export default SchemaForm
