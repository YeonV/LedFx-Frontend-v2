import { StoryFn, Meta } from '@storybook/react'
import { DDP } from './DDP'
import { DdpDeviceConfig } from '../../../api/ledfx.types'

export default {
  title: 'API/Types/DeviceConfig/DDP',
  component: DDP,
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  }
} as Meta<typeof DDP>

const Template: StoryFn<typeof DDP> = (args: DdpDeviceConfig) => (
  <DDP {...args} />
)

export const Preview = Template.bind({})
Preview.args = {}
