import { makeStyles, styled } from '@material-ui/core/styles';
import { Button, Slider, Switch } from '@material-ui/core';

export const useStyles = makeStyles(() => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '&>div': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  },
  settingsRow: {
    order: 'unset',
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    height: 40,
    '&>label': {
      marginRight: '1rem',
    },
    '&.slider>label': {
      width: 150,
    },
  },
  actionButton: {
    marginTop: '0.5rem',
    flexBasis: '49%',
    width: '100%',
    borderColor: '#444',
  },
  card: {
    maxWidth: '540px',
    margin: '0 auto', // mobile
  },
  '@media (max-width: 580px)': {
    card: {
      maxWidth: '97vw',
      margin: '0 auto',
    },
  },
  audioCard: {
    '& > div > div:not(:last-child)': {
      '@media (max-width: 580px)': {
        width: '48% !important',
        minWidth: 'unset',
      },
    },
  },
}));

export const SettingsSlider = styled(Slider)(({ theme }: { theme: any }) => ({
  color: theme.palette.mode === 'dark' ? '#eeeeee' : '#eeeeee',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    marginTop: '-10px',
    boxShadow:
      '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow:
          '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

export const SettingsSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }: any) => ({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const SettingsButton = (props: any) => {
  const classes = useStyles();
  return (
    <Button
      size="small"
      variant="outlined"
      className={classes.actionButton}
      {...props}
    />
  );
};
