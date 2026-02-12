import { useEffect, useState, useCallback, useMemo } from 'react'
import { useThrottledCallback } from 'use-debounce'
import Slider from '@mui/material/Slider'
import { Stack, TextField, Typography } from '@mui/material'
import useStore from '../../../store/useStore'

interface PixelSliderProps {
  s: [string, number, number]
  handleRangeSegment: (start: number, end: number) => void
}

const PixelSlider = ({ s, handleRangeSegment }: PixelSliderProps) => {
  const devices = useStore((state) => state.devices)
  const device = devices[s[0]]
  const pixelCount = device?.config?.pixel_count || 0

  const [range, setRange] = useState([s[1], s[2]])
  const [startInput, setStartInput] = useState('')
  const [endInput, setEndInput] = useState('')
  const [isEditingStart, setIsEditingStart] = useState(false)
  const [isEditingEnd, setIsEditingEnd] = useState(false)

  const handleChange = useCallback(
    (_event: any, newValue: any) => {
      handleRangeSegment(newValue[0], newValue[1])
    },
    [handleRangeSegment]
  )

  const throttled = useThrottledCallback(handleChange, 100)

  const marks = useMemo(
    () => [
      { value: 0, label: 1 },
      {
        value: pixelCount - 1,
        label: pixelCount
      }
    ],
    [pixelCount]
  )

  useEffect(() => {
    setRange([s[1], s[2]])
  }, [s])

  const handleStartFocus = useCallback(() => {
    setIsEditingStart(true)
    setStartInput(String(range[0] + 1))
  }, [range])

  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawValue = e.target.value
      setStartInput(rawValue)

      if (rawValue !== '') {
        const parsedValue = parseInt(rawValue, 10)
        if (!isNaN(parsedValue)) {
          const clampedValue = Math.max(1, Math.min(range[1] + 1, parsedValue))
          const zeroIndexed = clampedValue - 1
          setRange([zeroIndexed, range[1]])
          handleChange(e, [zeroIndexed, range[1]])
        }
      }
    },
    [range, handleChange]
  )

  const handleStartBlur = useCallback(() => {
    setIsEditingStart(false)
    setStartInput('')

    let newStart = range[0]
    // Validate and fix if needed
    if (newStart < 0 || newStart >= range[1]) {
      newStart = Math.max(0, Math.min(range[1] - 1, newStart))
      setRange([newStart, range[1]])
      handleChange(null, [newStart, range[1]])
    }
  }, [range, handleChange])

  const handleEndFocus = useCallback(() => {
    setIsEditingEnd(true)
    setEndInput(String(range[1] + 1))
  }, [range])

  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawValue = e.target.value
      setEndInput(rawValue)

      if (rawValue !== '') {
        const parsedValue = parseInt(rawValue, 10)
        if (!isNaN(parsedValue)) {
          const clampedValue = Math.max(range[0] + 1, Math.min(pixelCount, parsedValue))
          const zeroIndexed = clampedValue - 1
          setRange([range[0], zeroIndexed])
          handleChange(e, [range[0], zeroIndexed])
        }
      }
    },
    [range, pixelCount, handleChange]
  )

  const handleEndBlur = useCallback(() => {
    setIsEditingEnd(false)
    setEndInput('')

    let newEnd = range[1]
    // Validate and fix if needed
    if (newEnd <= range[0] || newEnd >= pixelCount) {
      newEnd = Math.max(range[0] + 1, Math.min(pixelCount - 1, newEnd))
      setRange([range[0], newEnd])
      handleChange(null, [range[0], newEnd])
    }
  }, [range, pixelCount, handleChange])

  const handleSliderChange = useCallback(
    (_event: Event, n: number | number[]) => {
      const newRange = n as number[]
      setRange(newRange)
      throttled(_event, newRange)
    },
    [throttled]
  )

  if (!device) {
    return null
  }

  return (
    <Stack direction="row" spacing={5} alignItems="flex-start" flexBasis="100%">
      <Stack direction="column" spacing={1} alignItems="flex-start">
        <Typography color="textSecondary" marginTop={1} marginBottom={-1}>
          {range[1] - range[0] + 1} LEDs
        </Typography>
        <Stack direction="row" spacing={1} alignItems="flex-start" alignSelf="flex-end">
          <TextField
            size="small"
            type="number"
            sx={{ minWidth: '90px' }}
            slotProps={{
              htmlInput: {
                style: { padding: '4.5px 8px 4.5px 14px' },
                min: 1,
                max: pixelCount
              }
            }}
            value={isEditingStart ? startInput : range[0] + 1}
            onFocus={handleStartFocus}
            onChange={handleStartChange}
            onBlur={handleStartBlur}
          />
          <TextField
            size="small"
            type="number"
            sx={{ minWidth: '90px' }}
            slotProps={{
              htmlInput: {
                style: { padding: '4.5px 8px 4.5px 14px' },
                min: range[0] + 1,
                max: pixelCount
              }
            }}
            value={isEditingEnd ? endInput : range[1] + 1}
            onFocus={handleEndFocus}
            onChange={handleEndChange}
            onBlur={handleEndBlur}
          />
        </Stack>
      </Stack>
      <Slider
        sx={{ alignSelf: 'center' }}
        value={range}
        marks={marks}
        valueLabelFormat={(e) => e + 1}
        min={0}
        max={pixelCount - 1}
        onChange={handleSliderChange}
        aria-labelledby="range-slider"
        valueLabelDisplay="auto"
      />
    </Stack>
  )
}

export default PixelSlider
