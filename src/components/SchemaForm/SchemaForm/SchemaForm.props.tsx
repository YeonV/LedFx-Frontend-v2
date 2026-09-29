import type { FieldErrors } from '../../../api/fieldErrors'

export interface Schema {
  properties?: any
  required?: any
  permitted_keys?: any
}

export interface SchemaFormProps {
  /**
   * Validation messages by field id, shown under each field
   */
  errors?: FieldErrors
  /**
   * Schema to generate Form from. <br />
   * in production this is provided by <br />
   * an external api or a store-management. <br />
   * See examples, for manual usage...
   */
  schema: Schema
  /**
   * Model is the current value of the schema
   */
  model: Record<string, any>
  /**
   * Hide Field-Description Toggle
   */
  hideToggle?: boolean
  /**
   * onChange function for the given model
   */
  onModelChange?: (e: any) => typeof e
  /**
   * internal
   */
  type?: string
}
