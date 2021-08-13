import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: '1rem',
    backgroundColor: '#88888888',
    paddingLeft: '0.5rem',
    borderRadius: '5px'
  },
  wrapper: {
    minWidth: '240px',
    width: '48%',
    padding: '16px 1.2rem 6px 1.2rem',
    border: '1px solid rgba(255, 255, 255, 0.23)',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    order: 3,
    margin: '0.5rem 0',
    "@media (max-width: 580px)": {
      width: '100% !important',
    },
    '& > label': {
      top: '-0.5rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',      
    },
    '& .sortable-handler': {
      touchAction: 'none',
    }
  },
}));

export default useStyles;
