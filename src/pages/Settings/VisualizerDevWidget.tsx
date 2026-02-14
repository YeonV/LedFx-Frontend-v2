import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import useStore from '../../store/useStore'
import { useEffect, useState } from 'react'
import VisualizerConfig from './VisualizerConfig'

const VisualizerDevWidget = () => {
  const getClients = useStore((state) => state.getClients)
  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const [selectedClients, setSelectedClients] = useState<string[]>([clientIdentity?.clientId || ''])

  useEffect(() => {
    getClients()
  }, [getClients])

  return (
    <Box
      sx={{
        ml: 0,
        mb: 2,
        p: 2,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 1
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {clients && Object.keys(clients).length > 1 && (
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Instances</InputLabel>
            <Select
              multiple
              size="small"
              variant="outlined"
              sx={{ minWidth: 200 }}
              fullWidth
              label="Instances"
              value={selectedClients}
              onChange={(e) => setSelectedClients(e.target.value as string[])}
              renderValue={(selected) => {
                const selectedArray = selected as string[]
                if (selectedArray.length === 1) {
                  return (
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography>{clients[selectedArray[0]].name}</Typography>
                      <Chip label={clients[selectedArray[0]].type} size="small" />
                    </Stack>
                  )
                }
                if (selectedArray.length === Object.keys(clients).length) {
                  return 'Sending to All ' + selectedArray.length
                }
                return `${selectedArray.length} Visualisers selected`
              }}
            >
              {Object.entries(clients).map(([clientId, client]) => (
                <MenuItem key={clientId} value={clientId} sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    alignItems="center"
                    width={'100%'}
                  >
                    <Typography>
                      {client.name}
                      {clientId === clientIdentity.clientId ? ' (This instance)' : ''}
                    </Typography>
                    <Chip label={client.type} size="small" />
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}
      <VisualizerConfig selectedClients={selectedClients} />
    </Box>
  )
}

export default VisualizerDevWidget
