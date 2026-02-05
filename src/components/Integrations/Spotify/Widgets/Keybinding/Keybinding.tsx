import { Box, IconButton, Stack, Typography } from '@mui/material'
import { KeysRow } from './KeybindingComponents'
import KeybindingFloating from './KeybindingFloating'
import useStyle from './Keybinding.styles'
import { Close } from '@mui/icons-material'

const keybindings = [
  {
    keys: 'ctrl+space',
    description: 'Keybindings (this screen)'
  },
  // {
  //   keys: 'ctrl+alt+k',
  //   description: 'Keybindings (this screen)'
  // },
  {
    keys: 'ctrl+alt+y',
    description: 'SmartBar'
  },
  {
    keys: 'ctrl+alt+p',
    description: 'PixelGraph Settings'
  },
  {
    keys: 'ctrl+alt+t',
    description: 'Song Texter (needs Spotify or Song Detector)'
  },
  {
    keys: 'ctrl+alt+s',
    description: 'Song Detector Plus'
  },
  {
    keys: 'ctrl+alt+e',
    description: 'One Shoot Effect (WIP)'
  },
  {
    keys: 'ctrl+alt+f',
    description: 'Show/Hide FPS Viewer'
  },
  {
    keys: 'ctrl+alt+c',
    description: 'Global Color Widget'
  },
  // {
  //   keys: 'ctrl+alt+d',
  //   description: 'MP'
  // },
  {
    keys: 'ctrl+alt+m',
    description: 'Audio Graph'
  },
  {
    keys: 'ctrl+alt+g',
    description: 'Guest Mode'
  }
  // {
  //   keys: 'ctrl+alt+l',
  //   description: 'Lock'
  // },
]

const Keybinding = ({ close }: { close?: () => void }) => {
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
          justifyContent={close ? 'space-between' : 'center'}
          display="flex"
        >
          {close && <span />}
          <Typography>Keybinding</Typography>
          {close && (
            <IconButton onClick={() => close()}>
              <Close />
            </IconButton>
          )}
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
