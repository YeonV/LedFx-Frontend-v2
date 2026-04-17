import React, { useCallback } from 'react'
import TextField from '@mui/material/TextField'
import { useNumericInput } from '../hooks/useNumericInput'

interface NumberProps {
  min: number
  max: number
  value: number
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (_event: React.FocusEvent<HTMLInputElement>) => void
}

const Number: React.FC<NumberProps> = ({ min, max, value, onChange, onBlur }) => {
  // Bridge: the hook calls onChange(numericValue), but callers expect onChange(event)
  // We propagate the event directly from handleChange, and wrap blur
  const {
    displayValue,
    handleFocus,
    handleChange: hookHandleChange,
    handleBlur: hookHandleBlur
  } = useNumericInput({
    value,
    onChange: () => {
      // Live upstream handled via event passthrough below
    },
    min,
    max,
    isInteger: true
  })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      hookHandleChange(e)
      // Propagate valid numbers upstream via the original event-based API
      const numericValue = parseFloat(e.target.value)
      if (!isNaN(numericValue) && e.target.value !== '') {
        onChange(e)
      }
    },
    [hookHandleChange, onChange]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      hookHandleBlur(e)
      if (onBlur) onBlur(e)
    },
    [hookHandleBlur, onBlur]
  )

  return (
    <TextField
      value={displayValue}
      name="quantity"
      type="number"
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      slotProps={{
        htmlInput: {
          min,
          max
        }
      }}
    />
  )
}

export default Number
