import { Handle, Position } from '@xyflow/react'
import useStore from '../../store/useStore'
import DeviceCard from '../Devices/DeviceCard/DeviceCard.wrapper'

const VirtualNode = ({ data }: { data: { label: string } }) => {
  const virtuals = useStore((state) => state.virtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)

  const filteredVirtuals = virtuals
    ? Object.keys(virtuals)
        .filter((v) =>
          showComplex
            ? v
            : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
        )
        .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
        .map((v) => virtuals[v])
    : []

  const virtual = filteredVirtuals.find((v) => v.config.name === data.label)?.id || ''

  return (
    <div style={{ width: '400px' }}>
      <DeviceCard virtual={virtual} index={0} />
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default VirtualNode
