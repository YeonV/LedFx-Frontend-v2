import * as React from 'react';
import useStore from '../../utils/apiStore';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function AboutDialog({ className, children, startIcon, title }) {
    const config = useStore((state) => state.config);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" startIcon={startIcon} variant="outlined" className={className} onClick={handleClickOpen}>
                {children}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="about-dialog-title"
                aria-describedby="about-dialog-description"
            >
                <DialogTitle id="about-dialog-title">
                    {"About (WIP)"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="about-dialog-description">
                        backend:<br />
                        configuration_version: {config.configuration_version} <br />
                        host: {config.host} <br />
                        port: {config.port} <br />
                        port_s: {config.port_s} <br />
                        dev_mode: {config.dev_mode ? 'yes' : 'no'} <br />
                        commit: incoming<br />
                        <br />
                        frontend:<br />
                        version: b28<br />
                        commit: incoming<br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
