import { CSSProperties } from '@mui/styles'
import { JsxElement } from 'typescript'

export interface BladeSelectProps {
  variant?: 'outlined' | 'contained'
  disabled?: boolean
  schema?: any
  model?: any
  model_id?: string
  onChange?: any
  index?: number
  required?: boolean
  wrapperStyle?: CSSProperties
  selectStyle?: CSSProperties
  textStyle?: CSSProperties
  menuItemStyle?: CSSProperties
  hideDesc?: boolean
  children?: JsxElement
  type?: string
}
