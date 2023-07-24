export interface Schema {
  properties?: any
  required?: any
  permitted_keys?: any
}

export interface EffectSchemaFormProps {
  schemaProperties: any[]
  /**
   * Model is the current value of the schema
   */
  model: Record<string, unknown>
  /**
   * ID of the current active virtual
   */
  virtId: string
  /**
   * onChange function for the given model
   */
  handleEffectConfig?: any
  /**
   * updateEffect function for the given model
   */
  getVirtuals?: () => true
}

export const EffectSchemaFormDefaultProps = {
  onModelChange: undefined,
  selectedType: undefined
}
