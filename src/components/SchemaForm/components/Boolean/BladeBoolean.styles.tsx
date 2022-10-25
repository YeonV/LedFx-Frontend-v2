import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '320px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  wrapper: {
    padding: '10px 10px 2px 10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexBasis: '23.5%',
    minWidth: 'unset',
    margin: '0.5rem 0',

    '@media (max-width: 580px)': {
      flexBasis: '37vw',
    },
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
