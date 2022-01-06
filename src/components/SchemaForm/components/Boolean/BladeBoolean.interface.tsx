export interface BladeBooleanProps {
  index?: number;
  required?: boolean;
  style?: any;
  onClick?: any;
  type?: string;
  schema?: any;
  model?: Record<string, unknown>;
  hideDesc?: boolean;
  model_id: string;
}

export const BladeBooleanDefaultProps = {
  index: undefined,
  style: undefined,
  required: false,
  onClick: undefined,
  type: undefined,
  schema: undefined,
  model: undefined,
  hideDesc: undefined,
  model_id: undefined,
};
