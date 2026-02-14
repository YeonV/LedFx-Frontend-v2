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

const storeClientIdentity = (set: any) => {
  const deviceId = getDeviceId()

  return {
    clientIdentity: {
      deviceId,
      name: `Client-${deviceId.slice(4, 12)}`,
      type: 'unknown' as ClientType
    } as ClientIdentity,

    setClientName: (name: string) =>
      set(
        produce((state: IStore) => {
          state.clientIdentity.name = name
        }),
        false,
        'clientIdentity/setClientName'
      ),

    setClientType: (type: ClientType) =>
      set(
        produce((state: IStore) => {
          state.clientIdentity.type = type
        }),
        false,
        'clientIdentity/setClientType'
      ),

    updateClientIdentity: (partial: Partial<ClientIdentity>) =>
      set(
        produce((state: IStore) => {
          Object.assign(state.clientIdentity, partial)
        }),
        false,
        'clientIdentity/updateClientIdentity'
      ),

    setClientId: (clientId: string) =>
      set(
        produce((state: IStore) => {
          state.clientIdentity.clientId = clientId
        }),
        false,
        'clientIdentity/setClientId'
      )
  }
}

export default storeClientIdentity
