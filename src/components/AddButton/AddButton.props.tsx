import { ReactElement } from 'react'
import type { MenuProps } from '@mui/material'

export interface MenuLineProps {
  icon?: ReactElement<any>
  name?: string
  action: () => void
  description?: string
}

export interface StyledMenuProps extends MenuProps {
  open: boolean
}

export interface AddButtonProps {
  className: string
  style?: Record<string, unknown>
  setBackdrop: (_value: boolean) => void
  sx: Record<string, unknown>
}
