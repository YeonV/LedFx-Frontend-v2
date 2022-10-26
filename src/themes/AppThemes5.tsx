import { PaletteMode } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';
import isElectron from 'is-electron';

declare module '@mui/styles' {
  type DefaultTheme = Theme;
}
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent: PaletteOptions['primary'];
  }
}

export const common = {
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained' as 'contained' | 'outlined' | 'text' | undefined,
        size: 'small' as 'small' | 'medium' | 'large',
      },
    },
    MuiChip: {
      defaultProps: {
        variant: 'outlined' as 'outlined' | 'filled' | undefined,
        sx: {
          m: 0.3,
        },
      },
    },
  },
};

export const BladeDarkGreenTheme = {
  palette: {
    mode: 'dark' as PaletteMode | undefined,
    primary: {
      main: '#2BDE6A',
    },
    secondary: {
      main: '#1db94',
    },
    accent: {
      main: '#20173c',
    },
  },
};

export const BladeDarkBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0dbedc',
    },
    secondary: {
      main: '#0dbedc',
    },
    accent: {
      main: '#0018c',
    },
    background: {
      default: '#030303',
      paper: '#111',
    },
  },
});

export const BladeDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b00000',
    },
    secondary: {
      main: '#00000',
    },
    accent: {
      main: '#20173c',
    },
    background: {
      default: '#030303',
      paper: '#111',
    },
  },
});

export const BladeDarkGreyTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
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
      paper: '#111',
    },
  },
});

export const BladeDarkOrangeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFBF47',
    },
    secondary: {
      main: '#edad2d',
    },
    accent: {
      main: '#4281',
    },
    background: {
      default: '#030303',
      paper: '#111',
    },
  },
});

export const BladeDarkPinkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bf026b',
    },
    secondary: {
      main: '#bf026b',
    },
    accent: {
      main: '#400729',
    },
    background: {
      default: '#030303',
      paper: '#111',
    },
  },
});

export const BladeLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#800000',
    },
    secondary: {
      main: '#800000',
    },
    accent: {
      main: '#a00000',
    },
  },
});

export const ledfxThemes = {
  Dark: BladeDarkTheme,
  DarkRed: BladeDarkTheme,
  DarkOrange: BladeDarkOrangeTheme,
  Light: BladeLightTheme,
  DarkGreen: BladeDarkGreenTheme,
  DarkBlue: BladeDarkBlueTheme,
  DarkGrey: BladeDarkGreyTheme,
  DarkPink: BladeDarkPinkTheme,
} as any;

/* eslint-disable @typescript-eslint/indent */
export const ledfxTheme =
  (window.localStorage.getItem('ledfx-theme')
    ? window.localStorage.getItem('ledfx-theme')
    : window.localStorage.getItem('hassTokens')
    ? 'DarkBlue'
    : window.location.origin === 'https://my.ledfx.app'
    ? 'DarkGreen'
    : isElectron()
    ? 'DarkOrange'
    : 'DarkBlue') || 'DarkBlue';
/* eslint-enable @typescript-eslint/indent */
