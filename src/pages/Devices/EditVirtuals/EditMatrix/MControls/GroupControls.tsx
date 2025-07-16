import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward, Cancel } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import moveSelectedGroupUp from '../Actions/moveSelectedGroupUp'
import moveSelectedGroupLeft from '../Actions/moveSelectedGroupLeft'
import moveSelectedGroupRight from '../Actions/moveSelectedGroupRight'
import moveSelectedGroupDown from '../Actions/moveSelectedGroupDown'
import { useMatrixEditorContext } from '../MatrixEditorContext'

const GroupControls = () => {
  const { m, rowN, colN, selectedGroup, setSelectedGroup, setM, setError, uniqueGroups } =
    useMatrixEditorContext()

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
