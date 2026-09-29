import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react-webpack5'
// eslint-disable-next-line
import BladeSelect from "./BladeSelect";

export default {
  title: 'UI Components/SchemaForm/Schema Components',
  component: BladeSelect,
  argTypes: {
    type: {
      control: false
    }
  },
  decorators: [
    (Story) => (
      <Card style={{ maxWidth: 800 }}>
        <CardContent>{Story()}</CardContent>
      </Card>
    )
  ],
  parameters: {
    options: {
      showPanel: true,
      panelPosition: 'bottom'
    }
  }
} as Meta<typeof BladeSelect>

// eslint-disable-next-line
const Template: StoryFn<typeof BladeSelect> = (args) => <BladeSelect {...args} />;

export const String = Template.bind({})
String.args = {
  disabled: false,
  schema: {
    default: 'UDP',
    enum: ['UDP', 'DDP', 'E131'],
    title: 'Sync Mode',
    type: 'string'
  },
  model: {},
  model_id: '',
  onChange: undefined,
  index: 0,
  required: false,
  wrapperStyle: undefined,
  selectStyle: undefined,
  textStyle: undefined,
  menuItemStyle: undefined,
  hideDesc: false,
  children: undefined
}

export const SelectZeroValue = Template.bind({})
SelectZeroValue.args = {
  schema: { title: 'Gpio Pin', type: 'integer', enum: [0, 10, 12], default: 10 },
  model: { gpio_pin: 0 },
  model_id: 'gpio_pin'
}

export const TextEmptyValue = Template.bind({})
TextEmptyValue.args = {
  schema: { title: 'Description', type: 'string', default: 'LedFx' },
  model: { description: '' },
  model_id: 'description'
}
