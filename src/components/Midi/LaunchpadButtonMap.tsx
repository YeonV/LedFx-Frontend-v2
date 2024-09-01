import { ArrowForwardIos,  BrightnessHigh, Collections, MusicNote, Numbers, Pause, PlayArrow } from '@mui/icons-material'
import { Avatar, Box, Button, Chip, FormControlLabel, Stack, Switch, Typography, useTheme } from '@mui/material'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import useStore from '../../store/useStore'
import Assign from '../Gamepad/Assign'
import { useState } from 'react'

const LaunchpadButtonMap = () => {
    const theme = useTheme()
    const [showMapping, setShowMapping] = useState(false)
    const midiEvent = useStore((state) => state.midiEvent)
    const midiMapping = useStore((state) => state.midiMapping)
    const recentScenes = useStore((state) => state.recentScenes)
    const setMidiMapping = useStore((state) => state.setMidiMapping)
    const matrix = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))
    const RightButton = ({children}: {
        children: React.ReactNode
    }) => <Box position={'relative'} alignSelf={'stretch'} justifySelf={'stretch'} display={'flex'} alignItems={'center'} justifyContent={'center'}><ArrowForwardIos /><Typography textTransform={'none'} variant='caption' color={'InactiveCaptionText'} position={'absolute'} bottom={0}>{children}</Typography></Box>
    const labels = (rowI: number, butI: number) => {
        if (rowI === 0 && butI === 0) return <Stack><PlayArrow sx={{ transform: 'rotate(270deg)'}} />{showMapping && <BrightnessHigh />}</Stack>
        if (rowI === 0 && butI === 1) return <Stack><PlayArrow sx={{ transform: 'rotate(90deg)'}} />{showMapping && <BrightnessHigh />}</Stack>
        if (rowI === 0 && butI === 2) return <Stack><PlayArrow sx={{ transform: 'rotate(180deg)'}} />{showMapping && <Collections />}</Stack>        
        if (rowI === 0 && butI === 3) return <Stack><PlayArrow sx={{ transform: 'rotate(0deg)'}} />{showMapping && <Pause />}</Stack>        
        if (rowI === 0 && butI === 3) return <PlayArrow />
        if (rowI === 0 && butI === 4) return <Typography textTransform={'none'} variant='caption' color={'InactiveCaptionText'}><br />Session Mixer</Typography>
        if (rowI === 0 && butI === 5) return <Typography textTransform={'none'} variant='caption' color={'InactiveCaptionText'}>Note</Typography>
        if (rowI === 0 && butI === 6) return <Typography textTransform={'none'} variant='caption' color={'InactiveCaptionText'}>Custom</Typography>
        if (rowI === 0 && butI === 7) return <Typography textTransform={'none'} variant='caption' color={'InactiveCaptionText'}><br />Capture MIDI</Typography>
        if (rowI === 0 && butI === 8) return <BladeIcon sx={{ fontSize: '58px !important', '& svg': { width: '54px', height: '54px'}}} name='launchpad' />
        if (rowI === 1 && butI === 8) return <RightButton>Volume</RightButton>
        if (rowI === 2 && butI === 8) return <RightButton>Pan</RightButton>
        if (rowI === 3 && butI === 8) return <RightButton>Send&nbsp;B</RightButton>
        if (rowI === 4 && butI === 8) return <RightButton>Send&nbsp;A</RightButton>
        if (rowI === 5 && butI === 8) return <RightButton>Stop&nbsp;Clip</RightButton>
        if (rowI === 6 && butI === 8) return <RightButton>Mute</RightButton>
        if (rowI === 7 && butI === 8) return <RightButton>Solo</RightButton>
        if (rowI === 8 && butI === 8) return <RightButton>Record&nbsp;Arm</RightButton>
        return showMapping ? `${(9 - rowI)}${butI + 1}` : null
    }
    // console.log(midiMapping)

  return (
    <>
    <Stack direction={'row'} spacing={2} mb={2}>
        <Typography variant={'h6'}>Last Event: </Typography>
    <Chip label={midiEvent.note} avatar={<Avatar><MusicNote /></Avatar>}/>
    <Chip label={midiEvent.button} avatar={<Avatar><Numbers /></Avatar>}/>
    
    <FormControlLabel control={<Switch checked={showMapping} onChange={() => setShowMapping(!showMapping)} />} label="Show Mapping" />
    </Stack>
    <Stack direction={'row'} spacing={2} mb={2}>
    <Stack direction={'column'} spacing={1}>
    {matrix.map((row, rowIndex) => {
        return (
            <Stack key={'row' + rowIndex} direction={'row'} spacing={1}>
            {row.map((_button, buttonIndex) => {
                const row = 9 - rowIndex;
                const column = buttonIndex + 1;
                
                const bgColor = midiEvent.button === parseInt(`${(row)}${column}`)
                    ? theme.palette.primary.main 
                    : midiMapping[0][parseInt(`${(row)}${column}`)]?.command && 
                        midiMapping[0][parseInt(`${(row)}${column}`)]?.command === 'scene' &&
                        midiMapping[0][parseInt(`${(row)}${column}`)]?.payload.scene === recentScenes[0]
                        ? 'green' 
                        : midiMapping[0][parseInt(`${(row)}${column}`)]?.command && 
                        midiMapping[0][parseInt(`${(row)}${column}`)]?.command === 'scene' 
                            ? 'red' 
                            : midiMapping[0][parseInt(`${(row)}${column}`)]?.command && 
                                midiMapping[0][parseInt(`${(row)}${column}`)]?.command !== 'none'  && rowIndex !== 0
                                ? 'orange' 
                            : rowIndex === 0 || buttonIndex === 8
                                    ? 'black' 
                                : '#ccc'
                return (
                <Button key={'button' + buttonIndex} sx={{ 
                    width: 70,
                    height: 70,
                    borderRadius: 1,
                    borderColor: rowIndex === 0 && midiMapping[0][parseInt(`${(row)}${column}`)]?.command && midiMapping[0][parseInt(`${(row)}${column}`)]?.command !== 'none' ? 'orange' : '#ccc',
                    borderStyle: 'solid',
                    borderWidth: (rowIndex === 0 && buttonIndex === 8) ? 0 : 1,
                    color: rowIndex === 0 && midiMapping[0][parseInt(`${(row)}${column}`)]?.command && midiMapping[0][parseInt(`${(row)}${column}`)]?.command !== 'none' ? 'orange' : '#ccc',
                    bgcolor: bgColor,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {labels(rowIndex, buttonIndex)}                   
                </Button>
                )
            })}
            </Stack>
        )
    })}
</Stack>
<Stack direction={'column'} spacing={1} maxHeight={694} width={300} sx={{ overflowY: 'scroll'}}>
{matrix.map((row, rowIndex) => row.map((button, buttonIndex) => {
    return (
        <Assign
            padIndex={0}
            mapping={midiMapping}
            setMapping={setMidiMapping}
            pressed={midiEvent.button === parseInt(`${(rowIndex + 1)}${buttonIndex + 1}`)}
            index={`${(rowIndex + 1)}${buttonIndex + 1}`}
            key={`${(rowIndex + 1)}${buttonIndex + 1}`}
        />
    )
}))}
    </Stack>


</Stack>
</>)
}

export default LaunchpadButtonMap