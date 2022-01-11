import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    borderRadius: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '308px',
    overflow: 'auto',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '& .gradient-result': {
      display: 'none',
    },
    '& .input_rgba': {
      display: 'none',
    },
    '& .gradient-interaction': {
      order: -1,
      marginBottom: '1rem',
    },
    '& .colorpicker': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .color-picker-panel, & .popup_tabs-header, & .popup_tabs, & .colorpicker, & .colorpicker .color-picker-panel, & .popup_tabs-header .popup_tabs-header-label-active':
      {
        backgroundColor: 'transparent',
      },
    '& .popup_tabs-header-label-active': {
      color: theme.palette.text.primary,
    },
    '& .popup_tabs-header-label': {
      color: theme.palette.text.disabled,
      '&.popup_tabs-header-label-active': {
        color: theme.palette.text.primary,
      },
    },
    '& .popup_tabs-body': {
      paddingBottom: 4,
    },
  },
  addButton: {
    width: 69,
    height: 30,
    borderRadius: 4,
    border: '1px solid #999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    margin: '0 auto',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#fff',
    },
  },
  picker: {
    height: '30px',
    margin: '15px 10px 10px 10px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1px solid #fff',
  },
  wrapper: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    position: 'relative',
    width: '100%',
    minWidth: '230px',
    margin: '0.5rem 0',
    '& > label': {
      top: '-0.5rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      fontSize: '0.9rem',
      letterSpacing: '0.1rem',
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
    },
  },
}));

export default useStyles;
