import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react-webpack5'
// eslint-disable-next-line
import BladeSchemaForm from "./SchemaForm";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'UI Components/SchemaForm',
  component: BladeSchemaForm,
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
} as Meta<typeof BladeSchemaForm>

// eslint-disable-next-line
const Template: StoryFn<typeof BladeSchemaForm> = (args) => <BladeSchemaForm {...args} />;

export const Default = Template.bind({})
Default.args = {
  schema: {
    properties: {},
    permitted_keys: [],
    required: []
  },
  model: {},

  onModelChange: (e) => console.log(e),
  hideToggle: false
}
