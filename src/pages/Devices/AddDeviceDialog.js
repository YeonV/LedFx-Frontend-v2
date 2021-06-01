import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import useStore from '../../utils/apiStore';

const AddDeviceDialog = () => {
  
  
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const addDevice = useStore((state) => state.addDevice);
  const open = useStore((state) => state.dialogs.addDevice?.open || false);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);

  const handleClose = () => {
    setDialogOpenAddDevice(false);
  };
  const handleAddScene = (e) => {
    // addDevice({ name, scene_image: image }).then(() => {
    //   getScenes();
    // });
    setName('');
    setImage('');
    setDialogOpenAddDevice(false);
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Add Device</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Coming soon
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <Button onClick={()=>handleAddScene} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default AddDeviceDialog
