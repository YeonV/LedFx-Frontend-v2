import { useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Stack
} from '@mui/material'
import { Refresh } from '@mui/icons-material'
import useStore from '../../store/useStore'
import type { ClientsMap } from '../../store/api/storeClients'
import ClientEdit from './ClientEdit'

const ClientManagementCard = () => {
  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const getClients = useStore((state) => state.getClients)

  useEffect(() => {
    getClients()
  }, [getClients])

  // useEffect(() => {
  //   if (clientIdentity) {
  //     setLocalName(clientIdentity.name)
  //     setLocalType(clientIdentity.type)
  //   }
  // }, [clientIdentity])

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
    const now = new Date().getTime() / 1000
    const diffSeconds = Math.floor(now - timestamp)
    const rtf = new Intl.RelativeTimeFormat(navigator.language || 'en', { numeric: 'auto' })

    if (Math.abs(diffSeconds) < 60) {
      return rtf.format(-diffSeconds, 'second')
    } else if (Math.abs(diffSeconds) < 3600) {
      const diffMinutes = Math.floor(diffSeconds / 60)
      return rtf.format(-diffMinutes, 'minute')
    } else if (Math.abs(diffSeconds) < 86400) {
      const diffHours = Math.floor(diffSeconds / 3600)
      return rtf.format(-diffHours, 'hour')
    } else {
      const diffDays = Math.floor(diffSeconds / 86400)
      return rtf.format(-diffDays, 'day')
    }
  }

  const getClientCount = () => Object.keys(clients).length

  return (
    <Box>
      {getClientCount() === 0 ? (
        <Typography variant="body2" color="textSecondary">
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
                <TableCell sx={{ position: 'relative' }}>
                  Connected At
                  <IconButton
                    size="small"
                    onClick={() => getClients()}
                    sx={{ position: 'absolute', right: 16, top: 0 }}
                  >
                    <Refresh />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(clients as ClientsMap).map(([uuid, client]) => (
                <TableRow key={uuid}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2">{client?.name}</Typography>
                      {client?.name === clientIdentity?.name && (
                        <Chip label="Current" color="primary" size="small" />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={client?.type} color={getTypeColor(client?.type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{client?.ip}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" justifyContent={'space-between'} alignItems="center">
                      <Typography variant="body2">
                        {formatTimestamp(client?.connected_at)}
                      </Typography>
                      <ClientEdit name={client?.name} type={client?.type} sx={{ pb: 0.5 }} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default ClientManagementCard
