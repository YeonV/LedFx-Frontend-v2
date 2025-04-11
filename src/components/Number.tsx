import React from 'react'
import TextField from '@mui/material/TextField'

interface NumberProps {
  min: number
  max: number
  value: number
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (_event: React.FocusEvent<HTMLInputElement>) => void
}

const Number: React.FC<NumberProps> = ({
  min,
  max,
  value,
  onChange,
  onBlur
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value)

    if (!isNaN(numericValue)) {
      if (numericValue > max) {
        e.target.value = max.toString()
      } else if (numericValue < min) {
        e.target.value = min.toString()
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value)
    if (isNaN(numericValue) || e.target.value === '') {
      e.target.value = min.toString()
      onChange(e)
    }

    if (onBlur) {
      onBlur(e)
    }
  }

  return (
    <TextField
      value={value}
      name="quantity"
      type="number"
      onChange={onChange}
      onInput={handleInput}
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
