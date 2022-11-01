/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import isElectron from 'is-electron';
import useStore from '../../store/useStore';


export default function NoHostDialog() {
  const dialogOpen = useStore((state) => state.dialogs.nohost?.open || false);
  const edit = useStore((state) => state.dialogs.nohost?.edit || false);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const setDisconnected = useStore((state) => state.setDisconnected);
  const setHost = useStore((state) => state.setHost);
  const storedURL = window.localStorage.getItem('ledfx-host');
  const storedURLs = JSON.parse(
    window.localStorage.getItem('ledfx-hosts') ||
      JSON.stringify(['http://localhost:8888'])
  );
  const [hosts, setHosts] = useState(['http://localhost:8888']);
  const [hostvalue, setHostvalue] = useState('http://localhost:8888');

  const handleClose = () => {
    setDialogOpen(false);
  };
 
  const handleSave = (ho:string) => {
    setHost(ho);
    if (!hosts.some((h) => h === ho)) {
      window.localStorage.setItem(
        'ledfx-hosts',
        JSON.stringify([...hosts, ho])
      );
    } else {
      window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts]));
    }
    setDialogOpen(false);
    setDisconnected(false);
    window.location.reload();
  };

  const handleDelete = (e: any, title: string) => {
    e.stopPropagation();
    window.localStorage.setItem(
      'ledfx-hosts',
      JSON.stringify(hosts.filter((h) => h !== title))
    );
    setHosts(hosts.filter((h) => h !== title));
  };

  useEffect(() => {
    if (storedURL) setHostvalue(storedURL);
    if (storedURLs) setHosts(storedURLs);
  }, [storedURL, setHosts]);

  useEffect(() => {
    if (!storedURL) {
      setHost(
        isElectron()
          ? 'http://localhost:8888'
          : window.location.href.split('/#')[0].replace(/\/+$/, '')
      );
      window.localStorage.setItem(
        'ledfx-host',
        isElectron()
          ? 'http://localhost:8888'
          : window.location.href.split('/#')[0].replace(/\/+$/, '')
      );
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href;
    }
  }, []);

  return (
    <div key="nohost-dialog">
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {edit
            ? 'LedFx-Core Host'
            : window.process?.argv.indexOf('integratedCore') === -1
              ? 'No LedFx-Core found'
              : 'LedFx-Core not ready'}
        </DialogTitle>
        <DialogContent>
          {!edit && (
            <DialogContentText>
              You can change the host if you want:
            </DialogContentText>
          )}
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <TextField label="IP:Port" variant="outlined" value={hostvalue} onKeyDown={(e) => e.key === 'Enter' && setHosts([...hosts,hostvalue])} onChange={(e) => setHostvalue(e.target.value)} />
            <Button aria-label="add" onClick={() => setHosts([...hosts,hostvalue])}>
              <Add />
            </Button>
          </div>
          <Typography variant='caption'> Known Hosts</Typography>
          <div>
            {hosts.map(h=><div key={h}>
              <div style={{ display: 'flex' }}>
                <Button size="medium" sx={{ textTransform: 'none' }} fullWidth aria-label="connect" onClick={() => {
                  setHostvalue(h)
                  handleSave(h)
                }}>
                  {h}
                </Button>
                <Button aria-label="delete" onClick={(e) => h && handleDelete(e, h)}>
                  <Delete />
                </Button>
              </div>             
            </div>)}              
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
