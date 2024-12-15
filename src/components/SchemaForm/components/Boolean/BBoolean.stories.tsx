import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react'
import BBoolean from './BBolean'

export default {
  title: 'UI Components/SchemaForm/Base Components',
  component: BBoolean,
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
} as Meta<typeof BBoolean>

const Template: StoryFn<typeof BBoolean> = (args) => <BBoolean {...args} />

export const Boolean = Template.bind({})
Boolean.args = {
  type: 'switch',
  title: 'Title',
  description: 'description',
  required: false,
  hideDesc: undefined,
  index: 1,
  style: undefined,
  onChange: undefined,
  value: undefined
}
