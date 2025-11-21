/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

function Toggle({
  onChange,
  title
}: {
  onChange: (value: boolean | 'toggle') => void
  title: string
}) {
  // const [alignment, setAlignment] = React.useState<'on' | 'off' | 'toggle'>('toggle')

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: 'on' | 'off' | 'toggle'
  ) => {
    // setAlignment(newAlignment)
    onChange(newAlignment === 'on' ? true : newAlignment === 'off' ? false : 'toggle')
  }

  return (
    <ToggleButtonGroup
      color="primary"
      // value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      size="small"
      sx={{ flex: 1 }}
    >
      <ToggleButton sx={{ flex: 1 }} value="on">
        On
      </ToggleButton>
      <ToggleButton sx={{ flex: 1 }} value="off">
        Off
      </ToggleButton>
      <ToggleButton sx={{ flex: 1 }} value="toggle">
        Toggle
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default Toggle
