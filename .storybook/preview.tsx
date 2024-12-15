import type { Preview } from '@storybook/react'
import {
  BladeDarkBlueTheme as darkTheme,
  BladeLightBlueTheme as lightTheme
} from '../src/themes/AppThemes'
import './globals.css'
import '../src/index.css'

import { ThemeProvider, CssBaseline } from '@mui/material'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'

const preview: Preview = {
  decorators: [
    withThemeFromJSXProvider({
      GlobalStyles: CssBaseline,
      Provider: ThemeProvider,
      themes: {
        // Provide your custom themes here
        light: lightTheme,
        dark: darkTheme
      },
      defaultTheme: 'light'
    })
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'BladeBook',
          ['Introduction', 'Getting Started', 'App Structure', 'Guides'],
          'UI Components',
          [
            'Examples',
            'Schema Components',
            'Base Components',
            'Default',
            ['*', 'Color']
          ],
          'Api'
        ]
      }
    },
    // actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color|stroke|currentColor)$/i,
        date: /Date$/
      }
    }
  },
  tags: ['autodocs']
}

export default preview
