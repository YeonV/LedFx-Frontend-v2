import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useStore from "../utils/Api";

export default function DialogNoHost() {
  const dialogOpen = useStore((state) => state.dialogs.nohost.open);
  const edit = useStore((state) => state.dialogs.nohost.edit);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const setHost = useStore((state) => state.setHost);
  const [value, setValue] = useState("http://localhost:8888");

  const handleClose = () => {
    setDialogOpen(false);
  };
  const handleSave = () => {
    setHost(value);
    setDialogOpen(false);
    window.location = window.location.href;
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {edit ? "LedFx-Core Host" : "No LedFx-Core found"}
      </DialogTitle>
      <DialogContent>
        {!edit && (
          <DialogContentText>
            You can change the host if you want:
          </DialogContentText>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="IP:Port"
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
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
