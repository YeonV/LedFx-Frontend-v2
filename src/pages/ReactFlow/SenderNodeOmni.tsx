import { Handle, Position, useEdges } from '@xyflow/react'
import GlobalColorWidget from '../../components/Integrations/Spotify/Widgets/GlobalColorWidget/GlobalColorWidget'

const SenderNodeOmni = ({ id, data }: { id: string, data: { name: string, scope: 'global' | 'scoped', isCollapsed: boolean, onNodeDataChange: (id: string, data: any) => void } }) => {
  const { name, scope, isCollapsed, onNodeDataChange } = data;
  const edges = useEdges();

  const outgoingEdges = edges.filter((edge) => edge.source === id);
  const connectedVirtualIds = outgoingEdges.map((edge) => edge.target);
  const isConnected = connectedVirtualIds.length > 0;

  const handleToggleCollapse = () => {
    if (scope === 'global' || isConnected) {
      onNodeDataChange(id, { isCollapsed: !isCollapsed });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <GlobalColorWidget
        name={name}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        targetIds={scope === 'scoped' ? connectedVirtualIds : undefined}
      />
      {scope === 'scoped' && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  )
}

export default SenderNodeOmni
