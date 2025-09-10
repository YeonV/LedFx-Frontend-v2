import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import VirtualsFlow from './VirtualsFlow';
import LedFxFlow from './LedFxFlow';

const ReactFlowPage = () => {
  const [selectedView, setSelectedView] = useState('virtuals');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedView(event.target.value as string);
  };

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
          <MenuItem value="virtuals">Virtuals</MenuItem>
          <MenuItem value="ledfx">LedFx Control</MenuItem>
        </Select>
      </FormControl>

      {selectedView === 'virtuals' && <VirtualsFlow />}
      {selectedView === 'ledfx' && <LedFxFlow />}
    </div>
  );
};

export default ReactFlowPage;
