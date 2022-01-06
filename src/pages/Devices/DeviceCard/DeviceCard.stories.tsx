import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

// eslint-disable-next-line
import DeviceCard from './DeviceCard';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'UI Components/DeviceCard',
  component: DeviceCard,
  decorators: [(Story) => <MemoryRouter>{Story()}</MemoryRouter>],
  parameters: {
    options: {
      showPanel: true,
    },
  },
} as ComponentMeta<typeof DeviceCard>;

// eslint-disable-next-line
const Template: ComponentStory<typeof DeviceCard> = (args) => (
  <DeviceCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  yzName: 'My Wled',
  yzIconName: 'wled',
  yzEffectName: 'Super Effect',
  yzIsEffectSet: true,
  isPlaying: true,
  yzPreviewOnly: true,
  yzColorIndicator: true,
  yzIsStreaming: false,
  yzGraphs: true,
  handleDeleteDevice: undefined,
  handleEditVirtual: undefined,
  handleEditDevice: undefined,
  handleClearEffect: undefined,
  handlePlayPause: undefined,
  yzStyle: {},
  yzTransitionTime: 5,
  virtId: 'yz-quad',
  yzIsDevice: 'yz-quad',
  yzLinkTo: '/',
  index: 1,
};
