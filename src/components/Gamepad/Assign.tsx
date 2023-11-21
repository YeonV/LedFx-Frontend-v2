import { Fab, FormControl, MenuItem, Select, Stack } from '@mui/material'
import useStore from '../../store/useStore'

const Assign = ({ mapping, setMapping, pressed, index, padIndex }: any) => {
  const scenes = useStore((state) => state.scenes)

  return (
    <Stack key={index} direction="row" alignItems="center" spacing={1}>
      <Fab
        size="small"
        color={pressed ? 'primary' : 'inherit'}
        sx={{
          background: pressed ? '#0dbedc' : '#333',
          m: 1
        }}
      >
        {index}
      </Fab>
      <FormControl fullWidth>
        <Select
          style={{
            color: 'white'
          }}
          labelId="scene-select-label"
          label="Scene"
          value={mapping[padIndex][index] || 'none'}
          onChange={(e) =>
            setMapping({
              ...mapping,
              [padIndex]: { ...mapping[padIndex], [index]: e.target.value }
            })
          }
        >
          <MenuItem value="none" key="none">
            no scene assigned
          </MenuItem>
          {Object.keys(scenes).map((s: string) => (
            <MenuItem key={s} value={s}>
              {scenes[s]?.name || s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}

export default Assign
