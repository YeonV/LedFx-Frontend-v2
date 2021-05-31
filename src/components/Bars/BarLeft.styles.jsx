import { makeStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../utils/helpers';
import blademod from '../../assets/blademod.svg';

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
    backgroundColor: theme.palette.background.default,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX: 'hidden',
  },
  '@media (max-width: 580px)': {
    drawer: {
      width: '100vw',
    },
    drawerPaper: {
      width: '100vw',
    },
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
    padding: '15px 15px',
    zIndex: '4',
  },
  logoLink: {
    padding: '5px 0',
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
      top: '17px',
      position: 'absolute',
      verticalAlign: 'middle',
      border: '0',
    },
  },
  devbadge: {
    backgroundImage: `url(${blademod})`,
    backgroundColor: '#0dbedc',
    border: '1px solid #0dbedc',
    color: '#fff',
    borderRadius: '15px',
    width: '150px',
    padding: '5px 25px',
    backgroundSize: '230px',
    height: '25px',
    marginBottom: '0.5rem',
    backgroundRepeat: 'no-repeat',
    textAlign: 'right',
    backgroundPosition: '-40px 50%',
  },
}));
export default useStyles;
