import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import useStore from '../../utils/apiStore';
import axios from 'axios';
import { useEditVirtualsStyles } from '../Devices/EditVirtuals/EditVirtuals.styles'
import { useTheme } from '@material-ui/core/styles';
import { Card, CardHeader, Grid, ListItemIcon, MenuItem } from '@material-ui/core';
import { Settings } from '@material-ui/icons';

const cloud = axios.create({
    baseURL: 'https://strapi.yeonv.com',
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MuiMenuItem = React.forwardRef((props, ref) => {
    return <MenuItem ref={ref} {...props} />;
});

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
    const [open, setOpen] = React.useState(false);
    const [cloudEffects, setCloudEffects] = useState([])
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
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem('jwt')}`,
            }
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

    useEffect(async () => {
        refreshPresets()
    }, [])



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
                    className={className}
                >
                    {label}
                    {!startIcon && icon}
                </Button>
            }
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Button
                            autoFocus
                            color="primary"
                            variant="contained"
                            startIcon={<NavigateBeforeIcon />}
                            onClick={handleClose}
                            style={{ marginRight: '1rem' }}
                        >
                            back
                        </Button>
                        <Typography variant="h6" className={classes.title}>
                            LedFx Cloud
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {Object.keys(cloudEffects).map((e, i) => <div key={i} style={{ order: virtuals[virtId].effect.name === e ? -1 : 1 }}>
                        <Typography className={classes.segmentTitle} variant="caption" style={{ color: virtuals[virtId].effect.name === e ? theme.palette.primary.main : theme.palette.text.primary }}>{e}</Typography>
                        <Grid style={{ padding: 20 }} container spacing={2}>
                            {cloudEffects[e].map((p, ind) => <Grid item key={ind}>
                                <Card className={classes.cloudEffectCard} key={ind} onClick={() => {
                                    setVirtualEffect(
                                        virtId,
                                        {
                                            virtId: virtId,
                                            type: effectType,
                                            config: p.config,
                                            active: true
                                        }
                                    ).then(() => addPreset(virtId, p.Name).then(() => {
                                        getPresets(effectType)
                                    })).then(() => getVirtuals());
                                }}>
                                    <CardHeader title={p.Name} subheader={`by ${p.user.username}`} />
                                </Card>
                            </Grid>
                            )}

                            {/* <Grid item key={"ho"}>
                            <Card>
                                <CardHeader title={"Test Preset"} subheader={`by Blade`} />
                            </Card>

                        </Grid> */}
                        </Grid>
                    </div>)
                    }
                </div>


            </Dialog>
        </>
    )
}
