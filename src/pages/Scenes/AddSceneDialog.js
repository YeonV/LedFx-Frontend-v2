import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import useStore from '../../utils/apiStore';

const AddSceneDialog = () => {
  
  
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const addScene = useStore((state) => state.addScene);
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  const open = useStore((state) => state.dialogs.addScene?.open || false);
  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene);
  const [overwrite, setOverwrite] = useState(false)

  const handleClose = () => {
    setDialogOpenAddScene(false);
  };
  const handleAddScene = (e) => {

    addScene({ name, scene_image: image }).then(() => {
      getScenes();
    });
    setName('');
    setImage('');
    setDialogOpenAddScene(false);
  };


  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Add Scene</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Image is optional and can be one of:
        <li>icon-name <a href="https://material-ui.com/components/material-icons/">Find icons here</a></li>
        <li><em>eg. flare</em></li>
        <li>mdi:icon-name <a href="https://materialdesignicons.com">Find Material Design icons here</a></li>
        <li><em>eg. mdi:balloon</em></li>
        <li>image:custom-url</li>
        <li><em>eg. image:https://i.ytimg.com/vi/4G2unzNoOnY/maxresdefault.jpg</em></li>
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={(e) => {          
          setOverwrite(Object.keys(scenes).indexOf(e.target.value.toLowerCase()) > -1)
        }}
        error={overwrite}
        helperText={overwrite && "Scene already existing!"}
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
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleAddScene} color="primary">
      {overwrite ? 'Overwrite' : 'Add'}
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default AddSceneDialog
