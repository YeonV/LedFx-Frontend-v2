import React, { useState, useCallback } from 'react'
import TextField from '@mui/material/TextField'

interface NumberProps {
  min: number
  max: number
  value: number
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (_event: React.FocusEvent<HTMLInputElement>) => void
}

const Number: React.FC<NumberProps> = ({ min, max, value, onChange, onBlur }) => {
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleFocus = useCallback(() => {
    setIsEditing(true)
    setInputValue(String(value))
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      setInputValue(rawValue)

      // Only propagate valid numbers
      if (rawValue !== '') {
        const numericValue = parseFloat(rawValue)
        if (!isNaN(numericValue)) {
          onChange(e)
        }
      }
    },
    [onChange]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(false)
      setInputValue('')

      const numericValue = parseFloat(e.target.value)

      // Validate and clamp on blur
      if (isNaN(numericValue) || e.target.value === '') {
        e.target.value = min.toString()
        onChange(e)
      } else if (numericValue > max) {
        e.target.value = max.toString()
        onChange(e)
      } else if (numericValue < min) {
        e.target.value = min.toString()
        onChange(e)
      }

      if (onBlur) {
        onBlur(e)
      }
    },
    [min, max, onChange, onBlur]
  )

  return (
    <TextField
      value={isEditing ? inputValue : value}
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
