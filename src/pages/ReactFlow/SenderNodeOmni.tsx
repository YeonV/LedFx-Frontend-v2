import { Handle, Position } from '@xyflow/react'
import GlobalColorWidget from '../../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget'
import { IconButton } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'

const SenderNodeOmni = ({ data }: { data: { onPlay: () => void } }) => {
  return (
    <div style={{ position: 'relative' }}>
      <IconButton sx={{ position: 'absolute', top: 5, right: 15 }} onClick={data.onPlay}>
        <PlayArrow />
      </IconButton>
      <GlobalColorWidget />
      {/* <Handle type="source" position={Position.Left} /> */}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default SenderNodeOmni
