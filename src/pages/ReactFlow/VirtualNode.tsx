import React from 'react';
import { Handle, Position } from '@xyflow/react';

const VirtualNode = ({ data }: { data: { label: string } }) => {
  return (
    <div style={{ border: '1px solid #777', padding: '10px' }}>
      <div>{data.label}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default VirtualNode;
