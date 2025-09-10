import { useState, useCallback, useEffect } from 'react'
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

  const handlePlay = (senderId: string) => {
    const senderNodeOmni = nodes.find((node) => node.id === senderId)
    if (!senderNodeOmni) return

    const connectedEdges = getConnectedEdges([senderNodeOmni], edges)
    const outgoers = getOutgoers(senderNodeOmni, nodes, edges)

    console.log('Sender:', senderNodeOmni)
    console.log('Connected virtuals:', outgoers)
    console.log('Connected edges:', connectedEdges)
  }

  useEffect(() => {
    getVirtuals()
  }, [getVirtuals])

  useEffect(() => {
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
        position: { x: 100, y: 100 + (Object.keys(nodes).length + 1) * 50 },
        data: { onPlay: () => handlePlay(`sendereffect-${senderId}`) }
      },
      ...filteredVirtuals.map((virtual, index) => ({
        id: virtual.id,
        type: 'virtual',
        position: { x: 500, y: 100 + index * 180 },
        data: { label: virtual.config.name }
      }))
    ]
    setNodes(initialNodes)
  }, [virtuals, showComplex, showGaps])

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

  return (
    <div style={{ height: 'calc(100vh - 208px)', overflow: 'hidden' }}>
      <Button onClick={addSenderNodeOmni} variant="contained">
        Add Sender Omni
      </Button>
      <Button onClick={addSenderNodeEffect} variant="contained">
        Add Sender Effect
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
