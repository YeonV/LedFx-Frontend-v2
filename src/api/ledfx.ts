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
  const showPayload = (payload: any) =>
    setState(
      produce((state: IStore) => {
        state.ui.snackbar = {
          isOpen: true,
          messageType: payload.type || 'error',
          message: payload.reason || payload.message || JSON.stringify(payload)
        }
      })
    )
  try {
    let response = null as any
    const config = responseType === 'blob' ? { responseType: 'blob' as const } : {}

    switch (method) {
      case 'PUT':
        response = await api.put(path, body, config)
        break
      case 'DELETE':
        response = await api.delete(path, { ...config, ...(body && { data: body.data }) })
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
      showPayload(response.data.payload)
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
    // A failed non-GET request that still carries a LedFx body ({status, payload, errors?}):
    // show its message and hand the body to the caller, like a 200/202 failure.
    // GET callers only test truthiness, so they keep the old behaviour.
    const errBody = error.response?.data
    if ((method === 'PUT' || method === 'POST' || method === 'DELETE') && errBody?.status) {
      if (snackbar) showPayload(errBody.payload ?? errBody)
      return errBody
    }
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
  // A failure never resolves to `true` (callers treat `res.status !== 'failed'` as success).
  return undefined
}
