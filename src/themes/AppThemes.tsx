import { createTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent: PaletteOptions['primary'];
  }
}

export const BladeDarkGreenTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2BDE6A',
    },
    secondary: {
      main: '#1db954',
    },
    accent: {
      main: '#20173c',
    },
    background: {
      default: '#030303',
      paper: '#151515',
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
    accent: {
      main: '#20173c',
    },
    background: {
      default: '#030303',
      paper: '#151515',
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
    accent: {
      main: '#20173c',
    },
    background: {
      default: '#030303',
      paper: '#151515',
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
  },
});

export const BladeDarkGreyTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#333',
    },
    secondary: {
      main: '#222',
    },
    accent: {
      main: '#444',
    },
    background: {
      default: '#030303',
      paper: '#151515',
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
  },
});

export const BladeDarkOrangeTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#FFBF47',
    },
    secondary: {
      main: '#edad2d',
    },
    accent: {
      main: '#542581',
    },
    background: {
      default: '#030303',
      paper: '#151515',
    },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
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
    accent: {
      main: '#a00000',
    },
    // background: { default: '#030303', paper: '#151515' },
  },
  props: {
    MuiCard: {
      variant: 'outlined',
    },
  },
});
