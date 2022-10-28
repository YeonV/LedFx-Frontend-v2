import { useEffect, useState } from 'react';
import {
  Link,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@material-ui/core';
import useStore from '../../store/useStore';

const EditSceneDialog = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [payload, setPayload] = useState('');
  const [overwrite, setOverwrite] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const addScene = useStore((state) => state.addScene);
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  const open = useStore((state) => state.dialogs.addScene?.edit || false);
  // const key = useStore((state: any) => state.dialogs.addScene?.sceneKey || '');
  const data = useStore((state: any) => state.dialogs.addScene?.editData || '');
  const viewMode = useStore((state) => state.viewMode);
  const setDialogOpenAddScene = useStore(
    (state) => state.setDialogOpenAddScene
  );

  function isValidURL(string: string) {
    const res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g
    );
    return res !== null;
  }

  useEffect(() => {
    if (data) {
      setName(data?.name);
      setImage(data?.scene_image);
      setUrl(data?.scene_puturl);
      setPayload(data?.scene_payload);
    }
  }, [data]);
  const handleClose = () => {
    setDialogOpenAddScene(false, false);
  };

  const handleAddScene = () => {
    addScene(name, image, url, payload).then(() => {
      getScenes();
    });
    setName('');
    setImage('');
    setUrl('');
    setPayload('');
    setDialogOpenAddScene(false, false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Scene</DialogTitle>
      <DialogContent>
        Image is optional and can be one of:
        <ul style={{ paddingLeft: '1rem' }}>
          <li>
            iconName{' '}
            <Link
              href="https://material-ui.com/components/material-icons/"
              target="_blank"
            >
              Find MUI icons here
            </Link>
            <Typography color="textSecondary" variant="subtitle1">
              <em>eg. flare, AccessAlarms</em>
            </Typography>
          </li>
          <li>
            mdi:icon-name{' '}
            <Link href="https://materialdesignicons.com" target="_blank">
              Find Material Design icons here
            </Link>
            <Typography color="textSecondary" variant="subtitle1">
              <em>eg. mdi:balloon, mdi:led-strip-variant</em>
            </Typography>
          </li>
          <li>
            image:custom-url
            <Typography
              color="textSecondary"
              variant="subtitle1"
              style={{ wordBreak: 'break-all' }}
            >
              <em>
                eg. image:https://i.ytimg.com/vi/4G2unzNoOnY/maxresdefault.jpg
              </em>
            </Typography>
          </li>
        </ul>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => {
            setOverwrite(
              Object.keys(scenes).indexOf(e.target.value.toLowerCase()) > -1
            );
          }}
          error={overwrite}
          helperText={overwrite && 'Scene already existing!'}
          required
          fullWidth
        />
        <TextField
          margin="dense"
          id="scene_image"
          label="Image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
        />
        {viewMode !== 'user' && (
          <>
            <TextField
              margin="dense"
              id="url"
              label="Url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              error={invalid}
              helperText={invalid && 'Enter valid URL!'}
              onBlur={(e) => {
                setInvalid(!isValidURL(e.target.value));
              }}
            />
            <TextField
              margin="dense"
              id="payload"
              label="Payload"
              type="text"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddScene}>
          {overwrite ? 'Overwrite' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSceneDialog;
