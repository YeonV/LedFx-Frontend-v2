/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { jwtDecode } from 'jwt-decode'
import isElectron from 'is-electron'

import axios from 'axios'
import { Slide, MenuItem } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

export const backendUrl = 'https://strapi.yeonv.com'

export const cloud = axios.create({
  baseURL: backendUrl
})

const handleAutoRelogin = () => {
  // Clear all cloud-related data
  localStorage.removeItem('ledfx-cloud-jwt')
  localStorage.removeItem('ledfx-cloud-jwt-expiry')
  localStorage.removeItem('ledfx-cloud-refresh-token')
  localStorage.removeItem('ledfx-cloud-username')
  localStorage.removeItem('ledfx-cloud-userid')
  localStorage.removeItem('ledfx-cloud-role')

  // Auto-trigger login flow based on environment
  if (window.location.pathname.includes('hassio_ingress')) {
    window.location.href = `${backendUrl}/connect/github?callback=${window.location.origin}`
  } else if (isElectron()) {
    window.open(
      `${backendUrl}/connect/github?callback=ledfx://auth/github/`,
      '_blank',
      'noopener,noreferrer'
    )
  } else {
    window.open(
      `${backendUrl}/connect/github?callback=${window.location.origin}`,
      '_blank',
      'noopener,noreferrer'
    )
  }
}

cloud.interceptors.request.use(async (config) => {
  const jwt = localStorage.getItem('ledfx-cloud-jwt')
  const jwtExpiry = localStorage.getItem('ledfx-cloud-jwt-expiry')
  const refreshToken = localStorage.getItem('ledfx-cloud-refresh-token')

  if (jwt && jwtExpiry) {
    const now = Math.floor(Date.now() / 1000)
    if (parseInt(jwtExpiry) < now) {
      // JWT expired, try to refresh
      if (refreshToken) {
        try {
          const response = await axios.post(`${backendUrl}/auth/refresh-token`, {
            refreshToken
          })
          const { jwt: newJwt, refreshToken: newRefreshToken } = response.data
          const decodedJwt = jwtDecode(newJwt)

          localStorage.setItem('ledfx-cloud-jwt', newJwt)
          localStorage.setItem('ledfx-cloud-jwt-expiry', decodedJwt.exp?.toString() || '0')
          localStorage.setItem('ledfx-cloud-refresh-token', newRefreshToken)

          config.headers.Authorization = `Bearer ${newJwt}`
          return config
        } catch (_error) {
          // Refresh failed, trigger auto re-login
          handleAutoRelogin()
          return Promise.reject(new Error('JWT refresh failed - auto re-login triggered'))
        }
      }
      // No refresh token, trigger auto re-login
      handleAutoRelogin()
      return Promise.reject(new Error('JWT expired - auto re-login triggered'))
    }
    config.headers.Authorization = `Bearer ${jwt}`
  }
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

export const MuiMenuItem = React.forwardRef<HTMLLIElement, Props>((props, ref) => {
  return <MenuItem ref={ref} {...props} />
})
