import { useEffect, useState } from 'react'
import { Box, DialogContent, Divider, ListItemIcon, MenuItem, Popover, Select, Stack, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import { LaunchpadX } from '../../utils/MidiDevices/LaunchpadX/LaunchpadX'
import { Loop, Send, Stop } from '@mui/icons-material'
import ReactGPicker from 'react-gcolor-picker'
import { rgbValues } from '../../utils/MidiDevices/colorHelper'
import useStore from '../../store/useStore'
import { WebMidi } from 'webmidi'
import LpColorPicker from './LpColorPicker'
import ColorTypePicker from './ColorTypePicker'
               
const LaunchpadSettings = ({onClick}: {onClick: () => void}) => {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [loop, setLoop] = useState(false)
  const [speed, setSpeed] = useState(7)
  const [color, setColor] = useState('rgb(128, 0, 0)')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [colorType, setColorType] = useState('90')
  const [buttonNumber, setButtonNumber] = useState(-1)
  const [midiMessageToSend, setMidiMessageToSend] = useState<string>('')
  const [midiLogs, setMidiLogs] = useState<{ name: string; note: string; button: number; }[]>([])
  

  const midiOutput = useStore((state) => state.midiOutput)
  const midiEvent = useStore((state) => state.midiEvent)
  const integrations = useStore((state) => state.integrations)
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
  const sendSpotifyTrack = useStore((state) => state.spotify.sendSpotifyTrack)
  const setSendSpotifyTrack = useStore((state) => state.setSendSpotifyTrack)

  const lp = LaunchpadX
  const output = midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
  const buttons = ['programmer', 'live', 'standalone', 'daw'] as const

  const handleClickOpen = () => {
    setOpen(true)
    onClick()
  }

  const handleClose = (value: string) => {
    setOpen(false)
    setAnchorEl(null)
  }

  useEffect(() => {
    if (midiEvent.button === -1) return
    setMidiLogs((prev) => [...prev, midiEvent])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiEvent])


  useEffect(() => {
    if (sendSpotifyTrack && currentTrack !== '') {
        const [r, g, b] = rgbValues(color) || [128, 0, 0]
        output.send(lp.fn.text(currentTrack, r, g, b, loop, speed));
    }
  }, [currentTrack, sendSpotifyTrack, output, lp, color, loop, speed])

  return (
    <>
        <MenuItem onClick={handleClickOpen}>
            <ListItemIcon><BladeIcon name={'yz:logo2'} /></ListItemIcon>
            <ListItemText primary={'Settings'} /> 
        </MenuItem>
        <Dialog 
            onClose={handleClose}
            open={open}
            onClick={(e) => e.stopPropagation()}
            PaperProps={{
                sx: {
                    maxWidth: 'min(95vw, 750px)',
                    minWidth: 'min(95vw, 750px)',
                    width: '100%'
                }
            }}
        >
            <DialogTitle alignItems={'center'} display={'flex'} mt={2}>
                <BladeIcon name='launchpad' sx={{ mr: 2}} />
                <Typography variant='h4'>Launchpad X - Admin Controller</Typography>
            </DialogTitle>
            <DialogContent>
                <Divider sx={{ mt: 0, mb: 2 }} />
                <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6'>Mode</Typography>
                    <Stack direction="row">
                        {buttons.map((button) => (
                            <Button size='large' key={button} onClick={() => output.send(lp.command[button])}>{button}</Button>
                        ))}
                    </Stack>
                </Stack>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6'>ButtonColor</Typography>
                    <Stack direction="row">
                        <Select value={buttonNumber} onChange={(e) => setButtonNumber(e.target.value as number)} variant='outlined' sx={{ width: 70 }}>
                            {lp.buttonNumbers.map((row, i) => row.map((buttonNumber) => (
                                <MenuItem key={buttonNumber} value={buttonNumber}>{buttonNumber}</MenuItem>
                            )))}
                        </Select>
                        <ColorTypePicker value={colorType} onChange={(e) => setColorType(e.target.value)} isRgb variant='outlined'/>
                        <LpColorPicker defaultColor={color} onColorSelect={(e) => console.log(e)} type={colorType} height={56} />
                        <Button onClick={()=>{
                            const [r, g, b] = rgbValues(color) || [128, 0, 0]
                            const midiMsg = lp.fn.text(msg, r, g, b, loop, speed)
                            output.send(midiMsg)
                        }}><Send /></Button>
                    </Stack>
                </Stack>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6'>Text</Typography>                    
                    <Stack direction="row">
                        <TextField 
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <TextField 
                            type='number' 
                            label="Speed"
                            value={speed}
                            sx={{ width: '80px', flexShrink: 0 }}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            inputProps={{
                                min: 1,
                                max: 40,                            
                            }}/>
                        <Button sx={{ backgroundColor: color, '&:hover': {backgroundColor: color}}} onClick={(event)=>setAnchorEl(event.currentTarget)} />
                        <Popover
                            id={open ? 'color-popover' : undefined}
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={()=> setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Box sx={{ maxHeight: 700, overflowY: 'auto', p: 1, width: 283 }}>
                            
                            <ReactGPicker                        
                                format='rgb'
                                showAlpha={false}
                                debounceMS={8}
                                defaultColors={[]}
                                value={color}
                                onChange={(color: string) => {
                                    setColor(color)
                                }}
                            
                            />
                            </Box>
                        </Popover>
                        <Button onClick={()=>setLoop(!loop)}><Loop sx={{ color: loop ? 'inherit' : 'GrayText'}} /></Button>
                        {integrations.spotify?.active && spAuthenticated && <Button onClick={() => setSendSpotifyTrack(!sendSpotifyTrack)}><BladeIcon name='mdi:spotify' sx={{ color: sendSpotifyTrack ? 'inherit' : 'GrayText'}} /></Button>}
                        <Button onClick={()=>output.send(lp.command.stopText)}><Stop /></Button>
                        <Button onClick={()=>{
                            const [r, g, b] = rgbValues(color) || [128, 0, 0]
                            const midiMsg = lp.fn.text(msg, r, g, b, loop, speed)
                            output.send(midiMsg)
                        }}><Send /></Button>
                    </Stack>
                </Stack>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Stack direction="row" spacing={7} alignItems={'center'}>
                    <Typography variant='h6'>RAW MIDI</Typography>
                    <Stack direction="row" flexGrow={1}>
                    <TextField variant='outlined' size='medium' fullWidth value={midiMessageToSend} onChange={(e) => setMidiMessageToSend(e.target.value)} />
                    <Button 
                        onClick={()=>{
                            const output = midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
                            if (!output) return
                            output.send(midiMessageToSend.replaceAll(', ',' ').split(' ').map((v: any) => parseInt(v)) || [])
                        }}
                        onContextMenu={() => {
                            const output = midiOutput !== '' ? WebMidi.getOutputByName(midiOutput) : WebMidi.outputs[1]
                            if (!output) return
                            if ('text' in lp.fn && lp.fn.text) output.send(lp.fn.text('Hacked by Blade!', 128, 0, 0))
                        }}
                    >
                        <Send />
                    </Button>
                </Stack>
                </Stack>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Stack direction="row" spacing={4} alignItems={'flex-start'}>
                    <Typography variant='h6'>Incoming MIDI</Typography>
                    <Box flexGrow={1}>
                        <Stack direction={'row'}>
                            <Typography width={200} textAlign={'left'} variant='caption'>Name</Typography>
                            <Typography width={50} variant='caption'>Note</Typography>
                            <Typography width={50} variant='caption'>Button</Typography>
                            <Typography variant='caption' sx={{ cursor: 'pointer'}} onClick={() => setMidiLogs([])}>Clear Logs</Typography>
                        </Stack>
                        <Divider sx={{ mb: 0.5 }} />
                        <Stack>
                            <Box sx={{overflowY: 'auto', height: 120}}>
                                {midiLogs.map((log, index) => <Stack key={index} direction={'row'}>
                                    <Typography width={200} variant='caption'>{log.name}</Typography>
                                    <Typography width={50} variant='caption'>{log.note}</Typography>
                                    <Typography width={50} variant='caption'>{log.button}</Typography>
                                </Stack>)}
                            </Box>
                        </Stack>
                    </Box>                
                </Stack>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default LaunchpadSettings