import { useEffect, useState } from 'react'
import { useThrottledCallback } from 'use-debounce'
import Slider from '@mui/material/Slider'
import useStore from '../../../store/useStore'

const PixelSlider = ({ s, handleRangeSegment }: any) => {
  const getDevices = useStore((state) => state.getDevices)
  const devices = useStore((state) => state.devices)

  const [range, setRange] = useState([s[1], s[2]])

  useEffect(() => {
    getDevices()
  }, [getDevices])

  useEffect(() => {
    setRange([s[1], s[2]])
  }, [s])

  if (!devices[s[0]]) {
    return null
  }

  const pixelRange = [s[1], s[2]]

  const handleChange = (_event: any, newValue: any) => {
    if (newValue !== pixelRange) {
      handleRangeSegment(newValue[0], newValue[1])
    }
  }
  const throttled = useThrottledCallback(handleChange, 100)

  const marks = [
    { value: 0, label: 1 },
    {
      value: devices[s[0]].config.pixel_count - 1,
      label: devices[s[0]].config.pixel_count,
    },
  ]

  return (
    <Slider
      value={range}
      marks={marks}
      valueLabelFormat={(e) => e + 1}
      min={0}
      max={devices[s[0]].config.pixel_count - 1}
      onChange={(_event: any, n: any) => {
        setRange(n)
        throttled(_event, n)
      }}
      aria-labelledby="range-slider"
      valueLabelDisplay="auto"
    />
  )
}

export default PixelSlider
