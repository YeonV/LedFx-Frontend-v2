import { StoryFn, Meta } from '@storybook/react'
import { Artnet } from './Artnet'
import { ArtnetDeviceConfig } from '../../../api/ledfx.types'

export default {
  title: 'API/Types/DeviceConfig/Artnet',
  component: Artnet,
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  }
} as Meta<typeof Artnet>

const Template: StoryFn<typeof Artnet> = (args: ArtnetDeviceConfig) => (
  <Artnet {...args} />
)

export const Preview = Template.bind({})
Preview.args = {}
