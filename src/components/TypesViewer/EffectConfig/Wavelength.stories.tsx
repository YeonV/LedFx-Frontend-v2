import { StoryFn, Meta } from '@storybook/react'
import { Wavelength } from './Wavelength'
import { WavelengthEffectConfig } from '../../../api/ledfx.types'

export default {
  title: 'API/Types/EffectConfig/Wavelength',
  component: Wavelength,
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  }
} as Meta<typeof Wavelength>

const Template: StoryFn<typeof Wavelength> = (args: WavelengthEffectConfig) => (
  <Wavelength {...args} />
)

export const Preview = Template.bind({})
Preview.args = {}
