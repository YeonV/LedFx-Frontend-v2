import React from 'react'
import { DdpDeviceConfig } from '../../../api/ledfx.types'

export const DDP: React.FC<DdpDeviceConfig> = (props) => {
  return (
    <pre
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        background: '#f0f0f0',
        padding: '1em',
        borderRadius: '4px'
      }}
    >
      <code>{JSON.stringify(props, null, 2)}</code>
    </pre>
  )
}
