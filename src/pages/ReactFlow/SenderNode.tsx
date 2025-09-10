import React from 'react';
import { Handle, Position } from '@xyflow/react';
import GlobalColorWidget from '../../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget';
import { Button } from '@mui/material';

const SenderNode = ({ data }: { data: { onPlay: () => void } }) => {
  return (
    <div style={{ border: '1px solid #777', padding: '10px' }}>
      <GlobalColorWidget />
      <Button onClick={data.onPlay}>Play</Button>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default SenderNode;
