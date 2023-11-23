import {
  Fab,
  FormControl,
  MenuItem,
  Select,
  Stack,
  useTheme
} from '@mui/material'
import { Terminal, Wallpaper } from '@mui/icons-material'
import useStore from '../../store/useStore'

const Assign = ({
  mapping,
  setMapping,
  pressed,
  index,
  padIndex,
  disabled
}: any) => {
  const theme = useTheme()
  const scenes = useStore((state) => state.scenes)
  const modes = ['scene', 'command']
  const commands = [
    'smartbar',
    'play/pause',
    'brightness-up',
    'brightness-down',
    'scan-wled',
    'copy-to',
    'transitions',
    'frequencies',
    'scene-playlist',
    'padscreen',
    'one-shot'
  ]

  return (
    <Stack key={index} direction="row" alignItems="center" spacing={1}>
      <Fab
        size="small"
        color={pressed ? 'primary' : 'inherit'}
        sx={{
          background: pressed ? theme.palette.primary.main : '#333',
          m: 1,
          color: disabled ? '#999' : 'inherit',
          width: 40,
          height: 40,
          flexShrink: 0,
          pointerEvents: 'none'
        }}
      >
        {index}
      </Fab>
      <FormControl
        sx={{
          maxWidth: 30,
          minWidth: 30,
          width: 30
        }}
      >
        <Select
          disableUnderline
          IconComponent={() => null}
          disabled={disabled}
          style={{
            color:
              mapping[padIndex][index]?.mode &&
              (mapping[padIndex][index]?.scene ||
                mapping[padIndex][index]?.command)
                ? 'white'
                : 'grey'
          }}
          sx={{
            '& .MuiSelect-select': {
              paddingRight: '0 !important',
              marginTop: '10px'
            }
          }}
          labelId="scene-select-label"
          label="Scene"
          value={mapping[padIndex][index]?.mode || 'scene'}
          onChange={(e) =>
            setMapping({
              ...mapping,
              [padIndex]: {
                ...mapping[padIndex],
                [index]: { mode: e.target.value }
              }
            })
          }
        >
          {modes.map((s: string) => (
            <MenuItem key={s} value={s}>
              {s === 'scene' ? <Wallpaper /> : <Terminal />}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ maxWidth: 150 }}>
        <Select
          disableUnderline
          disabled={disabled}
          IconComponent={() => null}
          style={{
            color:
              mapping[padIndex][index]?.mode &&
              (mapping[padIndex][index]?.scene ||
                mapping[padIndex][index]?.command)
                ? 'white'
                : 'grey'
          }}
          sx={{
            '& .MuiSelect-select': {
              paddingRight: '0 !important',
              marginTop: '3px'
            }
          }}
          labelId="scene-select-label"
          label="Scene"
          value={
            (mapping[padIndex][index]?.mode === 'scene'
              ? mapping[padIndex][index]?.scene
              : mapping[padIndex][index]?.command) || 'none'
          }
          onChange={(e) =>
            setMapping({
              ...mapping,
              [padIndex]: {
                ...mapping[padIndex],
                [index]:
                  mapping[padIndex][index]?.mode === 'scene'
                    ? { scene: e.target.value, mode: 'scene' }
                    : { command: e.target.value, mode: 'command' }
              }
            })
          }
        >
          <MenuItem value="none" key="none">
            {disabled
              ? 'used by LedFx'
              : mapping[padIndex][index]?.mode !== 'command'
                ? 'choose scene'
                : 'choose command'}
          </MenuItem>
          {(mapping[padIndex][index]?.mode !== 'command'
            ? Object.keys(scenes)
            : commands
          ).map((s: string) => (
            <MenuItem key={s} value={s}>
              {mapping[padIndex][index]?.mode !== 'command'
                ? scenes[s]?.name || s || 'none'
                : s || 'none'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}

export default Assign
