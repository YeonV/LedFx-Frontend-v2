import { Box, Stack } from '@mui/material'
import { KeysRow } from './KeybindingComponents'
import KeybindingFloating from './KeybindingFloating'
import useStyle from './Keybinding.styles'

const keybindings = [
  {
    keys: 'ctrl+space',
    description: 'Open/Close Keybinding Screen'
  },
  {
    keys: 'ctrl+alt+k',
    description: 'Open/Close Keybinding Screen'
  },

  {
    keys: 'ctrl+alt+y',
    description: 'Open/Close SmartBar'
  },
  {
    keys: 'ctrl+alt+z',
    description: 'Open/Close SmartBar'
  },
  // {
  //   keys: 'ctrl+alt+d',
  //   description: 'Open/Close MP'
  // },
  {
    keys: 'ctrl+alt+m',
    description: 'Open/Close Audio Graph'
  },
  {
    keys: 'ctrl+alt+g',
    description: 'Open/Close Guest Mode'
  },
  // {
  //   keys: 'ctrl+alt+l',
  //   description: 'Lock'
  // },

]

const Keybinding = () => {
  const classes = useStyle()

  return (
    <Box component={KeybindingFloating}>
      <div className={classes.Widget}>
        <Box
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          Keybinding
        </Box>
        <Box p={2}>
          <Stack spacing={2}>
            {keybindings.map((keybinding, index) => (
              <KeysRow key={index} keys={keybinding.keys} description={keybinding.description} />
            ))}
          </Stack>
        </Box>
      </div>
    </Box>
  )
}

export default Keybinding
