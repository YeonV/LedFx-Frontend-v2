import { Slider, Stack, TextField } from '@mui/material'
import BladeFrame from '../../../../components/SchemaForm/components/BladeFrame'

const MSlider = ({
  group,
  devices,
  currentDevice,
  selectedPixel,
  handleSliderChange
}: {
  group: boolean
  devices: any
  selectedPixel: number | number[]
  currentDevice: any
  handleSliderChange: any
}) => {
  return (
    <BladeFrame
      title={`Pixel${group ? 's' : ''}`}
      full={false}
      style={{ marginBottom: '1rem' }}
    >
      <Stack direction="column" spacing={2} flex={1} minHeight={120} justifyContent={'space-between'}>
        <Slider
          marks={[
            { value: 0, label: '0' },
            {
              value: devices[currentDevice].config.pixel_count,
              label: devices[currentDevice].config.pixel_count
            }
          ]}
          valueLabelDisplay="auto"
          min={0}
          max={devices[currentDevice].config.pixel_count}
          value={selectedPixel}
          onChange={handleSliderChange}
        />
        {
          typeof selectedPixel === 'number' 
          ? <TextField type='number' variant='outlined' value={selectedPixel} onChange={(e) => handleSliderChange(e, parseInt(e.target.value))} />
          : <Stack direction={'row'} spacing={2}>
              <TextField type='number' variant='outlined' value={selectedPixel[0]} onBlur={(e) => handleSliderChange(e,[parseInt(e.target.value), selectedPixel[1]], 0)} />
              <TextField type='number' variant='outlined' value={selectedPixel[1]} onBlur={(e) => handleSliderChange(e,[selectedPixel[0], parseInt(e.target.value)], 1)} />
            </Stack>          
        }
      </Stack>
    </BladeFrame>
  )
}

export default MSlider
