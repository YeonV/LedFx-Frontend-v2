import { useEffect, useState } from 'react'
import BladeIcon from '../../../../Icons/BladeIcon/BladeIcon'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, Tooltip, useTheme } from '@mui/material'
import useStore from '../../../../../store/useStore'

const SpTexter = () => {
    const theme = useTheme()
    const virtuals = useStore((state) => state.virtuals)
    const integrations = useStore((state) => state.integrations)
    const currentTrack = useStore((state) => state.spotify.currentTrack)
    const spAuthenticated = useStore((state) => state.spotify.spAuthenticated)
    const sendSpotifyTrack = useStore((state) => state.spotify.sendSpotifyTrack)
    const setSendSpotifyTrack = useStore((state) => state.setSendSpotifyTrack)
    const setEffect = useStore((state) => state.setEffect)
    const updateEffect = useStore((state) => state.updateEffect)

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState('')

    const matrix = Object.keys(virtuals).filter(
        (v: string) => virtuals[v].config.rows > 1
    )

    console.log(matrix)

    useEffect(() => {
        if (sendSpotifyTrack && currentTrack !== '' && selected !== '') {
            setEffect(selected, 'texter2d', {}, true)
            updateEffect(selected, 'texter2d', { text: currentTrack, rotate: 2, flip_horizontal: true, speed_option_1: 2, text_color: "#ff0000" }, false)
            console.log(currentTrack)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack, sendSpotifyTrack])

    if (!(integrations.spotify?.active && spAuthenticated)) return 'hello'

    return (
        <Tooltip title='Automagically show artist & title on spotify song change'>
            <>
            <IconButton onClick={() => setOpen(!open)}><BladeIcon name='Title' sx={{ color: sendSpotifyTrack ? theme.palette.primary.main : 'GrayText'}} /></IconButton>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Send songname to matrix</DialogTitle>
                <DialogContent>
                    <Stack direction='row' spacing={1}>
                    <Select fullWidth variant='outlined' value={selected} onChange={(e) => setSelected(e.target.value)}>
                        {matrix.map((v) => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>
                    <Button color={sendSpotifyTrack ? 'primary' : 'inherit'} onClick={() => setSendSpotifyTrack(!sendSpotifyTrack)}>
                        {sendSpotifyTrack ? 'ON' : 'OFF'}
                    </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
            </>
        </Tooltip>
    )
}

export default SpTexter