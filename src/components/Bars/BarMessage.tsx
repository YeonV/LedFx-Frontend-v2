import { Icon, IconButton, Snackbar } from '@mui/material';
import useStore from '../../store/useStore';

// const Alert = (props: any) => (
//   <MuiAlert elevation={6} variant="filled" {...props} />
// );

const MessageBar = () => {
  const { isOpen, message } = useStore((state) => state.ui.snackbar);
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
      <div>hi</div>
      {/* <Alert severity={messageType}>{message}</Alert> */}
    </Snackbar>
  );
};

export default MessageBar;
