import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import useStore from '../../store/useStore'
import DialogTitle from '@mui/material/DialogTitle'
import LpColorPicker from './LpColorPicker'
import { DialogContent, ListItemIcon, ListItemText, MenuItem, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { getColorFromValue } from './lpColors'
import { ColorLens } from '@mui/icons-material'

const LaunchpadColors = ({component = 'Button'}:{component?: 'Button' | 'MenuItem'}) => {
  const [open, setOpen] = useState(false)

  const midiSceneInactiveColor = useStore((state) => state.midiColors.sceneInactiveColor)
  const midiSceneActiveColor = useStore((state) => state.midiColors.sceneActiveColor)
  const midiCommandColor = useStore((state) => state.midiColors.commandColor)
  const setMidiSceneInactiveColor = useStore((state) => state.setMidiSceneInactiveColor)
  const setMidiSceneActiveColor = useStore((state) => state.setMidiSceneActiveColor)
  const setMidiCommandColor = useStore((state) => state.setMidiCommandColor)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      {component === 'Button' 
        ? <Button onClick={handleClickOpen}>
            Global Colors
          </Button>
        : <MenuItem onClick={handleClickOpen}>
            <ListItemIcon><ColorLens /></ListItemIcon>
            <ListItemText primary="Global Colors" />
          </MenuItem>}
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Edit Launchpad Global Colors</DialogTitle>
        <DialogContent>
            <Stack direction={'column'} spacing={1} mt={1}>
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Scene inactive</Typography>
                    <LpColorPicker defaultColor={getColorFromValue(midiSceneInactiveColor)} onColorSelect={(color: string) => {
                        setMidiSceneInactiveColor(color)
                    }} />
                </Stack>
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Scene active</Typography>
                    <LpColorPicker defaultColor={getColorFromValue(midiSceneActiveColor)} onColorSelect={(color: string) => {
                        setMidiSceneActiveColor(color)
                    }} />
                </Stack>
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Command</Typography>
                    <LpColorPicker defaultColor={getColorFromValue(midiCommandColor)} onColorSelect={(color: string) => {
                        setMidiCommandColor(color)
                    }} />
                </Stack>
            </Stack>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default LaunchpadColors