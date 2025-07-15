import { useMemo } from 'react'
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward, Cancel } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { IMCell } from '../M.utils'
import moveSelectedGroupUp from '../Actions/moveSelectedGroupUp'
import moveSelectedGroupLeft from '../Actions/moveSelectedGroupLeft'
import moveSelectedGroupRight from '../Actions/moveSelectedGroupRight'
import moveSelectedGroupDown from '../Actions/moveSelectedGroupDown'

// Define a clear, specific props interface
interface GroupControlsProps {
  m: IMCell[][]
  rowN: number
  colN: number
  selectedGroup: string
  setSelectedGroup: (_group: string) => void
  setM: (_m: IMCell[][]) => void
  setError: (_error: { row: number; col: number }[]) => void
}

const GroupControls = ({
  m,
  rowN,
  colN,
  selectedGroup,
  setSelectedGroup,
  setM,
  setError
}: GroupControlsProps) => {
  // The logic for finding unique groups now lives here, where it's used.
  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    m.flat().forEach((cell) => {
      if (cell.group && typeof cell.group === 'string' && cell.group !== '0-0') {
        groups.add(cell.group)
      }
    })
    return Array.from(groups)
  }, [m])

  // If there are no groups, this component renders nothing.
  if (uniqueGroups.length === 0) {
    return null
  }

  return (
    <Box>
      <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
        <InputLabel id="group-select-label">Move Group</InputLabel>
        <Select
          variant="outlined"
          labelId="group-select-label"
          id="group-select"
          value={selectedGroup || ''}
          label="Move Group"
          onChange={(e) => setSelectedGroup(e.target.value as string)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {uniqueGroups.map((group) => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="column" spacing={0} alignItems="center" justifyContent="center">
        <IconButton
          disabled={!selectedGroup}
          onClick={() => moveSelectedGroupUp({ m, rowN, colN, selectedGroup, setError, setM })}
        >
          <ArrowUpward />
        </IconButton>
        <Stack direction="row" spacing={0} justifyContent="center">
          <IconButton
            disabled={!selectedGroup}
            onClick={() => moveSelectedGroupLeft({ m, rowN, colN, selectedGroup, setM })}
          >
            <ArrowBack />
          </IconButton>
          <IconButton disabled={!selectedGroup} onClick={() => setSelectedGroup('')}>
            <Cancel />
          </IconButton>
          <IconButton
            disabled={!selectedGroup}
            onClick={() => moveSelectedGroupRight({ m, rowN, colN, selectedGroup, setM })}
          >
            <ArrowForward />
          </IconButton>
        </Stack>
        <IconButton
          disabled={!selectedGroup}
          onClick={() => moveSelectedGroupDown({ m, rowN, colN, selectedGroup, setError, setM })}
        >
          <ArrowDownward />
        </IconButton>
      </Stack>
    </Box>
  )
}

export default GroupControls
