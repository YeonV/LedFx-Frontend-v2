import { makeStyles } from '@material-ui/core/styles';
import { LinearScale } from '@material-ui/icons';

export const useDeviceCardStyles = makeStyles((theme) => ({
    virtualCardPortrait: {     
      padding: '1rem 0.7rem 0.7rem 0.7rem',
      margin: '0.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      minWidth: '230px',
      maxWidth: '400px',
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: 10,
      background: theme.palette.background.paper,
      borderColor: 'transparent',
      // '&.active': {
      //   background: theme.palette.background.paper,
      // },
      '&:hover': {
      borderColor: theme.palette.text.disabled,
    }
    },
    virtualLink: {
      flexGrow: 0,
      textDecoration: 'none',
      fontSize: 'large',
      color: 'inherit',
      alignSelf: 'flex-start',
      '&:hover': {
        color: `${theme.palette.primary.main} !important`,
      },
    },
    virtualIconWrapper: {
      width: '50px',
      height: '55px',
      marginRight: '0.5rem',
    },
    virtualIcon: {
      marginBottom: '4px',
      marginRight: '0.5rem',
      position: 'relative',
      fontSize: '50px',
      position: 'absolute',
      transformOrigin: 'top left',
      '&.graphs': {
        transformOrigin: 'center left',
      },
      transition: 'transform 0.3s ease-in-out',
      transitionDelay: '0s',      
      '&.extended': {
        transform: 'scale(1.7) translateY(-4px);',
        transformOrigin: 'top left',        
        transition: 'transform 0.3s ease-in-out',
        transitionDelay: '0s',
      },
      '&.extended.graphs': {
        transform: 'scale(1.25)',
        transformOrigin: 'center left',        
        transition: 'transform 0.3s ease-in-out',
        transitionDelay: '0s',
      },
      '& svg': {          
        transform: 'unset',
        width: '100%',
        marginTop: '3px',
        height: '100%',
    }
    },
    
    virtualCardContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: '0 0.3rem',
      justifyContent: 'space-between',
        flexDirection: 'row',
    },
    iconMedia: {
      height: 140,
      display: 'flex',
      alignItems: 'center',
      margin: '0 auto',
      fontSize: 100,
      '& > span:before': {
        position: 'relative',
      },
    },
    editButton: {
      marginLeft: theme.spacing(1),
        minWidth: 'unset',
    },
    editButtonMobile: {
      marginLeft: theme.spacing(1),
        minWidth: 'unset',
        flexGrow: 1,
    },
    expand: {
      transform: 'rotate(0deg)',
      alignSelf: 'flex-start',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
        display: 'block'
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    buttonBarMobile: {
      width: '100%',
      height: '100%',
      textAlign: 'right',
    },
    buttonBarMobileWrapper: {
      height: 110,
      display: 'flex',
      margin: 0,
      padding: '0.5rem 80px 0.5rem 0.5rem',
      background: 'rgba(0,0,0,0.93)',      
      '& > div, & > button': {
        flexGrow: 1,
        flexBasis: '30%',
      },
      '&.extended.graphs': {
        height: 'auto',
        paddingTop: 0,
      }
    },
    pixelbar: {
      opacity: 1,
      transitionDuration: 0,
      width: '100%',
    },
    pixelbarOut: {
      opacity: 0.2,
      transition: 'opacity',
      transitionDuration: 1000
    }
  }));