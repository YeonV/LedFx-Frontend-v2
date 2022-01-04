import React from 'react';
import { BladeDarkTheme } from '../src/AppThemes'
import { ThemeProvider } from '@mui/styles';
import storyTheme from './storyTheme';

export const decorators = [
  Story => (
    <ThemeProvider theme={BladeDarkTheme}>
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: storyTheme,
  },
}