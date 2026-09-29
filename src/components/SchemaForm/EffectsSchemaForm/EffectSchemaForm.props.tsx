import type { FieldErrors } from '../../../api/fieldErrors'

export interface Schema {
  properties?: any
  required?: any
  permitted_keys?: any
}

export interface EffectSchemaFormProps {
  /**
   * Validation messages by field id, shown under each field
   */
  errors?: FieldErrors
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
  selectedType?: any
  /**
   * How to display the descriptions
   */
  descriptions?: 'Auto' | 'Show' | 'Hide'
  getVirtuals?: () => true
}
