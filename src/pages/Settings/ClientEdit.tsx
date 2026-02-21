import { useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { ClientType } from '../../store/ui/storeClientIdentity'
import useStore from '../../store/useStore'
import Popover from '../../components/Popover/Popover'

interface ClientEditProps {
  name?: string
  type?: ClientType
}

const ClientEdit = ({ name, type }: ClientEditProps) => {
  const clientIdentity = useStore((state) => state.clientIdentity)
  const clients = useStore((state) => state.clients)

  const [newName, setNewName] = useState(name || '')
  const [newType, setNewType] = useState<ClientType>(type || 'unknown')
  const updateClientIdentity = useStore((state) => state.updateClientIdentity)
  const renameVisualizerInstance = useStore((state) => state.renameVisualizerInstance)

  return (
    <Popover
      confirmDisabled={Object.values(clients)
        .flatMap((c) => c.name)
        .includes(newName)}
      type="iconbutton"
      sx={{ pt: 0, ml: 1, opacity: 0.7, color: 'gray' }}
      size="small"
      icon={<Edit fontSize="small" />}
      content={
        <Box sx={{ p: 1, pt: 2 }}>
          <TextField
            size="small"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <FormControl>
            <InputLabel id="new-type">Type</InputLabel>
            <Select
              labelId="new-type"
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
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
          </FormControl>
        </Box>
      }
      onConfirm={() => {
        const updates: any = {}
        if (newName && newName !== clientIdentity?.name) {
          // Rename the instance key in the optimistic store.
          // This now also handles the clientIdentity.name update atomically
          // to prevent race conditions during the rename process.
          if (renameVisualizerInstance && clientIdentity?.name) {
            renameVisualizerInstance(clientIdentity.name, newName)
          }
        }
        if (newType && newType !== clientIdentity?.type) {
          updates.type = newType
        }
        if (Object.keys(updates).length > 0) {
          updateClientIdentity(updates)
        }
      }}
    />
  )
}

export default ClientEdit
