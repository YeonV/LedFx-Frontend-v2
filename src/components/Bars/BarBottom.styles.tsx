import { makeStyles } from '@mui/styles';
import { drawerWidth } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 4,
    boxShadow: '0px -10px 30px 25px #030303',
    background: theme.palette.background.default,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  rootShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  addButton: {
    position: 'fixed',
    marginLeft: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2) + 25,
    },
    '& > button.MuiFab-primary': {
      backgroundColor: theme.palette.secondary.main,
    },
    '& .MuiSpeedDialAction-staticTooltipLabel': {
      backgroundColor: 'transparent',
      marginLeft: '-1rem',
    },
  },
  addButtonShift: {
    marginLeft: drawerWidth / 2,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));
export default useStyles;
