import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, getConnectedEdges, getOutgoers } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useStore from '../../store/useStore';
import SenderNode from './SenderNode';
import VirtualNode from './VirtualNode';
import { Button } from '@mui/material';

const nodeTypes = {
  sender: SenderNode,
  virtual: VirtualNode,
};

let senderId = 1;

const LedFxFlow = () => {
  const virtuals = useStore((state) => state.virtuals);
  const getVirtuals = useStore((state) => state.getVirtuals);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handlePlay = (senderId: string) => {
    const senderNode = nodes.find((node) => node.id === senderId);
    if (!senderNode) return;

    const connectedEdges = getConnectedEdges([senderNode], edges);
    const outgoers = getOutgoers(senderNode, nodes, edges);

    console.log('Sender:', senderNode);
    console.log('Connected virtuals:', outgoers);
  };

  useEffect(() => {
    getVirtuals();
  }, [getVirtuals]);

  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: `sender-${senderId}`,
        type: 'sender',
        position: { x: 100, y: 100 },
        data: { onPlay: () => handlePlay(`sender-${senderId}`) },
      },
      ...Object.values(virtuals).map((virtual, index) => ({
        id: virtual.id,
        type: 'virtual',
        position: { x: 500, y: 100 + index * 100 },
        data: { label: virtual.config.name },
      })),
    ];
    setNodes(initialNodes);
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

  const addSenderNode = () => {
    senderId++;
    const newNode = {
      id: `sender-${senderId}`,
      type: 'sender',
      position: {
        x: 100,
        y: 100 + (Object.keys(nodes).length + 1) * 50,
      },
      data: { onPlay: () => handlePlay(`sender-${senderId}`) },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div style={{ height: '500px' }}>
      <Button onClick={addSenderNode} variant="contained">Add Sender</Button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
};

export default LedFxFlow;
