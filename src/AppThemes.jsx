import { createTheme } from '@material-ui/core/styles';


export const BladeDarkGreenTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#1db954',
    },
    secondary: {
      main: '#1db954',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});

export const BladeDarkBlueTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#0dbedc',
    },
    secondary: {
      main: '#0dbedc',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});

export const BladeDarkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#b00000',
    },
    secondary: {
      main: '#500000',
    },
    background: { 
      default: '#030303', 
      paper: '#151515' 
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});

export const BladeLightTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#800000',
    },
    secondary: {
      main: '#800000',
    },
    // background: { default: '#030303', paper: '#151515' },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});