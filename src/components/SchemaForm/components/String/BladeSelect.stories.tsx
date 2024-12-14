import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react'
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
