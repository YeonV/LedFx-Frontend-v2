import React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { MenuItem, Slide } from '@mui/material'

export interface SpotifyScreenProps {
  icon: React.ReactElement<any>
  startIcon?: React.ReactElement<any>
  label?: string
  type?: string
  className: string
  // eslint-disable-next-line
  color: 'primary' | 'inherit' | 'error' | 'success' | 'warning' | 'info' | 'secondary' | undefined;
  variant: 'outlined' | 'text' | 'contained' | undefined
  innerKey?: string
  disabled: boolean
  size?: 'small' | 'medium' | 'large' | undefined
}

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...(props as any)} />
})

export const MuiMenuItem = React.forwardRef(
  (props: any, ref: React.Ref<unknown>) => {
    return <MenuItem ref={ref} {...props} />
  }
)
