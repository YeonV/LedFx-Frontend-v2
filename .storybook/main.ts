module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-mdx-gfm'
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  core: {
    disableTelemetry: true
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}
