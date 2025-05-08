import { StoryFn, Meta } from '@storybook/react'
import { Base } from './Base'
import { BaseDeviceConfig } from '../../../api/ledfx.types'

export default {
  title: 'API/Types/DeviceConfig/Base',
  component: Base,
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  }
} as Meta<typeof Base>

const Template: StoryFn<typeof Base> = (args: BaseDeviceConfig) => (
  <Base {...args} />
)

export const Preview = Template.bind({})
Preview.args = {}
