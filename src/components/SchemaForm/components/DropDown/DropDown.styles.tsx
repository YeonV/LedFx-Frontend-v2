import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  FormRow: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    margin: '0 0 0.5rem',
    '@media (max-width: 580px)': {
      flexDirection: 'column',
    },
  },
  FormLabel: {
    marginLeft: '1rem',
    paddingTop: '0.5rem',
    '@media (max-width: 580px)': {
      display: 'none',
    },
  },
  FormSelect: {
    flexGrow: 1,
    marginLeft: '1rem',
    paddingTop: '0.5rem',
    '&:before, &:after': {
      display: 'none',
    },
    '& > .MuiSelect-select:focus': {
      backgroundColor: 'unset',
    },
  },
  FormListHeaders: {
    pointerEvents: 'none',
    background: theme.palette.secondary.main,
    color: '#fff',
  },
  FormListItem: {
    paddingLeft: '2rem',
  },
  FormToggleWrapper: {
    '@media (max-width: 580px)': {
      order: -1,
    },
  },

  FormToggle: {
    '@media (max-width: 580px)': {
      flexGrow: 1,
    },
  },
}));

export default useStyles;
