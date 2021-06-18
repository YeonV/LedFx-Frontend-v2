import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: '1rem',
    backgroundColor: '#88888888',
    paddingLeft: '0.5rem',
    borderRadius: '5px'
  },
  wrapper: {
    minWidth: '250px',
    padding: '16px 1.2rem 6px 1.2rem',
    border: '1px solid #999',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    order: 1,
    margin: '0.5rem 0',
    "@media (max-width: 580px)": {
      width: '100% !important',
    },
    '& > label': {
      top: '-0.7rem',
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
