import React, { useState } from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import LedFxFlow from './LedFxFlow'

const ReactFlowPage = () => {
  const [selectedView, setSelectedView] = useState('ledfx')
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedView(event.target.value as string)
  }

  return (
    <div style={{ padding: '20px' }}>
      <FormControl fullWidth>
        <InputLabel id="view-select-label">Select View</InputLabel>
        <Select
          labelId="view-select-label"
          id="view-select"
          value={selectedView}
          label="Select View"
          onChange={handleChange}
        >
          <MenuItem value="ledfx">LedFx Control</MenuItem>
        </Select>
      </FormControl>

      {selectedView === 'ledfx' && <LedFxFlow />}
    </div>
  )
}

export default ReactFlowPage
