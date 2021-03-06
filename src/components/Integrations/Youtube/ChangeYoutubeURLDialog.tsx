import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Language } from '@material-ui/icons';

export default function ChangeYoutubeURLDialog({
  style,
  youtubeURL,
  setYoutubeURL,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState(youtubeURL);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (_e: any) => {
    setOpen(false);
  };
  const handleSave = (_e: any) => {
    setYoutubeURL(url);
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} style={style}>
        <Language />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Youtube URL</DialogTitle>
        <DialogContent>
          <DialogContentText>Playlist/Track URL of youtube</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="URL"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
