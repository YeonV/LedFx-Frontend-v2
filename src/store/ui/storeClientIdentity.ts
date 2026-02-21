import { produce } from 'immer'
import type { IStore } from '../useStore'

/**
 * Client Identity Store
 * Manages local client identity (device ID, name, type)
 * Persisted via Zustand middleware for unique device identification
 */

export type ClientType = 'controller' | 'visualiser' | 'mobile' | 'display' | 'api' | 'unknown'

export interface ClientIdentity {
  deviceId: string
  name: string
  type: ClientType
  clientId?: string
}

// Generate persistent device ID
const generateDeviceId = (): string => {
  const uuid = crypto.randomUUID()
  return `web-${uuid}`
}

// Get or create device ID from localStorage
const getDeviceId = (): string => {
  const stored = localStorage.getItem('ledfx-device-id')
  if (stored) return stored

  const newId = generateDeviceId()
  localStorage.setItem('ledfx-device-id', newId)
  return newId
}

const getSessionClientIdentity = (deviceId: string): ClientIdentity => {
  const stored = sessionStorage.getItem('ledfx-client-identity')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Always use the current deviceId
      return { ...parsed, deviceId }
    } catch {
      // fallback
    }
  }
  // Default
  return {
    deviceId,
    name: `Client-${deviceId.slice(4, 12)}`,
    type: 'unknown'
  }
}

const setSessionClientIdentity = (identity: ClientIdentity) => {
  sessionStorage.setItem('ledfx-client-identity', JSON.stringify(identity))
}

const storeClientIdentity = (set: any) => {
  const deviceId = getDeviceId()
  const initialIdentity = getSessionClientIdentity(deviceId)

  return {
    clientIdentity: initialIdentity as ClientIdentity,

    setClientName: (name: string) =>
      set(
        produce((state: IStore) => {
          state.clientIdentity.name = name
          setSessionClientIdentity(state.clientIdentity)
        }),
        false,
        'clientIdentity/setClientName'
      ),

    setClientType: (type: ClientType) =>
      set(
        produce((state: IStore) => {
          state.clientIdentity.type = type
          setSessionClientIdentity(state.clientIdentity)
        }),
        false,
        'clientIdentity/setClientType'
      ),

    /**
     * Updates multiple client identity fields atomically and persists to sessionStorage.
     * This prevents multiple re-renders and synchronization loops.
     */
    updateClientIdentity: (partial: Partial<ClientIdentity>) =>
      set(
        produce((state: IStore) => {
          Object.assign(state.clientIdentity, partial)
          setSessionClientIdentity(state.clientIdentity)
        }),
        false,
        'clientIdentity/updateClientIdentity'
      ),

    setClientId: (clientId: string) =>
      set(
        produce((state: IStore) => {
          state.clientIdentity.clientId = clientId
          setSessionClientIdentity(state.clientIdentity)
        }),
        false,
        'clientIdentity/setClientId'
      )
  }
}

export default storeClientIdentity
