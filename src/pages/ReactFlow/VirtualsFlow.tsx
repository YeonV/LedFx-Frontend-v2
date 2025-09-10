import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useStore from '../../store/useStore';

const VirtualsFlow = () => {
  const virtuals = useStore((state) => state.virtuals);
  const getVirtuals = useStore((state) => state.getVirtuals);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    getVirtuals();
  }, [getVirtuals]);

  useEffect(() => {
    const newNodes = Object.values(virtuals).map((virtual, index) => ({
      id: virtual.id,
      position: { x: index * 200, y: 100 },
      data: { label: virtual.config.name },
    }));
    setNodes(newNodes);
  }, [virtuals]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};

export default VirtualsFlow;
