// eslint-disable-next-line
import BladeIcon from '../components/Icons/BladeIcon';
// eslint-disable-next-line
import configApiYaml from './configApiYaml';

// eslint-disable-next-line
const IFrame = (args:any) => <iframe {...args} />

export default {
  title: 'API/OpenApi',
  component: IFrame,
  parameters: {
    options: {
      showPanel: false,
    },
  },
  argTypes: {
    showPanel: false,
    tooltip: {
      table: {
        disable: true,
      },
      control: false,
      actions: false,
      showPanel: false,
    },
  },
};

export function Primary() {
  return <IFrame width="100%" height="1000px" frameborder="0" src="https://stoplight-elements-dev-portal-storybook.netlify.app/iframe.html?id=public-stoplightproject--playground&args=router:hash;projectId:cHJqOjEwNTYzMw;hideTryIt:true&globals=theme:dark&viewMode=story#/YXBpOjMzOTIxMTA4-led-fx-api" />;
}
Primary.parameters = {
  controls: { hideNoControlsWarning: true, disable: true, showPanel: false },
};
