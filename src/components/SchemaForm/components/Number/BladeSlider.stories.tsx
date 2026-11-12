import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react-webpack5'
// eslint-disable-next-line
import BladeSlider from "./BladeSlider";

export default {
  title: 'UI Components/SchemaForm/Schema Components',
  component: BladeSlider,
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
} as Meta<typeof BladeSlider>

// eslint-disable-next-line
const Template: StoryFn<typeof BladeSlider> = (args) => <BladeSlider {...args} />;

export const Number = Template.bind({})
Number.args = {
  variant: 'outlined',
  step: undefined,
  hideDesc: false,
  required: false,
  textfield: false,
  disabled: false,
  schema: {
    title: 'Slide me',
    minimum: 5,
    maximum: 50,
    step: 2,
    description: 'some description'
  },
  model: undefined,
  model_id: '',
  onChange: undefined,
  marks: undefined,
  index: undefined,
  style: {}
}

export const EnumWithoutMarks = Template.bind({})
EnumWithoutMarks.args = {
  schema: { title: 'Refresh Rate', enum: [10, 30, 60, 120], default: 60 },
  model: {},
  model_id: 'refresh_rate'
}
