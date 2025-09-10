import { Handle, Position } from '@xyflow/react'
import GlobalColorWidget from '../../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget'
import { IconButton } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'

const SenderNodeOmni = ({ id, data }: { id: string, data: { name: string, isCollapsed: boolean, onNodeDataChange: (id: string, data: any) => void, onPlay: () => void } }) => {
  const { name, isCollapsed, onNodeDataChange, onPlay } = data;
  return (
    <div style={{ position: 'relative' }}>
      <IconButton sx={{ position: 'absolute', top: 5, right: 15 }} onClick={onPlay}>
        <PlayArrow />
      </IconButton>
      <GlobalColorWidget
        name={name}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => onNodeDataChange(id, { isCollapsed: !isCollapsed })}
      />
      {/* <Handle type="source" position={Position.Left} /> */}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default SenderNodeOmni
