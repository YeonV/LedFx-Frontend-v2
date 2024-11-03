import { Slider, Stack } from '@mui/material'
import BladeFrame from '../../../../components/SchemaForm/components/BladeFrame'
import Number from '../../../../components/Number'

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
              value: devices[currentDevice].config.pixel_count - 1,
              label: devices[currentDevice].config.pixel_count - 1
            }
          ]}
          valueLabelDisplay="auto"
          min={0}
          max={devices[currentDevice].config.pixel_count - 1}
          value={selectedPixel}
          onChange={handleSliderChange}
        />
        {
          typeof selectedPixel === 'number' 
          ? <Number min={0} max={devices[currentDevice].config.pixel_count - 1} value={selectedPixel} onChange={(e: any) => handleSliderChange(e, parseInt(e.target.value))} />
          : <Stack direction={'row'} spacing={2}>
              <Number min={0} max={devices[currentDevice].config.pixel_count - 1} value={selectedPixel[0]} onChange={(e) => handleSliderChange(e,[parseInt(e.target.value), selectedPixel[1]], 0)} />
              <Number min={0} max={devices[currentDevice].config.pixel_count - 1} value={selectedPixel[1]} onChange={(e) => handleSliderChange(e,[selectedPixel[0], parseInt(e.target.value)], 1)} />
            </Stack>          
        }
      </Stack>
    </BladeFrame>
  )
}

export default MSlider
