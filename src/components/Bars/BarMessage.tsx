/* eslint-disable react/no-unstable-nested-components */
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Icon, IconButton } from '@material-ui/core';
import useStore from '../../store/useStore';

const Alert = (props: any) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const MessageBar = () => {
  const { isOpen, messageType, message } = useStore(
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
      <Alert severity={messageType}>{message}</Alert>
    </Snackbar>
  );
};

export default MessageBar;
