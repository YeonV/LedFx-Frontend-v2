import { useState } from 'react';
import {
  Link,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import useStore from '../../store/useStore';

const AddSceneDialog = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [overwrite, setOverwrite] = useState(false);

  const addScene = useStore((state) => state.addScene);
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  const open = useStore((state) => state.dialogs.addScene?.open || false);
  const setDialogOpenAddScene = useStore(
    (state) => state.setDialogOpenAddScene
  );

  const handleClose = () => {
    setDialogOpenAddScene(false);
  };
  const handleAddScene = () => {
    addScene(name, image).then(() => {
      getScenes();
    });
    setName('');
    setImage('');
    setDialogOpenAddScene(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add Scene</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddScene}>
          {overwrite ? 'Overwrite' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSceneDialog;
