import { Icon, IconButton, Snackbar, Alert, AlertColor } from '@mui/material';
import useStore from '../../store/useStore';

const MessageBar = () => {
  const { message, messageType, isOpen } = useStore(
    (state) => state.ui.snackbar
  );
  const clearSnackbar = useStore((state) => state.ui.clearSnackbar);

  function handleClose() {
    clearSnackbar();
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isOpen}
      autoHideDuration={2000 + (message.length || 0) * 60}
      onClose={() => handleClose()}
      aria-describedby="client-snackbar"
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={() => handleClose()}
        >
          <Icon>close</Icon>
        </IconButton>,
      ]}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={messageType as AlertColor}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageBar;
