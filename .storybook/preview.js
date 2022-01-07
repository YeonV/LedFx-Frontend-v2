import React from 'react';
import { ThemeProvider } from '@mui/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BladeDarkTheme } from '../src/AppThemes';
import { BladeDarkTheme5 } from '../src/AppThemes5';
import storyTheme from './storyTheme';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={BladeDarkTheme5}>
      <MuiThemeProvider theme={BladeDarkTheme}>
        <Story />
      </MuiThemeProvider>
    </ThemeProvider>
  ),
];

export const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: [ 'BladeBook', ['Introduction', 'Getting Started', 'Guides'], 'UI Components',['Default', 'Examples', 'Components',['*', 'Color'] ], 'Api'],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color|stroke|currentColor)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: storyTheme,
    source: {
      type: 'dynamic',
      excludeDecorators: true,
    },
  },
};
