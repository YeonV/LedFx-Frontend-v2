import { StoryFn, Meta } from '@storybook/react-webpack5'
// eslint-disable-next-line
import Popover from './Popover';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'UI Components/Popover',
  component: Popover,
  argTypes: {
    type: {
      options: ['menuItem', 'button'],
      control: { type: 'select' }
    }
  },
  parameters: {
    options: {
      showPanel: true
    }
  }
} as Meta<typeof Popover>

// eslint-disable-next-line
const Template: StoryFn<typeof Popover> = (args) => <Popover {...args} />;

export const Default = Template.bind({})
Default.args = {}

export const Example = Template.bind({})
Example.args = {
  type: 'button'
}
