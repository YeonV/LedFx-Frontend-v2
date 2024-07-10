import React from 'react'

import axios from 'axios'
import { Slide, MenuItem } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

export const backendUrl = 'https://strapi.yeonv.com'

export const cloud = axios.create({
  baseURL: backendUrl
})

cloud.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`
  return config
})

export const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...(props as any)} />
  }
)

type Props = {
  _?: never
  children?: any
  className?: string | undefined
  onClick?: any
}

export const MuiMenuItem = React.forwardRef<HTMLLIElement, Props>(
  (props, ref) => {
    return <MenuItem ref={ref} {...props} />
  }
)
