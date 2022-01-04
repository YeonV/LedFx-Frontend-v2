import { ComponentStory, ComponentMeta } from '@storybook/react';
// eslint-disable-next-line
import BladeSchemaForm from "../components/SchemaForm/BladeSchemaForm";

export default {
  /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
  title: 'Design Systems/SchemaForm',
  component: BladeSchemaForm,
  parameters: {
    options: {
      showPanel: false,
    },
  },
} as ComponentMeta<typeof BladeSchemaForm>;

// eslint-disable-next-line
const Template: ComponentStory<typeof BladeSchemaForm> = (args) => <BladeSchemaForm {...args} />;

export const AddDevice = Template.bind({});

AddDevice.args = {
  schema: {
    properties: {},
    required: {},
    permitted_keys: []
  },
  model: {},
  onModelChange: (e)=>console.log(e),
  hideToggle: false
};

export const AddIntegration = Template.bind({});

AddIntegration.args = {
  schema: {
    properties: {},
    required: {},
    permitted_keys: []
  },
  model: {},
  onModelChange: (e)=>console.log(e),
  hideToggle: false
};

export const AddVirtual = Template.bind({});

AddVirtual.args = {
  schema: {
    properties: {},
    required: {},
    permitted_keys: []
  },
  model: {},
  onModelChange: (e)=>console.log(e),
  hideToggle: false
};

export const AudioCard = Template.bind({});

AudioCard.args = {
  schema: {
    properties: {},
    required: {},
    permitted_keys: []
  },
  model: {},
  onModelChange: (e)=>console.log(e),
  hideToggle: false
};
