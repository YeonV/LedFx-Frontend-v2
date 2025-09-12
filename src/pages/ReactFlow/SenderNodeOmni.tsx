import { Handle, Position, useEdges } from '@xyflow/react'
import GlobalColorWidget from '../../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget'
import { Paper, Box, Typography } from '@mui/material'

const SenderNodeOmni = ({ id, data }: { id: string, data: { name: string, scope: 'global' | 'scoped', isCollapsed: boolean, onNodeDataChange: (id: string, data: any) => void } }) => {
  const { name, scope, isCollapsed, onNodeDataChange } = data;
  const edges = useEdges();

  const outgoingEdges = edges.filter((edge) => edge.source === id);
  const connectedVirtualIds = outgoingEdges.map((edge) => edge.target);
  const isConnected = connectedVirtualIds.length > 0;

  const handleToggleCollapse = () => {
    onNodeDataChange(id, { isCollapsed: !isCollapsed });
  };

  const showWidget = scope === 'global' || isConnected;
  const displayName = (isCollapsed || scope === 'global') ? name : `Omni Sender: ${name}`;

  return (
    <div style={{ position: 'relative' }}>
      {showWidget ? (
        <GlobalColorWidget
          name={displayName}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          targetIds={scope === 'scoped' ? connectedVirtualIds : undefined}
        />
      ) : (
        <Paper sx={{ width: '300px' }}>
           <Box sx={{ p: 1, bgcolor: '#111', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <strong>{name}</strong>
          </Box>
          <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            Connect to enable
          </Typography>
        </Paper>
      )}

      {scope === 'scoped' && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  )
}

export default SenderNodeOmni
