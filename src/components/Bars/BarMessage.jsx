import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Icon, IconButton, Button } from '@material-ui/core';
import useStore from '../../utils/apiStore';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Close } from '@material-ui/icons';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const MessageBar = () => {
  const { isOpen, messageType, message } = useStore((state) => state.ui.snackbar);
  const clearSnackbar = useStore((state) => state.clearSnackbar);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleClose() {
    clearSnackbar();
  }

  useEffect(() => {
    if (isOpen && message !== 'NO MESSAGE' && window.localStorage.getItem('ledfx-newbase') === '1') {
      enqueueSnackbar(message, {
        variant: messageType,
        action: key => <Button onClick={() => { closeSnackbar(key) }}><Close /></Button>
      });
    }
  }, [isOpen, message])

  return window.localStorage.getItem('ledfx-newbase') !== '1'
    ? <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isOpen}
      autoHideDuration={2000 + (message || 0).length * 60}
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
        </IconButton>
      ]}>
      <Alert severity={messageType}>{message}</Alert>
    </Snackbar>
    : <></>
};

export default MessageBar;
