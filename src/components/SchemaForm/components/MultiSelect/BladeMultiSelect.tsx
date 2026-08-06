import { Autocomplete, Chip, TextField } from '@mui/material'
import BladeFrame from '../BladeFrame'

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
  wrapperStyle = { margin: '0.5rem 0', width: '100%' }
}: BladeMultiSelectProps) => {
  const options: string[] = schema.enum || []
  const raw = model && model_id ? model[model_id] : undefined
  // Tolerate a scalar or a missing value so a half-migrated config still renders
  const value: string[] = Array.isArray(raw) ? raw : raw ? [raw] : []

  return (
    <BladeFrame
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
        value={value.filter((v) => options.includes(v))}
        onChange={(_e, newValue) => onChange(model_id, newValue as string[])}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, i) => {
            const { key, ...tagProps } = getTagProps({ index: i })
            return <Chip key={key} label={option} size="small" {...tagProps} />
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={value.length ? '' : 'Full mix'}
            helperText={!hideDesc && schema.description ? schema.description : undefined}
            slotProps={{
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
