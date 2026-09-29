import { useId } from 'react'
import { Autocomplete, Chip, TextField } from '@mui/material'
import BladeFrame, { errorAria } from '../BladeFrame'
import { enumOptions, sourceOf } from '../../fields'
import { useInstanceLoaded, useInstanceOptions } from '../../useInstanceOptions'

export interface BladeMultiSelectProps {
  schema: any
  model: any
  model_id: string
  onChange: (model_id: string, value: string[]) => void
  index?: number
  required?: boolean
  disabled?: boolean
  hideDesc?: boolean
  wrapperStyle?: any
  error?: string
}

/**
 * ## MultiSelect
 * ### render an `enum` as a multi-pick field with chips
 *
 * Rendered for `schema.type === 'multiselect'`. The model value is always an
 * array, and an empty array is a meaningful selection rather than "unset"
 * (for stems it means the full mix), so nothing here coerces empty to a default.
 */
const BladeMultiSelect = ({
  schema,
  model,
  model_id,
  onChange,
  index = 0,
  required = false,
  disabled = false,
  hideDesc = false,
  wrapperStyle = { margin: '0.5rem 0', width: '100%' },
  error
}: BladeMultiSelectProps) => {
  const errorId = useId()
  // an array of instance ids (`items` carries the marker) takes its options from the store
  const sourced = useInstanceOptions(sourceOf(schema))
  const loaded = useInstanceLoaded(sourceOf(schema))
  const raw = model && model_id ? model[model_id] : undefined
  // Tolerate a scalar or a missing value so a half-migrated config still renders
  const value: string[] = Array.isArray(raw) ? raw : raw ? [raw] : []
  // a stored id the store no longer knows stays listed, as unavailable; an id in the schema's
  // default is a "none" value, not a lost instance, and stays hidden as before
  const def: unknown[] = Array.isArray(schema.default) ? schema.default : []
  const all =
    enumOptions(
      schema.items?.enum ? schema.items : schema,
      false,
      sourced && [
        ...sourced,
        ...value
          .filter((v) => !sourced.some((o) => o.value === v) && !def.includes(v))
          .map((v) => ({ value: v, label: loaded ? `${v} (unavailable)` : String(v) }))
      ]
    ) ?? []
  const options = all.map((o) => o.value) as string[]
  const labels = Object.fromEntries(all.map((o) => [String(o.value), o.label]))

  return (
    <BladeFrame
      error={error}
      errorId={errorId}
      title={schema.title}
      required={required}
      disabled={disabled}
      full
      className={`step-effect-${index}`}
      style={wrapperStyle}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        size="small"
        fullWidth
        disabled={disabled}
        options={options}
        getOptionLabel={(v) => labels[v] ?? v}
        value={value.filter((v) => options.includes(v))}
        onChange={(_e, newValue) => onChange(model_id, newValue as string[])}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, i) => {
            const { key, ...tagProps } = getTagProps({ index: i })
            return <Chip key={key} label={labels[option] ?? option} size="small" {...tagProps} />
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={value.length ? '' : 'Full mix'}
            helperText={!hideDesc && schema.description ? schema.description : undefined}
            slotProps={{
              htmlInput: { ...params.inputProps, ...errorAria(errorId, error) },
              input: { ...params.InputProps, disableUnderline: true }
            }}
          />
        )}
        sx={{ flexGrow: 1 }}
      />
    </BladeFrame>
  )
}

export default BladeMultiSelect
