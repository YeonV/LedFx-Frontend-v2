import { ComponentStory, ComponentMeta } from '@storybook/react';
// eslint-disable-next-line
import BladeIcon from '../components/Icons/BladeIcon';

export default {
  /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
  title: 'Design Systems/BladeIcon',
  component: BladeIcon,
} as ComponentMeta<typeof BladeIcon>;

// eslint-disable-next-line
const Template: ComponentStory<typeof BladeIcon> = (args) => <BladeIcon {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  name: 'MusicNote',
};
