import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import LedFxFlow from './LedFxFlow'

const ReactFlowPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <ReactFlowProvider>
        <LedFxFlow />
      </ReactFlowProvider>
    </div>
  )
}

export default ReactFlowPage
