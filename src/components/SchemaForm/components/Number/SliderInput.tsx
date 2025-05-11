import { Slider, Stack, TextField } from '@mui/material'

const SliderInput = ({
  min = 0,
  max = 10000,
  step = 1,
  title,
  value,
  setValue,
  titleWidth = 100,
  units = '',
  sx
}: {
  min?: number
  max?: number
  step?: number
  title?: string
  value: number
  titleWidth?: number
  sx?: any
  units?: string
  setValue: (_v: number) => void
}) => {
  return (
    <Stack direction={'row'} alignItems={'center'} sx={sx}>
      <label style={{ width: title && titleWidth, flexShrink: 0 }}>{title}</label>
      <Slider
        sx={{
          flexGrow: 1
        }}
        value={value}
        onChange={(_e, v) => setValue(v as number)}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={step}
      />
      <TextField
        slotProps={{
          input: {
            disableUnderline: true,
            endAdornment: units
          },
          htmlInput: { style: { textAlign: 'right', width: 130 } }
        }}
        variant="standard"
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </Stack>
  )
}

export default SliderInput
