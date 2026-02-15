import { useEffect, useState } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Divider,
  Stack
} from '@mui/material'
import { Refresh, Send } from '@mui/icons-material'
import useStore from '../../store/useStore'
import { useWebSocket } from '../../utils/Websocket/WebSocketProvider'
import type { ClientType } from '../../store/ui/storeClientIdentity'
import type { ClientsMap } from '../../store/api/storeClients'

const ClientManagementCard = () => {
  const clientIdentity = useStore((state) => state.clientIdentity)
  const clients = useStore((state) => state.clients)
  const getClients = useStore((state) => state.getClients)
  const setClientType = useStore((state) => state.setClientType)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const setClientName = useStore((state) => state.setClientName)
  const { send } = useWebSocket()

  const [localName, setLocalName] = useState(clientIdentity?.name || '')
  const [localType, setLocalType] = useState<ClientType>(clientIdentity?.type || 'unknown')

  useEffect(() => {
    getClients()
  }, [getClients])

  useEffect(() => {
    if (clientIdentity) {
      setLocalName(clientIdentity.name)
      setLocalType(clientIdentity.type)
    }
  }, [clientIdentity])

  const handleUpdateInfo = () => {
    if (localName !== clientIdentity?.name || localType !== clientIdentity?.type) {
      setClientName(localName)
      setClientType(localType)
      if (send) {
        send({
          id: 10001,
          type: 'update_client_info',
          name: localName,
          client_type: localType
        })
      }
    }
  }

  const getTypeColor = (
    type: string
  ): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const colors: Record<
      string,
      'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    > = {
      controller: 'primary',
      visualiser: 'secondary',
      mobile: 'success',
      display: 'info',
      api: 'warning',
      unknown: 'error'
    }
    return colors[type] || 'default'
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getClientCount = () => Object.keys(clients).length

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5">Client Management</Typography>
          <Typography variant="body2" color="textSecondary">
            Manage connected clients and broadcasts
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label={`${getClientCount()} client(s)`} size="small" />
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={() => getClients()}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Current Client Identity */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        This Client
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
        <TextField
          label="Client Name"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          size="small"
          fullWidth
        />
        <Select
          value={localType}
          onChange={(e) => setClientType(e.target.value as ClientType)}
          size="small"
          variant="outlined"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="controller">Controller</MenuItem>
          <MenuItem value="visualiser">Visualiser</MenuItem>
          <MenuItem value="mobile">Mobile</MenuItem>
          <MenuItem value="display">Display</MenuItem>
          <MenuItem value="api">API</MenuItem>
          <MenuItem value="unknown">Unknown</MenuItem>
        </Select>
        <Button size="small" variant="contained" onClick={handleUpdateInfo} sx={{ minWidth: 100 }}>
          Update
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Connected Clients */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Connected Clients
      </Typography>

      {getClientCount() === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
          No clients connected
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Connected At</TableCell>
                <TableCell>Last Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(clients as ClientsMap).map(([uuid, client]) => (
                <TableRow key={uuid}>
                  <TableCell>
                    <Typography variant="body2">{client?.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {uuid.slice(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={client?.type} color={getTypeColor(client?.type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{client?.ip}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatTimestamp(client?.connected_at)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatTimestamp(client?.last_active)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Broadcast Test */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Test Broadcast
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Send a test broadcast to all connected clients
      </Typography>
      <Button
        variant="outlined"
        startIcon={<Send />}
        onClick={() => {
          if (clientIdentity && clientIdentity.clientId && broadcastToClients) {
            broadcastToClients(
              {
                broadcast_type: 'custom',
                target: { mode: 'all' },
                payload: { message: 'Test broadcast from ' + clientIdentity?.name }
              },
              clientIdentity.clientId
            )
          }
        }}
        disabled={!clientIdentity?.clientId}
      >
        Send Test Broadcast
      </Button>
    </Box>
  )
}

export default ClientManagementCard
