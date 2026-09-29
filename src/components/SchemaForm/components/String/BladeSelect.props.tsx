import { CSSProperties } from '@mui/styles'
import type { ReactNode } from 'react'

export interface BladeSelectProps {
  variant?: 'outlined' | 'contained'
  disabled?: boolean
  schema?: any
  /** The field may be null: the select offers a null option. */
  nullable?: boolean
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
  children?: ReactNode
  type?: string
  error?: string
}
