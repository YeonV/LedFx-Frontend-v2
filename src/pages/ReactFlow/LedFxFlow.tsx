import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  getConnectedEdges,
  getOutgoers
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import useStore from '../../store/useStore'
import SenderNodeOmni from './SenderNodeOmni'
import SenderNodeEffect from './SenderNodeEffect'
import VirtualNode from './VirtualNode'
import { Button } from '@mui/material'

const nodeTypes = {
  sender: SenderNodeOmni,
  sendereffect: SenderNodeEffect,
  virtual: VirtualNode
}

let senderId = 1

const LedFxFlow = () => {
  const virtuals = useStore((state) => state.virtuals)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphsMulti)
  const graphsMulti = useStore((state) => state.graphsMulti)

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const handlePlay = useCallback((senderId: string) => {
    const senderNodeOmni = nodesRef.current.find((node) => node.id === senderId)
    if (!senderNodeOmni) return

    const connectedEdges = getConnectedEdges([senderNodeOmni], edgesRef.current)
    const outgoers = getOutgoers(senderNodeOmni, nodesRef.current, edgesRef.current)

    console.log('Sender:', senderNodeOmni)
    console.log('Connected virtuals:', outgoers)
    console.log('Connected edges:', connectedEdges)
  }, [])

  useEffect(() => {
    getVirtuals()
  }, [getVirtuals])

  useEffect(() => {
    const savedNodesJSON = localStorage.getItem('ledfx-flow-nodes');
    const savedEdgesJSON = localStorage.getItem('ledfx-flow-edges');

    const filteredVirtuals = virtuals
      ? Object.keys(virtuals)
          .filter((v) =>
            showComplex
              ? v
              : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
          )
          .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
          .map((v) => virtuals[v])
      : [];

    if (savedNodesJSON && savedNodesJSON !== '[]') {
      const savedNodes = JSON.parse(savedNodesJSON);
      const savedEdges = savedEdgesJSON ? JSON.parse(savedEdgesJSON) : [];

      const filteredVirtualIds = new Set(filteredVirtuals.map(v => v.id));
      const savedNodeIds = new Set(savedNodes.map(n => n.id));

      let reconciledNodes = savedNodes.filter(node =>
        node.type.startsWith('sender') || filteredVirtualIds.has(node.id)
      );

      const newVirtuals = filteredVirtuals.filter(v => !savedNodeIds.has(v.id));
      const newVirtualNodes = newVirtuals.map((virtual, index) => ({
        id: virtual.id,
        type: 'virtual',
        position: { x: 500, y: 100 + (filteredVirtuals.length + index) * 180 },
        data: { label: virtual.config.name }
      }));

      reconciledNodes = [...reconciledNodes, ...newVirtualNodes];

      reconciledNodes.forEach(node => {
        if (node.type.startsWith('sender')) {
          node.data = { ...node.data, onPlay: () => handlePlay(node.id) };
        }
      });

      setNodes(reconciledNodes);

      const reconciledNodeIds = new Set(reconciledNodes.map(n => n.id));
      const reconciledEdges = savedEdges.filter(edge =>
        reconciledNodeIds.has(edge.source) && reconciledNodeIds.has(edge.target)
      );
      setEdges(reconciledEdges);

    } else {
      const initialNodes: Node[] = [
        {
          id: `sender-${senderId}`,
          type: 'sender',
          position: { x: 100, y: 100 },
          data: { onPlay: () => handlePlay(`sender-${senderId}`) }
        },
        {
          id: `sendereffect-${senderId}`,
          type: 'sendereffect',
          position: { x: 100, y: 250 },
          data: { onPlay: () => handlePlay(`sendereffect-${senderId}`) }
        },
        ...filteredVirtuals.map((virtual, index) => ({
          id: virtual.id,
          type: 'virtual',
          position: { x: 500, y: 100 + index * 180 },
          data: { label: virtual.config.name }
        }))
      ];
      if (filteredVirtuals.length > 0 || (savedNodesJSON === '[]' && nodes.length === 0)) {
          setNodes(initialNodes);
          setEdges([]);
      }
    }
  }, [virtuals, showComplex, showGaps, handlePlay]);

  useEffect(() => {
    if (graphs && graphsMulti) {
      setPixelGraphs(
        Object.keys(virtuals)
          .filter((v) =>
            showComplex
              ? v
              : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background'))
          )
          .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
      )
    } else {
      setPixelGraphs([])
    }
    return () => {
      setPixelGraphs([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphs, graphsMulti, setPixelGraphs])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  useEffect(() => {
    localStorage.setItem('ledfx-flow-nodes', JSON.stringify(nodes));
    localStorage.setItem('ledfx-flow-edges', JSON.stringify(edges));
  }, [nodes, edges]);

  const addSenderNodeOmni = () => {
    senderId++
    const newNode = {
      id: `sender-${senderId}`,
      type: 'sender',
      position: {
        x: 100,
        y: 100 + (Object.keys(nodes).length + 1) * 50
      },
      data: { onPlay: () => handlePlay(`sender-${senderId}`) }
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addSenderNodeEffect = () => {
    senderId++
    const newNode = {
      id: `sendereffect-${senderId}`,
      type: 'sendereffect',
      position: {
        x: 100,
        y: 100 + (Object.keys(nodes).length + 1) * 50
      },
      data: { onPlay: () => handlePlay(`sendereffect-${senderId}`) }
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const handleClear = () => {
    localStorage.removeItem('ledfx-flow-nodes');
    localStorage.removeItem('ledfx-flow-edges');
    window.location.reload();
  }

  return (
    <div style={{ height: 'calc(100vh - 208px)', overflow: 'hidden' }}>
      <Button onClick={addSenderNodeOmni} variant="contained">
        Add Sender Omni
      </Button>
      <Button onClick={addSenderNodeEffect} variant="contained">
        Add Sender Effect
      </Button>
      <Button onClick={handleClear} variant="contained" color="secondary">
        Clear
      </Button>

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
  )
}

export default LedFxFlow
