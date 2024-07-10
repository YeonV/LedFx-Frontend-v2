export interface BladeBooleanProps {
  index?: number
  required?: boolean
  style?: any
  onClick?: any
  type?: 'switch' | 'checkbox' | 'button'
  schema?: any
  model?: Record<string, unknown>
  hideDesc?: boolean
  model_id: string
}
