import React, { useEffect, useState } from 'react';
import useStore from '../../../utils/apiStore';
import { useTheme } from '@material-ui/core/styles';
import { useEditVirtualsStyles } from '../../Devices/EditVirtuals/EditVirtuals.styles'
import { AppBar, Button, Card, CardHeader, Dialog, Grid, IconButton, ListItemIcon, Toolbar, Typography } from '@material-ui/core';
import { Settings, NavigateBefore, CloudDownload, CloudOff, GitHub } from '@material-ui/icons';

import { cloud, Transition, MuiMenuItem } from './CloudComponents'

export default function CloudScreen({
    virtId,
    effectType,
    icon = <Settings />,
    startIcon,
    label = '',
    type,
    className,
    color = 'default',
    variant = 'contained',
    onClick = () => { },
    innerKey,
}) {
    const classes = useEditVirtualsStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [cloudEffects, setCloudEffects] = useState([])
    const [activeCloudPreset, setActiveCloudPreset] = useState();
    const setVirtualEffect = useStore((state) => state.setVirtualEffect);
    const addPreset = useStore((state) => state.addPreset);
    const getPresets = useStore((state) => state.getPresets);
    const getVirtuals = useStore((state) => state.getVirtuals);
    const virtuals = useStore((state) => state.virtuals);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const refreshPresets = async () => {
        const response = await cloud.get('presets', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        if (response.status !== 200) {
            alert("No Access")
            return
        }
        const res = await response.data
        const cEffects = {}
        res.forEach(p => {
            if (!cEffects[p.effect.Name]) {
                cEffects[p.effect.Name] = []
            }
            cEffects[p.effect.Name].push(p)
        })
        setCloudEffects(cEffects)
    }

    const handleCloudPresets = async (p, save) => {
        setActiveCloudPreset(p.Name.toLowerCase())        
        if (p.effect.ledfx_id !== effectType) {
            await setVirtualEffect(virtId, { type: p.effect.ledfx_id })
            await getVirtuals();
        }
        await setVirtualEffect(virtId, { virtId: virtId, type: p.effect.ledfx_id, config: p.config, active: true })
        if (save) {
            await addPreset(virtId, p.Name)
            await getPresets(p.effect.ledfx_id)
        }
        await getVirtuals()
    }

    useEffect(async () => {
        refreshPresets()
    }, [])

    // console.log(virtuals.length && virtuals.find((v)=>v.id === virtId).effect.name, Object.keys(cloudEffects))

    return (
        <>
            {type === 'menuItem'
                ? <MuiMenuItem key={innerKey} className={className} onClick={(e) => { e.preventDefault(); onClick(e); handleClickOpen(e) }}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    {label}
                </MuiMenuItem>
                : <Button
                    variant={variant}
                    startIcon={startIcon}
                    color={color}
                    onClick={(e) => { onClick(e); refreshPresets(); handleClickOpen(e); }}
                    size="small"
                    style={{ padding: '2px 15px' }}
                    className={className}
                >
                    {label}
                    {!startIcon && icon}
                </Button>
            }
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Button color="primary" variant="contained" startIcon={<NavigateBefore />} onClick={handleClose}>
                            back
                        </Button>
                        <Typography variant="h6" className={classes.title}>
                            LedFx Cloud
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {Object.keys(cloudEffects).map((effect, i) =>
                        <div key={i} style={{ order: virtuals.length && virtuals.find((v)=>v.id === virtId).effect.name.toLowerCase() === effect.toLowerCase()  ? -1 : 1 }}>
                            <Typography className={classes.segmentTitle} variant="caption" style={{
                                color: virtuals.length && virtuals.find((v)=>v.id === virtId).effect.name.toLowerCase() === effect.toLowerCase()
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary
                            }}
                            >{effect}</Typography>
                            <Grid style={{ padding: 20 }} container spacing={2}>
                                {cloudEffects[effect].map((p, ind) => <Grid item key={ind}>
                                    <Card className={`${classes.cloudEffectCard} ${ virtuals.length && virtuals.find((v)=>v.id === virtId).effect.name.toLowerCase() === effect.toLowerCase() && activeCloudPreset === p.Name.toLowerCase() ? ' active' : '' }`} key={ind} onClick={() => handleCloudPresets(p)}>
                                        <CardHeader title={p.Name} subheader={<div style={{ color: '#999' }}>{`by ${p.user.username}`}</div>} action={
                                            <IconButton aria-label="Import" onClick={(e)=> { e.stopPropagation(); handleCloudPresets(p, true)}}>
                                                <CloudDownload />
                                            </IconButton>
                                        } />
                                    </Card>
                                </Grid>
                                )}
                            </Grid>
                        </div>)
                    }
                </div>


            </Dialog>
        </>
    )
}
