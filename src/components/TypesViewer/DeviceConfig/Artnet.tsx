import React from 'react'
import { ArtnetDeviceConfig } from '../../../api/ledfx.types'

export const Artnet: React.FC<ArtnetDeviceConfig> = (props) => {
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
