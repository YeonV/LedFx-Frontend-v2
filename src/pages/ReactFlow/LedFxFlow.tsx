import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
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
  getOutgoers,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import useStore from '../../store/useStore'
import SenderNodeOmni from './SenderNodeOmni'
import SenderNodeEffect from './SenderNodeEffect'
import VirtualNode from './VirtualNode'
import SceneNode from './SceneNode'
import { IScene } from '../../store/api/storeScenes'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Collapse,
  IconButton
} from '@mui/material'
import {
  Save,
  FolderOpen,
  RestartAlt,
  FileUpload,
  FileDownload,
  AddCircleOutline,
  Input,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material'

const nodeTypes = {
  sender: SenderNodeOmni,
  sendereffect: SenderNodeEffect,
  virtual: VirtualNode,
  scene: SceneNode
}

let senderId = 1

const LedFxFlow = () => {
  const virtuals = useStore((state) => state.virtuals)
  const scenes = useStore((state) => state.scenes)
  const getVirtuals = useStore((state) => state.getVirtuals)

  const scenesArray: IScene[] = useMemo(() => {
    return Object.entries(scenes).map(([id, sceneData]) => ({
      id,
      name: sceneData.name ?? '',
      ...sceneData
    }))
  }, [scenes])
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const graphs = useStore((state) => state.graphsMulti)
  const graphsMulti = useStore((state) => state.graphsMulti)

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [dialogState, setDialogState] = useState({ open: false, nodeType: '' })
  const [newNodeName, setNewNodeName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [savedLayouts, setSavedLayouts] = useState<string[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [layoutName, setLayoutName] = useState('')
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  const [senderMenuAnchorEl, setSenderMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [recieverMenuAnchorEl, setRecieverMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [loadMenuAnchorEl, setLoadMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [sceneMenuAnchorEl, setSceneMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [actionsExpanded, setActionsExpanded] = useState(false)
  const { screenToFlowPosition } = useReactFlow()

  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const edgesRef = useRef(edges)
  edgesRef.current = edges

  const onNodeDataChange = useCallback(
    (nodeId: string, data: any) => {
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
    },
    [setNodes]
  )

  const handlePlay = useCallback((senderId: string) => {
    const senderNodeOmni = nodesRef.current.find((node) => node.id === senderId)
    if (!senderNodeOmni) return

    const connectedEdges = getConnectedEdges([senderNodeOmni], edgesRef.current)
    const outgoers = getOutgoers(senderNodeOmni, nodesRef.current, edgesRef.current)

    console.log('Sender:', senderNodeOmni)
    console.log('Connected virtuals:', outgoers)
    console.log('Connected edges:', connectedEdges)
  }, [])

  const reconcileAndSetFlow = useCallback(
    (loadedNodes: Node[] | null, loadedEdges: Edge[] | null) => {
      const VIRTUAL_NODE_WIDTH = 400
      const VIRTUAL_NODE_HEIGHT = 160
      const HORIZONTAL_SPACING = 50
      const VERTICAL_SPACING = 20
      const SENDER_AREA_WIDTH = 500
      const COLUMNS = 3

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

      if (loadedNodes && loadedNodes.length > 0) {
        const savedNodes = loadedNodes
        const savedEdges = loadedEdges || []

        const filteredVirtualIds = new Set(filteredVirtuals.map((v) => v.id))
        const savedNodeIds = new Set(savedNodes.map((n) => n.id))

        let reconciledNodes = savedNodes.filter(
          (node) =>
            node.type?.startsWith('sender') ||
            node.type === 'scene' ||
            filteredVirtualIds.has(node.id)
        )

        const newVirtuals = filteredVirtuals.filter((v) => !savedNodeIds.has(v.id))
        const newVirtualNodes = newVirtuals.map((virtual, index) => {
          const nodeIndex = reconciledNodes.filter((n) => n.type === 'virtual').length + index
          const row = Math.floor(nodeIndex / COLUMNS)
          const col = nodeIndex % COLUMNS
          const x = SENDER_AREA_WIDTH + col * (VIRTUAL_NODE_WIDTH + HORIZONTAL_SPACING)
          const y = row * (VIRTUAL_NODE_HEIGHT + VERTICAL_SPACING)
          return {
            id: virtual.id,
            type: 'virtual',
            position: { x, y },
            data: { label: virtual.config.name }
          }
        })

        reconciledNodes = [...reconciledNodes, ...newVirtualNodes]

        reconciledNodes.forEach((node) => {
          if (node.type === 'sender') {
            node.data = {
              ...node.data,
              isCollapsed: node.data.isCollapsed ?? true,
              onNodeDataChange,
              onPlay: node.data.scope === 'global' ? () => handlePlay(node.id) : undefined
            }
          }
          if (node.type === 'sendereffect') {
            node.data = {
              ...node.data,
              isSyncing: node.data.isSyncing ?? true,
              isCollapsed: node.data.isCollapsed ?? true,
              onNodeDataChange
            }
          }
        })

        setNodes(reconciledNodes)

        const reconciledNodeIds = new Set(reconciledNodes.map((n) => n.id))
        const reconciledEdges = savedEdges.filter(
          (edge) => reconciledNodeIds.has(edge.source) && reconciledNodeIds.has(edge.target)
        )
        setEdges(reconciledEdges)
      } else {
        const initialNodes: Node[] = [
          {
            id: 'sender-global',
            type: 'sender',
            position: { x: 100, y: 100 },
            data: {
              name: 'Omni FX',
              scope: 'global',
              isCollapsed: true,
              onNodeDataChange
            }
          },
          ...filteredVirtuals.map((virtual, index) => {
            const row = Math.floor(index / COLUMNS)
            const col = index % COLUMNS
            const x = SENDER_AREA_WIDTH + col * (VIRTUAL_NODE_WIDTH + HORIZONTAL_SPACING)
            const y = row * (VIRTUAL_NODE_HEIGHT + VERTICAL_SPACING)
            return {
              id: virtual.id,
              type: 'virtual',
              position: { x, y },
              data: { label: virtual.config.name }
            }
          }),
          ...scenesArray.map((scene, index) => ({
            id: scene.id,
            type: 'scene',
            position: {
              x: SENDER_AREA_WIDTH + COLUMNS * (VIRTUAL_NODE_WIDTH + HORIZONTAL_SPACING) + 100,
              y: index * 200
            },
            data: { name: scene.name }
          }))
        ]
        if (filteredVirtuals.length > 0 || !loadedNodes) {
          setNodes(initialNodes)
          setEdges([])
        }
      }
    },
    [virtuals, showComplex, showGaps, scenesArray, handlePlay, onNodeDataChange]
  )

  useEffect(() => {
    getVirtuals()
    updateSavedLayoutsState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const savedNodesJSON = localStorage.getItem('ledfx-flow-nodes')
    const savedEdgesJSON = localStorage.getItem('ledfx-flow-edges')

    if (savedNodesJSON) {
      try {
        const savedNodes = JSON.parse(savedNodesJSON) as Node[]
        const savedEdges = savedEdgesJSON ? (JSON.parse(savedEdgesJSON) as Edge[]) : []
        reconcileAndSetFlow(savedNodes, savedEdges)
      } catch (e) {
        console.error('Failed to parse saved flow data:', e)
        reconcileAndSetFlow(null, null)
      }
    } else {
      reconcileAndSetFlow(null, null)
    }
  }, [reconcileAndSetFlow])

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
    localStorage.setItem('ledfx-flow-nodes', JSON.stringify(nodes))
    localStorage.setItem('ledfx-flow-edges', JSON.stringify(edges))
  }, [nodes, edges])

  const handleOpenDialog = (nodeType: string) => {
    setDialogState({ open: true, nodeType })
  }

  const handleCloseDialog = () => {
    setDialogState({ open: false, nodeType: '' })
    setNewNodeName('')
  }

  const handleNameSubmit = () => {
    senderId++
    const nodeType = dialogState.nodeType
    const baseName = nodeType === 'sender' ? 'Omni Sender' : 'Effect Sender'
    const name = newNodeName.trim() === '' ? `${baseName}: ${senderId}` : newNodeName.trim()

    const newNode = {
      id: `${nodeType}-${senderId}`,
      type: nodeType,
      position: {
        x: 100,
        y: 100 + (Object.keys(nodes).length + 1) * 50
      },
      data: {
        name,
        scope: 'scoped',
        isSyncing: true,
        isCollapsed: true,
        onNodeDataChange
      }
    }

    setNodes((nds) => nds.concat(newNode))
    handleCloseDialog()
  }

  const addSenderNodeOmni = () => {
    handleOpenDialog('sender')
  }

  const addSenderNodeEffect = () => {
    handleOpenDialog('sendereffect')
  }

  const addSceneNode = (sceneId: string) => {
    const scene = scenes[sceneId]
    if (!scene) return

    const position = screenToFlowPosition({
      x: contextMenu?.mouseX || 0,
      y: contextMenu?.mouseY || 0
    })

    const newNode = {
      id: sceneId,
      type: 'scene',
      position,
      data: { name: scene.name }
    }

    setNodes((nds) => nds.concat(newNode))
    setContextMenu(null)
  }

  const addVirtualNode = (virtualId: string) => {
    const virtual = virtuals[virtualId]
    if (!virtual) return

    const position = screenToFlowPosition({
      x: contextMenu?.mouseX || 0,
      y: contextMenu?.mouseY || 0
    })

    const newNode = {
      id: virtual.id,
      type: 'virtual',
      position,
      data: { label: virtual.config.name }
    }

    setNodes((nds) => nds.concat(newNode))
    setContextMenu(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== 'string') throw new Error('File is not readable')
        const data = JSON.parse(text)

        if (data.flowdata && data.flowdata.nodes && data.flowdata.edges) {
          reconcileAndSetFlow(data.flowdata.nodes, data.flowdata.edges)
        } else {
          console.error('Invalid flow data file format.')
        }
      } catch (error) {
        console.error('Error reading or parsing flow data file:', error)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const getSavedLayouts = () => {
    const layouts = localStorage.getItem('ledfx-saved-flows')
    return layouts ? JSON.parse(layouts) : {}
  }

  const updateSavedLayoutsState = () => {
    const layouts = getSavedLayouts()
    setSavedLayouts(Object.keys(layouts))
  }

  const handleSaveLayout = () => {
    if (layoutName.trim() === '') return
    const layouts = getSavedLayouts()
    const currentFlow = {
      nodes,
      edges
    }
    layouts[layoutName.trim()] = currentFlow
    localStorage.setItem('ledfx-saved-flows', JSON.stringify(layouts))
    updateSavedLayoutsState()
    setSaveDialogOpen(false)
    setLayoutName('')
  }

  const handleLoadLayout = (name: string) => {
    const layouts = getSavedLayouts()
    const layout = layouts[name]
    if (layout) {
      reconcileAndSetFlow(layout.nodes, layout.edges)
    }
  }

  const handleDeleteLayout = (name: string) => {
    const layouts = getSavedLayouts()
    delete layouts[name]
    localStorage.setItem('ledfx-saved-flows', JSON.stringify(layouts))
    updateSavedLayoutsState()
  }

  const handleClear = () => {
    reconcileAndSetFlow(null, null)
  }

  const handlePaneContextMenu = (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6
          }
        : null
    )
  }

  const handleExport = () => {
    const flowData = {
      flowdata: {
        nodes: nodes.map(({ id, type, position, data }) => {
          let sanitizedData: any = {}
          if (type === 'virtual') {
            sanitizedData = { label: data.label }
          } else if (type === 'scene') {
            sanitizedData = { name: data.name }
          } else {
            // for 'sender' and 'sendereffect'
            sanitizedData = {
              name: data.name,
              scope: data.scope,
              isSyncing: data.isSyncing,
              isCollapsed: data.isCollapsed
            }
          }
          // This is a failsafe, if label is missing, try to get it from store
          if (type === 'virtual' && !sanitizedData.label) {
            const virtualFromStore = virtuals[id]
            if (virtualFromStore) {
              sanitizedData.label = virtualFromStore.config.name
            }
          }
          return { id, type, position, data: sanitizedData }
        }),
        edges
      }
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(flowData, null, 2)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'ledfx-flow.json'
    link.click()
  }

  return (
    <div style={{ height: 'calc(100vh - 208px)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <IconButton onClick={(e) => handlePaneContextMenu(e)} size="small">
          <MenuIcon />
        </IconButton>
        <IconButton onClick={() => setActionsExpanded(!actionsExpanded)} size="small">
          {actionsExpanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        <Collapse in={actionsExpanded} orientation="horizontal">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap'
            }}
          >
            <Button onClick={addSenderNodeOmni} variant="contained">
              Add Scoped Omni Sender
            </Button>
            <Button onClick={addSenderNodeEffect} variant="contained">
              Add Sender Effect
            </Button>
            <Button onClick={handleExport} variant="contained">
              Export
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="contained">
              Import
            </Button>
          </Box>
        </Collapse>
        <Button size="small" variant="outlined" onClick={handleClear}>
          Default
        </Button>
        {savedLayouts.map((name) => (
          <Button
            key={name}
            size="small"
            variant="outlined"
            onClick={() => handleLoadLayout(name)}
            onContextMenu={(e) => {
              e.preventDefault()
              handleDeleteLayout(name)
            }}
          >
            {name}
          </Button>
        ))}
        <Button size="small" variant="outlined" onClick={() => setSaveDialogOpen(true)}>
          +
        </Button>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Layout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="layout-name"
            label="Layout Name"
            type="text"
            fullWidth
            variant="standard"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveLayout()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveLayout}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogState.open} onClose={handleCloseDialog}>
        <DialogTitle>Name Your Node</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Node Name"
            type="text"
            fullWidth
            variant="standard"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleNameSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={(e) => setSenderMenuAnchorEl(e.currentTarget)}>
          <ListItemIcon>
            <AddCircleOutline fontSize="small" />
          </ListItemIcon>
          Sender
        </MenuItem>
        <MenuItem onClick={(e) => setRecieverMenuAnchorEl(e.currentTarget)}>
          <ListItemIcon>
            <Input fontSize="small" />
          </ListItemIcon>
          Reciever
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setSaveDialogOpen(true)
            setContextMenu(null)
          }}
        >
          <ListItemIcon>
            <Save fontSize="small" />
          </ListItemIcon>
          Save
        </MenuItem>
        <MenuItem onClick={(e) => setLoadMenuAnchorEl(e.currentTarget)}>
          <ListItemIcon>
            <FolderOpen fontSize="small" />
          </ListItemIcon>
          Load
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClear()
            setContextMenu(null)
          }}
        >
          <ListItemIcon>
            <RestartAlt fontSize="small" />
          </ListItemIcon>
          Reset
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleExport()
            setContextMenu(null)
          }}
        >
          <ListItemIcon>
            <FileUpload fontSize="small" />
          </ListItemIcon>
          Export
        </MenuItem>
        <MenuItem
          onClick={() => {
            fileInputRef.current?.click()
            setContextMenu(null)
          }}
        >
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          Import
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={loadMenuAnchorEl}
        open={Boolean(loadMenuAnchorEl)}
        onClose={() => setLoadMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {savedLayouts.map((name) => (
          <MenuItem
            key={name}
            onClick={() => {
              handleLoadLayout(name)
              setLoadMenuAnchorEl(null)
              setContextMenu(null)
            }}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={recieverMenuAnchorEl}
        open={Boolean(recieverMenuAnchorEl)}
        onClose={() => setRecieverMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {Object.values(virtuals)
          .filter((v) => !nodes.some((n) => n.id === v.id))
          .map((v) => (
            <MenuItem
              key={v.id}
              onClick={() => {
                addVirtualNode(v.id)
                setRecieverMenuAnchorEl(null)
              }}
            >
              {v.config.name}
            </MenuItem>
          ))}
      </Menu>
      <Menu
        anchorEl={senderMenuAnchorEl}
        open={Boolean(senderMenuAnchorEl)}
        onClose={() => setSenderMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() => {
            handleOpenDialog('sender')
            setSenderMenuAnchorEl(null)
            setContextMenu(null)
          }}
        >
          <ListItemIcon>
            <AddCircleOutline fontSize="small" />
          </ListItemIcon>
          Scoped Omni
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenDialog('sendereffect')
            setSenderMenuAnchorEl(null)
            setContextMenu(null)
          }}
        >
          <ListItemIcon>
            <AddCircleOutline fontSize="small" />
          </ListItemIcon>
          Effect
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            setSceneMenuAnchorEl(e.currentTarget)
          }}
        >
          <ListItemIcon>
            <AddCircleOutline fontSize="small" />
          </ListItemIcon>
          Scene
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={sceneMenuAnchorEl}
        open={Boolean(sceneMenuAnchorEl)}
        onClose={() => setSceneMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {scenesArray
          .filter((scene) => !nodes.some((node) => node.id === scene.id))
          .map((scene) => (
            <MenuItem
              key={scene.id}
              onClick={() => {
                addSceneNode(scene.id)
                setSceneMenuAnchorEl(null)
                setSenderMenuAnchorEl(null)
                setContextMenu(null)
              }}
            >
              {scene.name}
            </MenuItem>
          ))}
      </Menu>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onPaneContextMenu={handlePaneContextMenu}
        fitView
      />
    </div>
  )
}

export default LedFxFlow
