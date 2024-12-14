export interface BBooleanProps {
  index?: number
  required?: boolean
  style?: any
  type?: 'switch' | 'checkbox' | 'button'
  onChange?: (e: any) => void
  defaultValue?: any
  value: boolean
  title?: string
  description?: string
  hideDesc?: boolean
}