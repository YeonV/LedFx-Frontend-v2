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
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Autocomplete, {
  createFilterOptions,
} from '@mui/material/Autocomplete';
import isElectron from 'is-electron';
import useStore from '../../store/useStore';
// import { deleteFrontendConfig } from '../../utils/helpers';
// import LinearProgressWithLabel from './Download';

const filter = createFilterOptions();

export default function NoHostDialog() {
  // TODO CHANGE HERE LATER
  const dialogOpen = useStore((state) => state.dialogs.nohost?.open || false);
  const edit = useStore((state) => state.dialogs.nohost?.edit || false);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const setDisconnected = useStore((state) => state.setDisconnected);
  const setHost = useStore((state) => state.setHost);
  const storedURL = window.localStorage.getItem('ledfx-host');
  const storedURLs = JSON.parse(
    window.localStorage.getItem('ledfx-hosts') ||
      JSON.stringify([{ title: 'http://localhost:8888' }])
  );
  const [hosts, setHosts] = useState([{ title: 'http://localhost:8888' }]);
  const [hostvalue, setHostvalue] = useState({
    title: 'http://localhost:8888',
  });
  // const [progress, setProgress] = useState(0);

  const handleClose = () => {
    // if (window.process?.argv.indexOf("integratedCore") === -1) {
    //   window.location.reload()
    // }
    setDialogOpen(false);
  };
 
  // (window as any).api?.receive('fromMain', (parameters: any) => {
  //   // eslint-disable-next-line no-console
  //   console.log(progress)
  //   if (parameters[0] === 'download-progress') {
  //     setProgress(parameters[1].percent * 100);      
  //   }
  // });
  const handleSave = () => {
    if (typeof hostvalue !== 'string') {
      setHost(hostvalue.title);
      if (!hosts.some((h) => h.title === hostvalue.title)) {
        window.localStorage.setItem(
          'ledfx-hosts',
          JSON.stringify([...hosts, hostvalue])
        );
      } else {
        window.localStorage.setItem('ledfx-hosts', JSON.stringify([...hosts]));
      }
    } else {
      setHost(hostvalue);
    }
    setDialogOpen(false);
    setDisconnected(false);
    window.location.reload();
  };

  const handleDelete = (e: any, title: string) => {
    e.stopPropagation();
    window.localStorage.setItem(
      'ledfx-hosts',
      JSON.stringify(hosts.filter((h) => h.title !== title))
    );
    setHosts(hosts.filter((h) => h.title !== title));
  };

  useEffect(() => {
    if (storedURL) setHostvalue({ title: storedURL });
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
          <Autocomplete
            value={hostvalue}
            onChange={(event, newValue: any) => {
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
            renderOption={(option) => (
              <div
                key={option.title}
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                {option.title}
                <Delete onClick={(e) => option.title && handleDelete(e, option.title)} />
              </div>
            )}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="IP:Port" variant="outlined" />
            )}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
          />

          {/* {isElectron() && <p>No Core? Want to try integrated Core?  <Button variant={"outlined"} onClick={()=> { window.api.send('toMain', "download-core")}} color="primary">Download Core</Button></p>}
          {progress > 0 && <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
          </Box>} */}
          {/* {isElectron() && window.localStorage.getItem("core-init") !== 'initialized' && <div onClick={()=> {deleteFrontendConfig();window.api.send('toMain', "restart-client")}}>Restart2</div>} */}
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
    </div>
  );
}
