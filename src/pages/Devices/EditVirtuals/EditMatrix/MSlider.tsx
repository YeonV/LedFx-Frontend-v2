import { Slider, Stack } from '@mui/material'
import { useCallback, useMemo } from 'react'
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
  const pixelCount = devices[currentDevice].config.pixel_count

  const marks = useMemo(
    () => [
      { value: 0, label: '0' },
      { value: pixelCount - 1, label: pixelCount - 1 }
    ],
    [pixelCount]
  )

  const handleSingleChange = useCallback(
    (e: any) => handleSliderChange(e, parseInt(e.target.value)),
    [handleSliderChange]
  )

  const handleStartChange = useCallback(
    (e: any) => {
      if (Array.isArray(selectedPixel)) {
        handleSliderChange(e, [parseInt(e.target.value), selectedPixel[1]], 0)
      }
    },
    [handleSliderChange, selectedPixel]
  )

  const handleEndChange = useCallback(
    (e: any) => {
      if (Array.isArray(selectedPixel)) {
        handleSliderChange(e, [selectedPixel[0], parseInt(e.target.value)], 1)
      }
    },
    [handleSliderChange, selectedPixel]
  )
  return (
    <BladeFrame title={`Pixel${group ? 's' : ''}`} full={false} style={{ marginBottom: '1rem' }}>
      <Stack
        direction="column"
        spacing={2}
        flex={1}
        minHeight={120}
        justifyContent={'space-between'}
      >
        <Slider
          marks={marks}
          valueLabelDisplay="auto"
          min={0}
          max={pixelCount - 1}
          value={selectedPixel}
          onChange={handleSliderChange}
        />
        {typeof selectedPixel === 'number' ? (
          <Number
            min={0}
            max={pixelCount - 1}
            value={selectedPixel}
            onChange={handleSingleChange}
          />
        ) : (
          <Stack direction={'row'} spacing={2}>
            <Number
              min={0}
              max={pixelCount - 1}
              value={selectedPixel[0]}
              onChange={handleStartChange}
            />
            <Number
              min={0}
              max={pixelCount - 1}
              value={selectedPixel[1]}
              onChange={handleEndChange}
            />
          </Stack>
        )}
      </Stack>
    </BladeFrame>
  )
}

export default MSlider
