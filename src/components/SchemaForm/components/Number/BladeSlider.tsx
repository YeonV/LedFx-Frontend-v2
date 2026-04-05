import { useCallback } from 'react'
import { Slider, Input, TextField, Typography, useTheme, Box } from '@mui/material'
import useStyles from './BladeSlider.styles'
import { BladeSliderInnerProps, BladeSliderProps } from './BladeSlider.props'
import { useNumericInput } from '../../../../hooks/useNumericInput'

const BladeSliderInner = ({
  schema = undefined,
  model = undefined,
  model_id = '',
  step = undefined,
  onChange = undefined,
  textfield = undefined,
  style = undefined,
  disabled = undefined,
  marks = undefined,
  hideDesc = undefined,
  full = undefined
}: BladeSliderInnerProps) => {
  const classes = useStyles()
  const theme = useTheme()

  const computedValue =
    model_id && typeof model[model_id] === 'number'
      ? model[model_id]
      : typeof schema.default === 'number'
        ? schema.default
        : 1

  const isInteger = step === 1

  const handleUpstream = useCallback((v: number) => onChange(model_id, v), [model_id, onChange])

  const {
    displayValue,
    handleFocus,
    handleChange: handleInputChange,
    handleBlur,
    setFromSlider
  } = useNumericInput({
    value: computedValue,
    onChange: handleUpstream,
    min: schema.minimum,
    max: schema.maximum,
    step: step || (schema.maximum > 1 ? 0.1 : 0.01),
    isInteger
  })

  const handleSliderChange = useCallback(
    (_event: any, newValue: any) => {
      setFromSlider(newValue as number)
    },
    [setFromSlider]
  )

  // For the text-only path, reuse the same hook handlers
  const handleTextChange = handleInputChange

  return typeof schema.maximum === 'number' && !textfield ? (
    <>
      <div style={{ width: '100%' }}>
        <Slider
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          disabled={disabled}
          step={step || (schema.maximum > 1 ? 0.1 : 0.01)}
          valueLabelFormat={model_id === 'delay_ms' ? `${computedValue}\xa0ms` : `${computedValue}`}
          min={schema.minimum || 0}
          max={schema.maximum}
          value={computedValue}
          onChange={handleSliderChange}
          className={`slider-${full ? 'full' : 'half'}`}
          onChangeCommitted={(_e, b) => handleUpstream(b as number)}
          style={{
            color: '#aaa',
            ...style,
            width: '100%',
            marginBottom: 0.5,
            marginTop: 0.5
          }}
        />
        {!hideDesc && schema.description ? (
          <Typography variant="body2" className="MuiFormHelperText-root">
            {schema.description}{' '}
          </Typography>
        ) : null}
      </div>
      <Input
        disableUnderline
        disabled={disabled}
        className={classes.input}
        style={{
          minWidth: model_id === 'delay_ms' ? 90 : 75,
          textAlign: 'right',
          paddingTop: 0,
          backgroundColor: theme.palette.divider,
          height: 32
        }}
        value={displayValue}
        margin="dense"
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        endAdornment={model_id === 'delay_ms' ? 'ms\xa0' : null}
        inputProps={{
          step: step || (schema.maximum > 1 ? 0.1 : 0.01),
          min: schema.minimum || 0,
          max: schema.maximum,
          type: 'number',
          'aria-labelledby': 'input-slider'
        }}
      />
    </>
  ) : schema.enum && !textfield ? (
    <Slider
      aria-labelledby="input-slider"
      valueLabelDisplay="auto"
      disabled={disabled}
      marks={marks.map((m: any, i: number) => ({
        value: m,
        label: i === 0 || i === marks.length - 1 ? m : ''
      }))}
      step={null}
      min={marks[0]}
      max={marks[marks.length - 1]}
      value={computedValue}
      onChange={handleSliderChange}
      onChangeCommitted={(_e, b) => handleUpstream(b as number)}
      style={{ ...style, width: '100%' }}
    />
  ) : (
    <TextField
      disabled={disabled}
      variant="standard"
      slotProps={{
        input: {
          disableUnderline: true,
          endAdornment: model_id === 'delay_ms' ? 'ms' : null
        }
      }}
      type="number"
      value={displayValue}
      onChange={handleTextChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      helperText={!hideDesc && schema.description}
      style={{
        ...style,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        margin: 0
      }}
    />
  )
}

/**
 * ## Number
 * ### render as `input fields` or `sliders`
 * Renders slider if:
 *
 *  - schema.maximum && !textfield
 *  - schema.enum && !textfield
 */
const BladeSlider = ({
  variant = 'outlined',
  schema = {
    title: 'Slide me'
  },
  model = undefined,
  model_id = '',
  step = undefined,
  onChange = undefined,
  marks = undefined,
  index = undefined,
  required = false,
  textfield = false,
  disabled = false,
  hideDesc = false,
  style = {},
  full = false
}: BladeSliderProps) => {
  const classes = useStyles()
  const theme = useTheme()
  return variant === 'outlined' ? (
    <Box
      className={`${classes.wrapper} step-effect-${index}`}
      sx={[
        {
          ...style,
          border: '1px solid',
          borderColor: theme.palette.divider,

          '& > label': {
            backgroundColor: theme.palette.background.paper
          },

          '& .MuiSliderValueLabel > span': {
            backgroundColor: theme.palette.background.paper
          }
        },
        full
          ? {
              width: '100%'
            }
          : {
              width: style.width
            }
      ]}
    >
      <label
        style={{
          color: disabled ? theme.palette.text.disabled : theme.palette.text.primary
        }}
        className="MuiFormLabel-root"
      >
        {schema.title}
        {required ? '*' : ''}
      </label>
      <BladeSliderInner
        style={style}
        schema={schema}
        model={model}
        model_id={model_id}
        disabled={disabled}
        step={step}
        onChange={onChange}
        textfield={textfield}
        marks={marks}
        hideDesc={hideDesc}
      />
    </Box>
  ) : (
    <BladeSliderInner
      style={style}
      step={step}
      schema={schema}
      model={model}
      model_id={model_id}
      onChange={onChange}
      disabled={disabled}
      textfield={textfield}
      marks={marks}
      hideDesc={hideDesc}
    />
  )
}

export default BladeSlider
