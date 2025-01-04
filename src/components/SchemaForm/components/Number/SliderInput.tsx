import { Slider, Stack, TextField } from '@mui/material'

const SliderInput = ({
  min = 0,
  max = 10000,
  step = 1,
  title,
  value,
  setValue,
  titleWidth = 100
}: {
  min?: number
  max?: number
  step?: number
  title: string
  value: number
  titleWidth?: number
  setValue: (_v: number) => void
}) => {
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <label style={{ width: titleWidth, flexShrink: 0 }}>{title}</label>
      <Slider
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
            disableUnderline: true
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
