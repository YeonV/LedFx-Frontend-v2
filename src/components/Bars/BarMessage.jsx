import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from '@material-ui/core';
import useStore from '../../utils/apiStore';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const MessageBar = () => {
  const { isOpen, messageType, message } = useStore((state) => state.ui.snackbar);
  const clearSnackbar = useStore((state) => state.clearSnackbar);

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
      autoHideDuration={1000 + (message || 0).length * 60}
      onClose={handleClose}
      aria-describedby="client-snackbar"
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <Icon>close</Icon>
        </IconButton>,
      ]}
    >
      <Alert severity={messageType}>{message}</Alert>
    </Snackbar>
  );
};

export default MessageBar;
