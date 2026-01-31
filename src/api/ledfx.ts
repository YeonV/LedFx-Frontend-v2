import axios from 'axios'
import { produce } from 'immer'
import isElectron from 'is-electron'
// import { useStore } from '@/store/useStore';

import useStore from '../store/useStore'
import type { IStore } from '../store/useStore'

const isBrowser = typeof window !== 'undefined'

const getElectronBaseURL = () => {
  // Check localStorage for SSL preference (set by electron main process on startup)
  if (isBrowser) {
    const sslEnabled = window.localStorage.getItem('ledfx-ssl-enabled') === 'true'
    if (sslEnabled) {
      return 'https://ledfx.local:8889'
    }
  }
  return 'http://localhost:8888'
}

const baseURL = isElectron()
  ? getElectronBaseURL()
  : (isBrowser && window.location.href.split('/#')[0].replace(/\/+$/, '')) ||
    'http://localhost:8888'

const storedURL = isBrowser ? window.localStorage.getItem('ledfx-host') : null

const api = axios.create({
  baseURL: storedURL || baseURL
})

export const Ledfx = async (
  path: string,
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE',
  body?: any,
  snackbar: boolean = true,
  responseType?: 'json' | 'blob'
): Promise<any> => {
  const { setState } = useStore
  try {
    let response = null as any
    const config = responseType === 'blob' ? { responseType: 'blob' as const } : {}

    switch (method) {
      case 'PUT':
        response = await api.put(path, body, config)
        break
      case 'DELETE':
        response = await api.delete(path, config)
        break
      case 'POST':
        response = await api.post(path, body, config)
        break
      default:
        response = await api.get(path, config)
        break
    }

    // If blob response, return it directly
    if (responseType === 'blob') {
      return response.data
    }

    if (response.data && response.data.payload && snackbar) {
      setState(
        produce((state: IStore) => {
          state.ui.snackbar = {
            isOpen: true,
            messageType: response.data.payload.type || 'error',
            message:
              response.data.payload.reason ||
              response.data.payload.message ||
              JSON.stringify(response.data.payload)
          }
        })
      )
      if (response.data.status) {
        return response.data
      }
    }
    if (response.payload && snackbar) {
      setState(
        produce((state: IStore) => {
          state.ui.snackbar = {
            isOpen: true,
            messageType: response.payload.type || 'error',
            message:
              response.payload.reason ||
              response.payload.message ||
              JSON.stringify(response.payload)
          }
        })
      )
      if (response.data.status) {
        return response.data
      }
    }
    if (response.status === 200) {
      setState(
        produce((state: IStore) => {
          state.disconnected = false
        })
      )
      return response.data || response
    }
    return setState(
      produce((state: IStore) => {
        state.ui.snackbar = {
          isOpen: true,
          messageType: 'error',
          message: response.error || JSON.stringify(response)
        }
      })
    )
  } catch (error: any) {
    if (error.message) {
      return setState(
        produce((state: IStore) => {
          state.ui.snackbar = {
            isOpen: true,
            messageType: 'error',
            message: JSON.stringify(error.message)
          }
        })
      )
    }
    setState(
      produce((state: IStore) => {
        state.ui.snackbar = {
          isOpen: true,
          messageType: 'error',
          message: JSON.stringify(error, null, 2)
        }
      })
    )
  }
  return true
}
