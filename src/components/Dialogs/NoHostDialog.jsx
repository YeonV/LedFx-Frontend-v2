import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import useStore from '../../utils/apiStore';

const filter = createFilterOptions();

export default function NoHostDialog() {
  const dialogOpen = useStore((state) => state.dialogs.nohost?.open || false);
  const edit = useStore((state) => state.dialogs.nohost?.edit || false);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const setHost = useStore((state) => state.setHost);
  const storedURL = window.localStorage.getItem('ledfx-host');
  const storedURLs = JSON.parse(window.localStorage.getItem('ledfx-hosts')) || [{ title: 'http://localhost:8888' }];
  const [hosts, setHosts] = useState([{ title: 'http://localhost:8888' }]);
  const [hostvalue, setHostvalue] = useState({ title: 'http://localhost:8888' });

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    
    if (typeof hostvalue !== 'string') {
      setHost(hostvalue.title);
      if (!hosts.some(h=> h.title === hostvalue.title)) {        
        window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts, hostvalue]))
      } else {
        window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts]))
      }
    } else {      
      setHost(hostvalue);
    }
    setDialogOpen(false);
    window.location = window.location.href;
  };

  const handleDelete = (e, title) => {
    e.stopPropagation();
    window.localStorage.setItem('ledfx-hosts', JSON.stringify(hosts.filter(h => h.title !== title)))
    setHosts(hosts.filter(h => h.title !== title))
  }

  useEffect(() => {
    storedURL && setHostvalue(storedURL);
    storedURLs && setHosts(storedURLs)
  }, [storedURL, setHosts]);

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {edit ? 'LedFx-Core Host' : 'No LedFx-Core found'}
      </DialogTitle>
      <DialogContent>
        {!edit && (
          <DialogContentText>
            You can change the host if you want:
          </DialogContentText>
        )}
        <Autocomplete
          value={hostvalue}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setHostvalue({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              setHostvalue({
                title: newValue.inputValue,
              });
            } else {
              setHostvalue(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                title: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          id="host"
          options={hosts}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.title;
          }}
          renderOption={(option) => <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>{option.title}<Delete onClick={(e) => handleDelete(e, option.title)} /></div>}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="IP:Port" variant="outlined" />}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          freeSolo

        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Set Host
        </Button>
      </DialogActions>
    </Dialog>
  );
}
