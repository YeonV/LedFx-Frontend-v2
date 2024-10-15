import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Select, Slider, Stack, Switch, Tooltip, useTheme } from '@mui/material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import BladeIcon from '../../../../Icons/BladeIcon/BladeIcon'
import useStore from '../../../../../store/useStore'
  
const SpTexter = () => {
    const theme = useTheme()
    const schemas = useStore((state) => state.schemas)
    const virtuals = useStore((state) => state.virtuals)
    const integrations = useStore((state) => state.integrations)
    const currentTrack = useStore((state) => state.spotify.currentTrack)
    const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
    const spotifyTexter = useStore((state) => state.spotify.spotifyTexter)
    const sendSpotifyTrack = useStore((state) => state.spotify.sendSpotifyTrack)
    const colors = useStore((state) => state.colors)

    const setSendSpotifyTrack = useStore((state) => state.setSendSpotifyTrack)
    const setSpTexterTextColor = useStore((state) => state.setSpTexterTextColor)
    const setSpTexterFlipVertical = useStore((state) => state.setSpTexterFlipVertical)
    const setSpTexterFlipHorizontal = useStore((state) => state.setSpTexterFlipHorizontal)
    const setSpTexterUseGradient = useStore((state) => state.setSpTexterUseGradient)
    const setSpTexterAlpha = useStore((state) => state.setSpTexterAlpha)
    const setSpTexterBackground = useStore((state) => state.setSpTexterBackground)
    const setSpTexterGradient = useStore((state) => state.setSpTexterGradient)
    const setSpTexterGradientRoll = useStore((state) => state.setSpTexterGradientRoll)
    const setSpTexterRotate = useStore((state) => state.setSpTexterRotate)
    const setSpTexterHeightPercent = useStore((state) => state.setSpTexterHeightPercent)
    const setSpTexterBrightness = useStore((state) => state.setSpTexterBrightness)
    const setSpTexterSpeed = useStore((state) => state.setSpTexterSpeed)
    const setSpTexterBackgroundBrightness = useStore((state) => state.setSpTexterBackgroundBrightness)
    const setSpTexterFont = useStore((state) => state.setSpTexterFont)
    const setSpTexterTextEffect = useStore((state) => state.setSpTexterTextEffect)
    const setEffect = useStore((state) => state.setEffect)

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState('')

    const matrix = Object.keys(virtuals).filter((v: string) => virtuals[v].config.rows > 1)    

    useEffect(() => {
        if (sendSpotifyTrack && currentTrack !== '' && selected !== '') {
            setEffect(selected, 'texter2d', {...spotifyTexter, text: currentTrack}, true, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack, sendSpotifyTrack, spotifyTexter, selected])

    if (!(integrations.spotify?.active && spAuthenticated)) return null

    return (<Box>
        <IconButton onClick={() => setOpen(!open)}><BladeIcon name='Title' sx={{ color: sendSpotifyTrack ? theme.palette.primary.main : 'GrayText'}} /></IconButton>
        <Dialog className='nodrag' open={open} onClose={() => setOpen(false)} PaperProps={{ onDrag: (e: any) => e.stopProagation()}} onDrag={(e: any) => e.stopProagation()}>
            <DialogTitle>Send songname to matrix</DialogTitle>
            <DialogContent>
                <Stack direction='row' spacing={1} mb={2}>
                    <Select fullWidth variant='outlined' value={selected} onChange={(e) => setSelected(e.target.value)}>
                        {matrix.map((v) => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>
                    <Button color={sendSpotifyTrack ? 'primary' : 'inherit'} onClick={() => setSendSpotifyTrack(!sendSpotifyTrack)}>
                        {sendSpotifyTrack ? 'ON' : 'OFF'}
                    </Button>
                </Stack>
                <Stack direction='row' spacing={1} mb={2} sx={{'& .color-picker-panel, & .popup_tabs-header, & .popup_tabs, & .colorpicker, & .colorpicker .color-picker-panel, & .popup_tabs-header .popup_tabs-header-label-active': { backgroundColor: 'transparent' }}}>
                    {
                        spotifyTexter.use_gradient 
                            ? <GradientPicker isGradient={true} colors={colors} title={'Gradient'} pickerBgColor={spotifyTexter.gradient} sendColorToVirtuals={(v: string) => setSpTexterGradient(v)} />
                            : <GradientPicker isGradient={false} colors={colors} title={'Text Color'} pickerBgColor={spotifyTexter.text_color} sendColorToVirtuals={(v: string) => setSpTexterTextColor(v)} />
                    }
                    <GradientPicker isGradient={false} colors={colors} title={'BG Color'} pickerBgColor={spotifyTexter.background_color} sendColorToVirtuals={(v: string) => setSpTexterBackground(v)} />                            
                </Stack>
                <Stack direction='row' spacing={1} mb={2}>
                    <BladeFrame title='Brightness' style={{ width: '50%' }}>
                        <Slider min={0} max={1} step={0.01} valueLabelDisplay='auto' value={spotifyTexter.brightness} onChange={(_e, v) => typeof v === 'number' && setSpTexterBrightness(v)} />
                    </BladeFrame>
                    <BladeFrame title='Height %' style={{ width: '50%' }}>
                        <Slider min={0} max={1} step={0.01} valueLabelDisplay='auto' value={spotifyTexter.background_brightness} onChange={(_e, v) => typeof v === 'number' && setSpTexterBackgroundBrightness(v)} />
                    </BladeFrame>
                </Stack>
                <Stack direction='row' spacing={1} mb={2}>
                    {/* all booleans */}
                    <BladeFrame style={{ width: '25%' }} title='Gradient'>
                        <Switch
                            checked={spotifyTexter.use_gradient}
                            onChange={(_e, b) => setSpTexterUseGradient(b)}
                            name={'Gradient'}
                            color="primary"
                        />
                    </BladeFrame>
                    <BladeFrame style={{ width: '25%' }} title='Alpha'>
                        <Switch
                            checked={spotifyTexter.alpha}
                            onChange={(_e, b) => setSpTexterAlpha(b)}
                            name={'Alpha'}
                            color="primary"
                        />
                    </BladeFrame>                            
                    <BladeFrame style={{ width: '25%' }} title='Flip H'>
                        <Switch
                            checked={spotifyTexter.flip_horizontal}
                            onChange={(_e, b) => setSpTexterFlipHorizontal(b)}
                            name={'Flip Hl'}
                            color="primary"
                        />
                    </BladeFrame>
                    <BladeFrame style={{ width: '25%' }} title='Flip V'>
                        <Switch
                            checked={spotifyTexter.flip_vertical}
                            onChange={(_e, b) => setSpTexterFlipVertical(b)}
                            name={'Flip V'}
                            color="primary"
                        />
                    </BladeFrame>
                </Stack>
                <Stack direction='row' spacing={1} mb={2}>
                    <BladeFrame title='Gradient Roll' style={{ width: '50%' }}>
                        <Slider min={0} max={10} step={0.1} valueLabelDisplay='auto' value={spotifyTexter.gradient_roll} onChange={(_e, v) => typeof v === 'number' && setSpTexterGradientRoll(v)} />
                    </BladeFrame>
                    <BladeFrame title='Rotate' style={{ width: '50%' }}>
                        <Slider min={0} max={3} step={1} valueLabelDisplay='auto' value={spotifyTexter.rotate} onChange={(_e, v) => typeof v === 'number' && setSpTexterRotate(v)} />
                    </BladeFrame>
                </Stack>
                <Stack direction='row' spacing={1} mb={2}>
                    <BladeFrame title='Speed' style={{ width: '50%' }}>
                        <Slider min={0} max={10} step={0.1} valueLabelDisplay='auto' value={spotifyTexter.speed_option_1} onChange={(_e, v) => typeof v === 'number' && setSpTexterSpeed(v)} />
                    </BladeFrame>
                    <BladeFrame title='Height %' style={{ width: '50%' }}>
                        <Slider min={0} max={150} step={1} valueLabelDisplay='auto' value={spotifyTexter.height_percent} onChange={(_e, v) => typeof v === 'number' && setSpTexterHeightPercent(v)} />
                    </BladeFrame>
                </Stack>
                <Stack direction='row' spacing={1} mb={2}>
        
                    <BladeFrame title='Font' style={{ width: '50%' }}>
                        <Select fullWidth variant='standard' disableUnderline value={spotifyTexter.font} onChange={(e) => setSpTexterFont(e.target.value)}>
                            {schemas.effects.texter2d.schema.properties.font.enum.map((f: string) => (
                                <MenuItem key={f} value={f}>{f}</MenuItem>
                            ))}
                        </Select>
                    </BladeFrame>
                    <BladeFrame title='Font' style={{ width: '50%' }}>
                        <Select fullWidth variant='standard' disableUnderline value={spotifyTexter.text_effect} onChange={(e) => setSpTexterTextEffect(e.target.value)}>
                            {schemas.effects.texter2d.schema.properties.text_effect.enum.map((f: string) => (
                                <MenuItem key={f} value={f}>{f}</MenuItem>
                            ))}
                        </Select>
                    </BladeFrame>
                </Stack>
            </DialogContent>
        </Dialog>
    </Box>)
}

export default SpTexter