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

    const VIRTUAL_NODE_WIDTH = 400;
    const VIRTUAL_NODE_HEIGHT = 160;
    const HORIZONTAL_SPACING = 50;
    const VERTICAL_SPACING = 20;
    const SENDER_AREA_WIDTH = 500;
    const COLUMNS = 3;

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
      const savedNodes = JSON.parse(savedNodesJSON) as Node[];
      const savedEdges = savedEdgesJSON ? JSON.parse(savedEdgesJSON) as Edge[] : [];

      const filteredVirtualIds = new Set(filteredVirtuals.map(v => v.id));
      const savedNodeIds = new Set(savedNodes.map(n => n.id));

      let reconciledNodes = savedNodes.filter(node =>
        node.type?.startsWith('sender') || filteredVirtualIds.has(node.id)
      );

      const newVirtuals = filteredVirtuals.filter(v => !savedNodeIds.has(v.id));
      const newVirtualNodes = newVirtuals.map((virtual, index) => {
        const nodeIndex = reconciledNodes.filter(n => n.type === 'virtual').length + index;
        const row = Math.floor(nodeIndex / COLUMNS);
        const col = nodeIndex % COLUMNS;
        const x = SENDER_AREA_WIDTH + col * (VIRTUAL_NODE_WIDTH + HORIZONTAL_SPACING);
        const y = row * (VIRTUAL_NODE_HEIGHT + VERTICAL_SPACING);
        return {
          id: virtual.id,
          type: 'virtual',
          position: { x, y },
          data: { label: virtual.config.name }
        };
      });

      reconciledNodes = [...reconciledNodes, ...newVirtualNodes];

      reconciledNodes.forEach(node => {
        if (node.type === 'sender') {
          node.data = { ...node.data, onPlay: () => handlePlay(node.id) };
        }
        if (node.type === 'sendereffect') {
          node.data = {
            ...node.data,
            isSyncing: node.data.isSyncing ?? true,
            onNodeDataChange: onNodeDataChange
          };
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
        ...filteredVirtuals.map((virtual, index) => {
          const row = Math.floor(index / COLUMNS);
          const col = index % COLUMNS;
          const x = SENDER_AREA_WIDTH + col * (VIRTUAL_NODE_WIDTH + HORIZONTAL_SPACING);
          const y = row * (VIRTUAL_NODE_HEIGHT + VERTICAL_SPACING);
          return {
            id: virtual.id,
            type: 'virtual',
            position: { x, y },
            data: { label: virtual.config.name }
          };
        })
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

  const onNodeDataChange = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data
            }
          }
        }
        return node
      })
    )
  }

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
      data: {
        isSyncing: true,
        onNodeDataChange: onNodeDataChange
      }
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
