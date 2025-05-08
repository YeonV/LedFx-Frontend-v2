import { StoryFn, Meta } from '@storybook/react'
import { Device } from './Device'
import { DeviceInfo } from '../../api/ledfx.types'

export default {
  title: 'API/Types/Device',
  component: Device,
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  }
} as Meta<typeof Device>

const Template: StoryFn<typeof Device> = (args: DeviceInfo) => (
  <Device {...args} />
)

export const Preview = Template.bind({})
Preview.args = {}
