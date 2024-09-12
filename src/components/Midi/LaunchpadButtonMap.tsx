import { ArrowForwardIos,  BrightnessHigh, Collections, MusicNote, Numbers, Pause, PlayArrow } from '@mui/icons-material'
import { Avatar, Box, Button, Chip, FormControlLabel, FormLabel, Stack, Switch, Typography, useTheme } from '@mui/material'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import useStore from '../../store/useStore'
import Assign from '../Gamepad/Assign'
import { useEffect, useState } from 'react'
import { WebMidi } from 'webmidi'
import LaunchpadButton from './LaunchpadButton'
import { getColorFromValue } from './lpColors'
import { defaultMapping, IMapping } from '../../store/ui/storeMidi'
import LaunchpadColors from './LaunchpadColors'

const LaunchpadButtonMap = () => {
    const theme = useTheme()
    const [showMapping, setShowMapping] = useState(false)
    const initMidi = useStore((state) => state.initMidi)
    const midiEvent = useStore((state) => state.midiEvent)
    const midiOutput = useStore((state) => state.midiOutput)
    const recentScenes = useStore((state) => state.recentScenes)
    const midiMapping = useStore((state) => state.midiMapping)
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

    const setMode = (mode: 'programmer' | 'live') => {
        initMidi()
        const output = WebMidi.getOutputByName(midiOutput)
        output.send([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0C, 0x0E, mode === 'programmer' ? 0x01 : 0x00, 0xF7])
    }

    useEffect(() => {        
        initMidi()
    }, [])

  return (
    <>
    <Stack direction={'row'} alignItems={'center'} spacing={2} mb={2}>
        <Typography variant={'h6'}>Last Event: </Typography>
        <Chip label={midiEvent.note} avatar={<Avatar><MusicNote /></Avatar>}/>
        <Chip label={midiEvent.button} avatar={<Avatar><Numbers /></Avatar>}/>    
        <FormControlLabel control={<Switch checked={showMapping} onChange={() => setShowMapping(!showMapping)} />} label="Show Mapping" />
        <LaunchpadColors />
        <Button onClick={() => {
            const m = JSON.parse(JSON.stringify(midiMapping));
            Object.keys(m).forEach(mappingKey => {
                const nestedMapping = m[parseInt(mappingKey) as keyof typeof m];
                Object.keys(nestedMapping).forEach(key => {
                    const b = nestedMapping[parseInt(key) as keyof typeof nestedMapping];
                    delete b.colorCommand;
                    delete b.colorSceneActive;
                    delete b.colorSceneInactive;
                });
            });
            setMidiMapping(m);
            }}>
                Reset Colors
        </Button>





        <Button onClick={() => {
            setMidiMapping({
                0: defaultMapping,
              } as IMapping);
            }}>
                Reset All
            </Button>
        <FormLabel>Mode:</FormLabel>
        <Stack direction={'row'} alignItems={'center'} spacing={0}>
        <Button onClick={() => setMode('programmer')}>Programmer</Button>
        <Button onClick={() => setMode('live')}>Live</Button>
        </Stack>
    </Stack>
    <Stack direction={'row'} spacing={2} mb={2}>
    <Stack direction={'column'} spacing={1}>
    {matrix.map((row, rowIndex) => {
        return (
            <Stack key={'row' + rowIndex} direction={'row'} spacing={1}>
            {row.map((_button, buttonIndex) => {
                const row = 9 - rowIndex
                const column = buttonIndex + 1
                const buttonNumber = `${(row)}${column}`
                const btnNumberInt = parseInt(buttonNumber)
                const btn = midiMapping[0][btnNumberInt]
                
                const bgColor = midiEvent.button === btnNumberInt
                    ? theme.palette.primary.main 
                    : btn?.command && 
                        btn?.command === 'scene' &&
                        btn?.payload.scene === recentScenes[0]
                        ? getColorFromValue(btn?.colorSceneActive || '1E') || '#0f0'
                        : btn?.command && 
                        btn?.command === 'scene' 
                            ? getColorFromValue(btn?.colorSceneInactive || '07') || '#f00'
                            : btn?.command && 
                                btn?.command !== 'none'  && rowIndex !== 0
                                ? getColorFromValue(btn?.colorCommand || '63') || '#ff0'
                            : rowIndex === 0 || buttonIndex === 8
                                    ? '#000' 
                                : '#ccc'
                return (
                    <LaunchpadButton
                        buttonNumber={btnNumberInt}
                        active={!!(rowIndex === 0 && btn?.command && btn?.command !== 'none')}
                        bgColor={bgColor}
                        key={'button' + buttonIndex}
                        borderless={rowIndex === 0 && buttonIndex === 8}
                    >
                        {labels(rowIndex, buttonIndex)}
                    </LaunchpadButton>
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
            type={'midi'}
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