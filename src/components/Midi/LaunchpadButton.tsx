import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { darken, DialogContent, Divider, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import LpColorPicker from './LpColorPicker'
import Assign from '../Gamepad/Assign'
import useStore from '../../store/useStore'
import { getColorFromValue } from './lpColors'
import { Autorenew, Save } from '@mui/icons-material'

const LaunchpadButton = ({
    buttonNumber,
    active,
    borderless,
    bgColor,
    children,
    ...props
}: {
    buttonNumber: number
    children: React.ReactNode
    active?: boolean
    borderless?: boolean
    bgColor?: string
}) => {
  const [open, setOpen] = useState(false)
  const midiMapping = useStore((state) => state.midiMapping)
  const midiEvent = useStore((state) => state.midiEvent)
  const setMidiMapping = useStore((state) => state.setMidiMapping)
  const midiSceneInactiveColor = useStore((state) => state.midiColors.sceneInactiveColor)
  const midiSceneActiveColor = useStore((state) => state.midiColors.sceneActiveColor)
  const midiCommandColor = useStore((state) => state.midiColors.commandColor)
  const midiSceneInactiveType = useStore((state) => state.midiColors.sceneInactiveType)
  const midiSceneActiveType = useStore((state) => state.midiColors.sceneActiveType)
  const midiCommandType = useStore((state) => state.midiColors.commandType)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const currentMapping = midiMapping[0][buttonNumber] || {};
  
  const [midiButtonNumber, setMidiButtonNumber] = useState(currentMapping.buttonNumber || 0)
  const [midiRecord, setMidiRecord] = useState(false)

  useEffect(() => {
    if (midiRecord && midiEvent.button > -1) {
        setMidiButtonNumber(midiEvent.button)
    }
  }, [midiEvent.button])

  return (
    <div>
        <Button
            variant="outlined"
            onContextMenu={(e) => {
                e.preventDefault()
                handleClickOpen()                
            }} 
            sx={{ 
                width: 70,
                height: 70,
                borderRadius: 1,
                borderColor: active ? 'orange' : '#ccc',
                borderStyle: 'solid',
                borderWidth: borderless ? 0 : 1,
                color: active ? 'orange' : '#ccc',
                bgcolor: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                    backgroundColor: darken((bgColor || '#ffffff'), 0.2),
                  },
            }}
            {...props}
        >
        {children}
      </Button>
      <Dialog onClose={handleClose} open={open} 
        PaperProps={{
          sx: {            
            width: 400
          }
        }}>
        <DialogTitle>Edit Launchpad Button {buttonNumber}</DialogTitle>
        <DialogContent>
            <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                <Typography>MIDI Button</Typography>
                <Stack direction={'row'}>
                    <IconButton onClick={() => {
                        setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, buttonNumber: midiButtonNumber}}})
                        setMidiRecord(!midiRecord)
                    }}>{midiRecord ? <Save /> : <Autorenew />}</IconButton>
                    <TextField disabled value={midiButtonNumber} sx={{ width: 70 }} size='small' />
                </Stack>
            </Stack>
            <Assign
                type={'midi'}
                compact={false}
                padIndex={0}
                mapping={midiMapping}
                setMapping={setMidiMapping}
                pressed={false}
                index={`${buttonNumber}`}
                key={`${buttonNumber}`}
            />
            <Divider sx={{ mb: 2.5, mt: 1.5}} />
            <Stack direction={'column'} spacing={1} mt={1}>
                <Typography variant='h6'>Button Color</Typography>
                {currentMapping.command === 'scene' ? <>
                    <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography>Scene inactive</Typography>
                        <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                            <Select disableUnderline value={currentMapping.typeSceneInactive || midiSceneInactiveType || '90'} onChange={(e) => {
                                setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, typeSceneInactive: e.target.value}}})
                            }}>
                            <MenuItem value={'90'}>Solid</MenuItem>
                            <MenuItem value={'91'}>Flash</MenuItem>
                            <MenuItem value={'92'}>Pulse</MenuItem>
                            </Select>
                        <LpColorPicker defaultColor={getColorFromValue(currentMapping.colorSceneInactive || midiSceneInactiveColor)} onColorSelect={(color: string) => {
                            setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, colorSceneInactive: color}}})
                        }} />
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography>Scene active</Typography>
                        <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                            <Select disableUnderline value={currentMapping.typeSceneActive || midiSceneActiveType || '90'} onChange={(e) => {
                                setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, typeSceneActive: e.target.value}}})
                            }}>
                            <MenuItem value={'90'}>Solid</MenuItem>
                            <MenuItem value={'91'}>Flash</MenuItem>
                            <MenuItem value={'92'}>Pulse</MenuItem>
                            </Select>
                        <LpColorPicker defaultColor={getColorFromValue(currentMapping.colorSceneActive || midiSceneActiveColor)} onColorSelect={(color: string) => {
                            setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, colorSceneActive: color}}})
                        }} />
                        </Stack>
                    </Stack>
                </> :
                <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                         <Select disableUnderline value={currentMapping.typeCommand || midiCommandType || '90'} onChange={(e) => {
                            setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, typeCommand: e.target.value}}})
                        }}>
                        <MenuItem value={'90'}>Solid</MenuItem>
                        <MenuItem value={'91'}>Flash</MenuItem>
                        <MenuItem value={'92'}>Pulse</MenuItem>
                        </Select>
                        <LpColorPicker defaultColor={getColorFromValue(currentMapping.colorCommand || midiCommandColor)} onColorSelect={(color: string) => {
                            setMidiMapping({...midiMapping, 0: {...midiMapping[0], [buttonNumber]: {...currentMapping, colorCommand: color}}})
                        }} />
                </Stack>}
            </Stack>
            <Stack direction={'row'} justifyContent={'flex-end'} spacing={1} mt={5}>
                <Button onClick={() => handleClose()}>
                    Cancel
                </Button>
                <Button onClick={() => handleClose()}>
                    Save
                </Button>
            </Stack>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default LaunchpadButton