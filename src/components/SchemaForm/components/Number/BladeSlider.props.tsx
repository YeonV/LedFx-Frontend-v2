export interface BladeSliderInnerProps {
  schema?: any
  model?: any
  model_id?: string
  step?: number
  onChange?: any
  textfield?: boolean
  style?: any
  disabled?: boolean
  marks?: any
  hideDesc?: boolean
  disableUnderline?: boolean
  full?: boolean
  /** aria props tying the inputs to the error caption (see errorAria) */
  aria?: Record<string, unknown>
}

export interface BladeSliderProps {
  /**
   * `outlined` or not. More might come
   */
  variant?: string
  /**
   * Renders slider if:
   *
   *  - schema.maximum && !textfield
   *  - the schema is an enum (`enum`) && !textfield
   *
   * Else: renders input field
   */
  schema?: any
  /**
   * current value representation of schema
   */
  model?: any
  model_id?: string
  /**
   * if steps not provided it will be calculated like:
   * `schema.maximum > 1 ? 0.1 : 0.01`
   */
  step?: number
  onChange?: any
  marks?: any
  index?: number
  required?: boolean
  /**
   * Forces input field rendering.
   * no slider
   */
  textfield?: boolean
  disabled?: boolean
  hideDesc?: boolean
  style?: any
  full?: boolean
  /** validation message shown under the field */
  error?: string
}
