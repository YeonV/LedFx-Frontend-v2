import { makeStyles } from '@material-ui/core/styles';

export const useDeviceCardStyles = makeStyles((theme) => ({
    virtualCardPortrait: {     
      padding: '1rem',
      margin: '0.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      minWidth: '230px',
      maxWidth: '400px',
      width: '100%',
      height: '100%',
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
    virtualIcon: {
      margingBottom: '4px',
      marginRight: '0.5rem',
      position: 'relative',
      fontSize: '50px',
    },
    virtualCardContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
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
      textAlign: 'right',
    },
    buttonBarMobileWrapper: {
      display: 'flex',
      margin: '0 -0.5rem -1rem -0.5rem',
      padding: '0.5rem 0.5rem 1.5rem 0.5rem',
      background: 'rgba(0,0,0,0.4)',
      '& > div, & > button': {
        flexGrow: 1,
        flexBasis: '30%'
      },
      '& > div > button': {
        width: '100%'
      }
    },
  }));