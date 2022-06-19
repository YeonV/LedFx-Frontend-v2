import { CSSProperties } from '@material-ui/core/styles/withStyles';

export interface GradientPickerProps {
  pickerBgColor: string;
  title?: string;
  index?: number;
  isGradient?: boolean;
  wrapperStyle?: CSSProperties;
  colors?: {
    colors: {
      builtin: { [key: string]: string };
      user: { [key: string]: string };
    };
    gradients: {
      user: { [key: string]: string };
      builtin: { [key: string]: string };
    };
  };
  handleAddGradient?: any;
  sendColorToVirtuals?: any;
}

export const GradientPickerDefaultProps = {
  pickerBgColor: '#800000',
  title: 'Color',
  index: 1,
  isGradient: false,
  wrapperStyle: undefined,
  colors: undefined,
  handleAddGradient: undefined,
  sendColorToVirtuals: undefined,
};
