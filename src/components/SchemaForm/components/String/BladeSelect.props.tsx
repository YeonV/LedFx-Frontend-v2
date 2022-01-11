import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { JsxElement } from 'typescript';

export interface BladeSelectProps {
  variant: 'outlined' | 'contained';
  disabled?: boolean;
  schema?: any;
  model?: any;
  model_id?: string;
  onChange?: any;
  index?: number;
  required?: boolean;
  wrapperStyle?: CSSProperties;
  selectStyle?: CSSProperties;
  textStyle?: CSSProperties;
  menuItemStyle?: CSSProperties;
  hideDesc?: boolean;
  children?: JsxElement;
}

export const BladeSelectDefaultProps = {
  disabled: false,
  schema: {},
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
  children: undefined,
};
