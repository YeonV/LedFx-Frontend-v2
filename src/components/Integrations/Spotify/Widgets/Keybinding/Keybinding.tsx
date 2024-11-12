import { Box, IconButton, Stack, Typography } from '@mui/material'
import { KeysRow } from './KeybindingComponents'
import KeybindingFloating from './KeybindingFloating'
import useStyle from './Keybinding.styles'
import { Close } from '@mui/icons-material'

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

const Keybinding = ({ close }: { close?: () => void}) => {
  const classes = useStyle()

  return (
    <Box component={KeybindingFloating}>
      <div className={classes.Widget}>
        <Stack
          direction={'row'}
          p={2}
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent={close  ? "space-between" : "center"}
          display="flex"
        >
          {close && <span />}
          <Typography>Keybinding</Typography>
          {close && <IconButton onClick={() => close()}>
            <Close />
          </IconButton>}
        </Stack>
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
