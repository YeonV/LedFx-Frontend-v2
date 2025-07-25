import { Card, CardContent } from '@mui/material'
import { StoryFn, Meta } from '@storybook/react-webpack5'
// eslint-disable-next-line
import DropDown from "./DropDown";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'UI Components/SchemaForm/Schema Components',
  component: DropDown,
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
} as Meta<typeof DropDown>

// eslint-disable-next-line
const Template: StoryFn<typeof DropDown> = (args) => <DropDown {...args} />;

export const GroupedDropdown = Template.bind({})
GroupedDropdown.args = {
  title: 'Grouped Dropdown',
  showFilter: false,
  groups: {
    'Group 1': [
      {
        name: 'Item 1',
        id: 'item11',
        category: 'Group 1'
      },
      {
        name: 'Item2',
        id: 'item12',
        category: 'Group 1'
      }
    ],
    'Group 2': [
      {
        name: 'Item 1',
        id: 'item21',
        category: 'Group 2'
      }
    ]
  },
  value: 'item11',
  onChange: undefined
}
