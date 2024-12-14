import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  stories: [
      '../src/**/*.mdx',
      '../src/components/SchemaForm/**/*.stories.tsx',
      '../src/components/Icons/BladeIcon/BladeIcon.stories.tsx',
      '../src/components/Doc/Api.stories.tsx',
      '../src/components/Popover/Popover.stories.tsx',
      // '../src/pages/Devices/DeviceCard/DeviceCard.stories.tsx',
    ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  staticDirs: ['..\\public']
}
export default config
