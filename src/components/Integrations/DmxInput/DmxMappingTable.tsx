import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography
} from '@mui/material'
import useStore from '../../../store/useStore'
import Popover from '../../Popover/Popover'
import DialogAddDmxMapping from './DialogAddDmxMapping'
import type { DmxMapping } from '../../../store/ui/storeDmxInput'

interface Props {
  integrationId: string
}

const channelSummary = (m: DmxMapping): string => {
  const ch: any = m.channels
  if (m.type === 'trigger') {
    return `ch ${Array.isArray(ch) ? ch[0] : ch}`
  }
  if (m.type === 'color') {
    return Array.isArray(ch) ? `R${ch[0]} G${ch[1]} B${ch[2]}` : ''
  }
  if (m.type === 'fixture' && !Array.isArray(ch)) {
    return `D${ch.dimmer} R${ch.r} G${ch.g} B${ch.b}`
  }
  return JSON.stringify(ch)
}

const typeColor: Record<string, any> = {
  trigger: 'primary',
  color: 'secondary',
  fixture: 'warning'
}

export default function DmxMappingTable({ integrationId }: Props) {
  const dmxData = useStore((state) => state.dmxInput[integrationId])
  const deleteDmxMapping = useStore((state) => state.deleteDmxMapping)
  const getDmxInput = useStore((state) => state.getDmxInput)

  const mappings = dmxData?.mappings || []
  const venues = dmxData?.venues || {}
  const virtuals = dmxData?.virtuals || {}

  const targetSummary = (m: DmxMapping): string => {
    if (m.virtual_id) {
      return `Virtual: ${virtuals[m.virtual_id] || m.virtual_id}`
    }
    if (m.venue_id) {
      const vname = venues[m.venue_id]?.name || m.venue_id
      return m.pad_index !== undefined && m.pad_index !== null
        ? `${vname} · Pad ${m.pad_index + 1}`
        : `Venue: ${vname}`
    }
    return '—'
  }

  const handleDelete = (index: number) => {
    deleteDmxMapping(integrationId, index).then(() => getDmxInput(integrationId))
  }

  if (!mappings.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', opacity: 0.6 }}>
        <Typography>No mappings yet. Add one to bridge a DMX channel to LedFx.</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Universe</TableCell>
            <TableCell>Channels</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Thresholds</TableCell>
            <TableCell>Active</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mappings.map((m, i) => (
            <TableRow key={i}>
              <TableCell>{m.name || `Mapping ${i + 1}`}</TableCell>
              <TableCell>
                <Chip label={m.type} size="small" color={typeColor[m.type] || 'default'} />
              </TableCell>
              <TableCell>{m.universe}</TableCell>
              <TableCell>{channelSummary(m)}</TableCell>
              <TableCell>{targetSummary(m)}</TableCell>
              <TableCell>
                {m.type === 'trigger' ? `${m.on_threshold ?? 128} / ${m.off_threshold ?? 96}` : '—'}
              </TableCell>
              <TableCell>{m.active === false ? 'No' : 'Yes'}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <DialogAddDmxMapping
                    integrationId={integrationId}
                    editMapping={m}
                    editIndex={i}
                  />
                  <Popover
                    variant="text"
                    color="inherit"
                    style={{ minWidth: 40 }}
                    onConfirm={() => handleDelete(i)}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
