export interface Schema {
  properties?: any;
  required?: any;
  permitted_keys?: any;
}

export interface EffectSchemaFormProps {
  /**
   * Schema to generate Form from. <br />
   * in production this is provided by <br />
   * an external api or a store-management. <br />
   * See examples, for manual usage...
   */
  schema: Schema;
  /**
   * Model is the current value of the schema
   */
  model: Record<string, unknown>;
  /**
   * ID of the current active virtual
   */
  virtId: string;
  /**
   * onChange function for the given model
   */
  handleEffectConfig?: (_virt: string, _config: any) => true;
  /**
   * updateVirtualEffect function for the given model
   */
  getVirtuals?: () => true;
}

export const EffectSchemaFormDefaultProps = {
  onModelChange: undefined,
  selectedType: undefined,
};
