/* eslint-disable @typescript-eslint/indent */
import { Select, MenuItem, TextField, InputAdornment } from '@mui/material'
import { useState } from 'react'
import BladeIcon from '../../../Icons/BladeIcon/BladeIcon'
import BladeFrame from '../BladeFrame'
import { BladeSelectDefaultProps, BladeSelectProps } from './BladeSelect.props'

/**
 * ## String
 * ### render as `input field` or `select`
 * Renders select if schema.enum is defined properly
 */
const BladeSelect = ({
  variant = 'outlined',
  disabled = false,
  schema,
  model,
  model_id,
  onChange,
  index,
  required = false,
  wrapperStyle = { margin: '0.5rem', flexBasis: '49%', width: 'unset' },
  selectStyle = {},
  textStyle = {},
  menuItemStyle = {},
  hideDesc,
  children
}: BladeSelectProps) => {
  const [icon, setIcon] = useState(
    schema.id === 'icon_name'
      ? (model && model_id && model[model_id]) ||
          (schema.enum && schema.enum[0])
      : ''
  )
  return (
    <BladeFrame
      title={schema.title}
      className={`step-effect-${index}`}
      full={
        !(
          schema.enum &&
          schema.enum.length &&
          Object.values(schema.enum).every((a: any) => a?.length < 20)
        )
      }
      required={required}
      style={{
        ...wrapperStyle,
        flexBasis: schema.title === 'Name' ? '100%' : '49%'
      }}
    >
      {variant === 'contained' ? (
        schema.enum ? (
          <Select
            variant="filled"
            disabled={disabled}
            style={{
              flexGrow: 'unset',
              ...(selectStyle as any)
            }}
            defaultValue={schema.default}
            value={
              (model && model_id && model[model_id]) ||
              schema.default ||
              schema.enum[0]
            }
            onChange={(e) => onChange(model_id, e.target.value)}
          >
            {children ||
              schema.enum.map((item: any, i: number) => (
                <MenuItem key={`${i}-${i}`} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        ) : (
          <TextField
            helperText={!hideDesc && schema.description}
            defaultValue={
              (model && model_id && model[model_id]) ||
              (schema.enum && schema.enum[0]) ||
              schema.default ||
              ''
            }
            onBlur={(e) => onChange(model_id, e.target.value)}
            style={textStyle as any}
          />
        )
      ) : schema.enum && Array.isArray(schema.enum) ? (
        <Select
          disabled={disabled}
          style={{
            flexGrow: variant === 'outlined' ? 1 : 'unset',
            ...(selectStyle as any)
          }}
          defaultValue={schema.default}
          value={
            (model && model_id && model[model_id]) ||
            schema.default ||
            schema.enum[0]
          }
          onChange={(e) => onChange(model_id, e.target.value)}
        >
          {schema.enum.map((item: any, i: number) => (
            <MenuItem key={i} value={item} style={menuItemStyle as any}>
              {item}
            </MenuItem>
          ))}
        </Select>
      ) : schema.enum && !Array.isArray(schema.enum) ? (
        <Select
          disabled={disabled}
          style={{
            flexGrow: variant === 'outlined' ? 1 : 'unset',
            ...(selectStyle as any)
          }}
          defaultValue={schema.default}
          value={
            (model && model_id && schema.enum[model[model_id]]) ||
            schema.default ||
            schema.enum[0]
          }
          onChange={(e) =>
            onChange(
              model_id,
              parseInt(
                Object.keys(schema.enum).find(
                  (en) => schema.enum[en] === e.target.value
                ) || '0',
                10
              )
            )
          }
        >
          {Object.keys(schema.enum).map((item, i) => (
            <MenuItem key={i} value={schema.enum[item]}>
              {schema.enum[item]}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          type={schema.description?.includes('password') ? 'password' : 'unset'}
          helperText={!hideDesc && schema.description}
          InputProps={
            schema.id === 'icon_name'
              ? {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BladeIcon name={icon} style={{ color: '#eee' }} />
                    </InputAdornment>
                  )
                }
              : {}
          }
          defaultValue={
            (model && model_id && model[model_id]) ||
            (schema.enum && schema.enum[0]) ||
            schema.default ||
            ''
          }
          onBlur={(e) => onChange(model_id, e.target.value)}
          onChange={(e) => {
            if (schema.id === 'icon_name') setIcon(e.target.value)
          }}
          style={textStyle as any}
        />
      )}
    </BladeFrame>
  )
}

BladeSelect.defaultProps = BladeSelectDefaultProps

export default BladeSelect
