import { useState } from 'react';
import Popover from '../../components/Popover/Popover';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { useLongPress } from 'use-long-press';
import { CloudOff, CloudUpload } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';
import { CopyAll } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    bladeMenu: {
        "& .MuiPaper-root": {
            backgroundColor: theme.palette.grey[900]
        }
    },
}));

export default function PresetButton({ delPreset, uploadPresetCloud, deletePresetCloud, label = "Button", buttonColor, className, onClick }) {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isLogged = useStore((state) => state.isLogged);
    const features = useStore((state) => state.features);

    const longPress = useLongPress((e) => { e.preventDefault(); setAnchorEl(e.currentTarget || e.target) }, {
        onCancel: e => {
            if (e.button === 0) {
                onClick()
            }
        },
        treshhold: 1000,
        captureEvent: true,
    });

    return (
        <div>
            <Button
                aria-expanded={open ? 'true' : undefined}
                variant="outlined"
                color={buttonColor}
                className={className}
                {...longPress}
                onContextMenu={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget || e.target) }}
            >
                {label}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                getContentAnchorEl={null}
                className={classes.bladeMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div>
                    <Popover
                        type="menuItem"
                        variant="outlined"
                        direction="left"
                        onConfirm={delPreset}
                        label={"Delete Preset"}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                    />
                </div>
                <MenuItem onClick={(e) => { uploadPresetCloud(e); setAnchorEl(null); }}>
                        <ListItemIcon>
                            <CopyAll fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Copy Preset</ListItemText>
                    </MenuItem>
                {(window.localStorage.getItem('ledfx-cloud-role') === 'creator') && features['cloud'] && isLogged &&
                    <MenuItem onClick={(e) => { uploadPresetCloud(e); setAnchorEl(null); }}>
                        <ListItemIcon>
                            <CloudUpload fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Upload to Cloud</ListItemText>
                    </MenuItem>}
                {(window.localStorage.getItem('ledfx-cloud-role') === 'creator') && features['cloud'] && isLogged &&
                    <MenuItem onClick={(e) => { deletePresetCloud(e); setAnchorEl(null); }}>
                        <ListItemIcon>
                            <CloudOff fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete from Cloud</ListItemText>
                    </MenuItem>}
            </Menu >
        </div >
    );
}
