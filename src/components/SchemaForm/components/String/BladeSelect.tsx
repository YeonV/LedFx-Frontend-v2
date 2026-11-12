import {
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Typography,
  Alert,
  Link,
  Stack,
  Box,
  Divider
} from '@mui/material'
import { useEffect, useId, useRef, useState } from 'react'
import BladeIcon from '../../../Icons/BladeIcon/BladeIcon'
import BladeFrame, { errorAria } from '../BladeFrame'
import { BladeSelectProps } from './BladeSelect.props'
import { Ledfx } from '../../../../api/ledfx'
import GifPicker from '../Gif/GifPicker'
import GifFramePicker from '../Gif/GifFramePicker'
import {
  enumOptions,
  fromSelectValue,
  NULL_OPTION,
  sourcedOptions,
  sourceOf,
  toSelectValue
} from '../../fields'
import { useInstanceLoaded, useInstanceOptions } from '../../useInstanceOptions'

/**
 * ## String
 * ### render as `input field` or `select`
 * Renders select if the schema is an enum (`enum`, or a single `const`); `nullable` adds a null option
 */
const BladeSelect = ({
  variant = 'outlined',
  disabled = false,
  schema,
  nullable = false,
  model,
  model_id,
  onChange,
  index = 0,
  required = false,
  wrapperStyle = { margin: '0.5rem', flexBasis: '49%', width: 'unset' },
  selectStyle = {},
  textStyle = {},
  menuItemStyle = {},
  hideDesc = false,
  children,
  type,
  error
}: BladeSelectProps) => {
  const inputRef = useRef<any>(null)
  const errorId = useId()
  const aria = errorAria(errorId, error)
  const [showReserved, setShowReserved] = useState(false)
  const instances = useInstanceOptions(sourceOf(schema))
  const loaded = useInstanceLoaded(sourceOf(schema))
  const current = model && model_id ? model[model_id] : undefined
  const options = enumOptions(
    schema,
    nullable,
    sourcedOptions(schema, instances, current, required, loaded)
  )
  const [icon, setIcon] = useState(
    schema.id === 'icon_name' ? (model && model_id && model[model_id]) || options?.[0]?.value : ''
  )
  useEffect(() => {
    const v = model && model_id ? model[model_id] : undefined
    if (v != null && inputRef.current) inputRef.current.value = v
  }, [model, model_id])
  // MUI Select can't hold null: a null option (and a null value, when there is one) is NULL_OPTION
  const selectValue = toSelectValue(options, current, schema.default)
  const pick = (v: unknown) => onChange(model_id, fromSelectValue(v))
  const items = (style?: any) =>
    options?.map((o, i) => (
      <MenuItem
        key={`${o.value}-${i}`}
        value={(o.value === null ? NULL_OPTION : o.value) as any}
        style={style}
      >
        {o.label}
      </MenuItem>
    ))
  // console.log(schema, model)
  return (
    <BladeFrame
      error={error}
      errorId={errorId}
      title={schema.title}
      tooltip={
        schema.title === 'Icon Name' ? (
          <Box p={1}>
            <Typography variant="h5">Icon Libraries:</Typography>
            <Stack spacing={0.5} mt={1}>
              <Stack direction={'row'} spacing={2}>
                <Typography color="textDisabled" variant="body1">
                  Link
                </Typography>
                <Typography color="textDisabled" variant="body1">
                  Format
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} spacing={1} sx={{ pt: 0.5 }}>
                <Typography variant="body1">
                  <Link
                    href="https://mui.com/material-ui/material-icons/"
                    target="_blank"
                    sx={{ mr: 1 }}
                  >
                    MUI
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    background: '#222',
                    padding: '2px 10px',
                    borderRadius: 1,
                    fontFamily: 'monospace'
                  }}
                >
                  iconName
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="body1">
                  <Link href="https://pictogrammers.com/library/mdi" target="_blank" sx={{ mr: 1 }}>
                    MDI
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    background: '#222',
                    padding: '2px 10px',
                    borderRadius: 1,
                    fontFamily: 'monospace'
                  }}
                >
                  mdi:icon-name
                </Typography>
              </Stack>
            </Stack>
          </Box>
        ) : (
          ''
        )
      }
      className={`step-effect-${index}`}
      full={!(options?.length && options.every((o) => o.label.length < 20))}
      required={required}
      style={{
        // default first, caller last: a wrapperStyle asking for a full-width
        // field was previously overruled by the hard-coded flexBasis
        flexBasis: schema.title === 'Name' ? '100%' : '49%',
        ...wrapperStyle
      }}
    >
      {variant === 'contained' ? (
        options ? (
          <Select
            variant="filled"
            disabled={disabled}
            SelectDisplayProps={aria}
            style={{
              flexGrow: 'unset',
              ...(selectStyle as any)
            }}
            defaultValue={schema.default}
            value={selectValue}
            onChange={(e) => pick(e.target.value)}
          >
            {children || items()}
          </Select>
        ) : (
          <>
            <TextField
              variant="standard"
              disabled={disabled}
              helperText={!hideDesc && schema.description}
              slotProps={{
                htmlInput: aria,
                input: { disableUnderline: true }
              }}
              defaultValue={current ?? schema.default ?? ''}
              onBlur={(e) => onChange(model_id, e.target.value)}
              style={textStyle as any}
            />
          </>
        )
      ) : options ? (
        <Select
          variant="standard"
          disableUnderline
          disabled={disabled}
          SelectDisplayProps={aria}
          style={{
            flexGrow: variant === 'outlined' ? 1 : 'unset',
            ...(selectStyle as any)
          }}
          defaultValue={schema.default}
          value={selectValue}
          onChange={(e) => pick(e.target.value)}
        >
          {items(menuItemStyle)}
        </Select>
      ) : (
        <>
          <TextField
            variant="standard"
            disabled={disabled}
            inputRef={inputRef}
            type={schema.description?.includes('password') ? 'password' : 'unset'}
            helperText={!hideDesc && schema.description}
            slotProps={{
              htmlInput: aria,
              input:
                schema.id === 'icon_name'
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">
                          <BladeIcon name={icon} style={{ color: '#eee' }} />
                        </InputAdornment>
                      ),
                      disableUnderline: true
                    }
                  : { disableUnderline: true }
            }}
            key={
              schema.id === 'beat_frames'
                ? `beat_frames-${model?.beat_frames || 'empty'}`
                : undefined
            }
            defaultValue={current ?? schema.default ?? ''}
            onBlur={(e) => onChange(model_id, e.target.value)}
            onChange={(e) => {
              if (schema.id === 'icon_name') setIcon(e.target.value)
              const reservedParts = ['gap-', '-background', '-foreground', '-mask']
              if (
                schema.title === 'Name' &&
                reservedParts.some(
                  (part) => e.target.value.startsWith(part) || e.target.value.endsWith(part)
                )
              ) {
                setShowReserved(true)
                inputRef.current.value = e.target.value.replace(
                  /(gap-|-background|-foreground|-mask)/g,
                  ''
                )
              } else {
                setShowReserved(false)
                inputRef.current.value = e.target.value
              }
            }}
            style={textStyle as any}
          />
          {showReserved && (
            <Alert
              severity="warning"
              onClick={() => setShowReserved(!showReserved)}
              sx={{ marginTop: 1, width: '400px' }}
            >
              <Typography variant="caption">Reserved word removed</Typography>
            </Alert>
          )}
          {schema.id === 'image_location' && (
            <GifPicker
              value={model && model_id ? model[model_id] : ''}
              onChange={(gif: string) => {
                onChange(model_id, gif)
              }}
            />
          )}
          {schema.id === 'image_source' && (
            <GifPicker
              mode="static"
              value={model && model_id ? model[model_id] : ''}
              onChange={(filename: string) => {
                onChange(model_id, filename)
              }}
            />
          )}
          {schema.id === 'beat_frames' && model.image_location && model.image_location !== '' && (
            <GifFramePicker
              model={model}
              onChange={(gif: string) => {
                // Update the input field value
                if (inputRef.current) {
                  inputRef.current.value = gif
                }
                // Directly call onChange to persist the change to backend
                onChange(model_id, gif)
              }}
            />
          )}
          {model_id === 'auth_token' && type === 'nanoleaf' && (
            <Tooltip
              title={
                model.ip_address === undefined || model.ip_address === ''
                  ? 'please enter ip address of nanoleaf controller'
                  : 'please hold power on nanoleaf controller for 7 seconds until white leds scan left to right and then press this button to acquire auth token'
              }
            >
              <Button
                sx={{
                  fontSize: 10,
                  height: 56,
                  color:
                    model.ip_address === undefined || model.ip_address === '' ? 'grey' : 'inherit'
                }}
                onClick={async () => {
                  if (model.ip_address === undefined || model.ip_address === '') return
                  const res = await Ledfx('/api/get_nanoleaf_token', 'POST', {
                    ip_address: model.ip_address,
                    port: model.port || 16021
                  })
                  const auth_token = res?.auth_token
                  if (!auth_token) return
                  onChange(model_id, auth_token)
                  inputRef.current.value = auth_token
                }}
              >
                Get Token
              </Button>
            </Tooltip>
          )}
        </>
      )}
    </BladeFrame>
  )
}

export default BladeSelect
