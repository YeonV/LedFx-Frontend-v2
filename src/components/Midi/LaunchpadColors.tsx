import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import useStore from '../../store/useStore'
import DialogTitle from '@mui/material/DialogTitle'
import LpColorPicker from './LpColorPicker'
import { DialogContent, ListItemIcon, ListItemText, MenuItem, Popover, Popper, Stack, Typography, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { getColorFromValue } from './lpColors'
import { ColorLens } from '@mui/icons-material'
import ReactGPicker from 'react-gcolor-picker'
import useStyles from '../SchemaForm/components/GradientPicker/GradientPicker.styles'
import useClickOutside from '../../utils/useClickOutside'

const LaunchpadColors = ({component = 'Button'}:{component?: 'Button' | 'MenuItem'}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const midiSceneInactiveColor = useStore((state) => state.midiColors.sceneInactiveColor)
  const midiSceneActiveColor = useStore((state) => state.midiColors.sceneActiveColor)
  const midiCommandColor = useStore((state) => state.midiColors.commandColor)
  const pressedButtonColor = useStore((state) => state.midiColors.pressedButtonColor)
  const setPressedButtonColor = useStore((state) => state.setPressedButtonColor)
  const setMidiSceneInactiveColor = useStore((state) => state.setMidiSceneInactiveColor)
  const setMidiSceneActiveColor = useStore((state) => state.setMidiSceneActiveColor)
  const setMidiCommandColor = useStore((state) => state.setMidiCommandColor)
  const [anchorEl, setAnchorEl] = useState(null)
  const popover = useRef(null)
  const openColor = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickColor = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleCloseColor = () => {
    setAnchorEl(null)
  }

  useClickOutside(popover, handleClose)

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
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Pressed button</Typography>                    
                    <div
                        style={{ 
                          backgroundColor: pressedButtonColor || theme.palette.primary.main,
                          height: 30,
                          width: 65,
                          cursor: 'pointer',
                          border: '1px solid #999',
                          borderRadius: 4
                        }}
                        aria-describedby={id}
                        onClick={handleClickColor}
                      />
                    <Popover id={id} open={openColor} anchorEl={anchorEl} ref={popover && popover} onClose={handleCloseColor} 
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}>
                      <div
                        className={`${classes.paper} gradient-picker`}
                        style={{
                          padding: theme.spacing(1),
                          backgroundColor: theme.palette.background.paper,
                        }}
                      >
                      <ReactGPicker
                        showInputs={false}
                        colorBoardHeight={150}
                        debounce
                        debounceMS={300}
                        format="hex"
                        gradient={false}
                        solid
                        onChange={(c) => {
                          return setPressedButtonColor(c)
                        }}
                        popupWidth={288}
                        showAlpha={false}
                        value={pressedButtonColor || '#0dbedc'}
                        // defaultColors={Object.values(defaultColors)}
                      />
                      </div>
                    </Popover>
                    {/* <LpColorPicker defaultColor={pressedButtonColor} onColorSelect={(color: string) => {
                        setPressedButtonColor(color)
                    }} /> */}
                </Stack>
            </Stack>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default LaunchpadColors