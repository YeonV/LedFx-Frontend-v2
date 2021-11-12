import { makeStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../utils/helpers';
import blademod from '../../assets/blademod.svg';
import isElectron from 'is-electron';

const useStyles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      backgroundColor: '#ffffff30',
      width: '8px',
      borderRadius: '8px',
    },
    '*::-webkit-scrollbar-track': {
      backgroundColor: '#00000060',
      borderRadius: '8px',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#555555',
      borderRadius: '8px',
    },
    '*::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    // backgroundColor: theme.palette.background.default,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX: 'hidden',
    paddingTop: isElectron() ? '30px' : 0,
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  logo: {
    position: 'relative',
    padding: '0 15px',
    zIndex: '4',
  },
  logoLink: {
    display: 'block',
    fontSize: '18px',
    textAlign: 'left',
    fontWeight: '400',
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    '&,&:hover': {
      color: '#FFFFFF',
    },
  },
  logoImage: {
    width: '30px',
    display: 'inline-block',
    maxHeight: '30px',
    marginLeft: '10px',
    marginRight: '15px',

    '& img': {
      width: '35px',
      top: -2,
      position: 'absolute',
      verticalAlign: 'middle',
      border: '0',
    },
  },
  devbadge: {
    backgroundImage: `url(${blademod})`,
    backgroundColor: isElectron() ? 'transparent' : theme.palette.secondary.main,
    border: theme.palette.primary.main,
    color: '#fff',
    borderRadius: isElectron() ?  0 : '15px',
    width: '150px',
    padding: '5px 25px',
    backgroundSize: isElectron() ? '270px' : '230px',
    height: '20px',
    backgroundRepeat: 'no-repeat',
    textAlign: 'right',
    backgroundPosition: isElectron() ? '-66px 50%' : '-40px 50%',
  },
  activeView: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[12],
    '&:hover,&:focus,&:visited,&': {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: theme.shadows[12],
    },
    color: '#fff',
},
}));
export default useStyles;
