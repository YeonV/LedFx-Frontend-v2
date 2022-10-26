import React from 'react';
import { ThemeProvider } from '@mui/styles';
import { BladeDarkTheme5 } from '../src/themes/AppThemes5';
import storyTheme from './storyTheme';
import './globals.css'

export const decorators = [
  (Story: any) => (
    <ThemeProvider theme={BladeDarkTheme5}>
        <Story />
    </ThemeProvider>
  )
];

export const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: [ 'BladeBook', ['Introduction', 'Getting Started', 'App Structure', 'Guides'], 'UI Components',['Default', 'Examples', 'Components',['*', 'Color'] ], 'Api'],
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
