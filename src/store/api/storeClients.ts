import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'

/**
 * Clients API Store
 * Manages connected clients list and broadcast operations
 */

export interface ClientMetadata {
  ip: string
  device_id: string
  name: string
  type: 'controller' | 'visualiser' | 'mobile' | 'display' | 'api' | 'unknown'
  connected_at: number
  last_active: number
}

export type ClientsMap = Record<string, ClientMetadata>

export interface BroadcastTarget {
  mode: 'all' | 'type' | 'names' | 'uuids'
  value?: string
  names?: string[]
  uuids?: string[]
}

export interface BroadcastPayload {
  sender_name?: string
  broadcast_type: 'visualiser_control' | 'scene_sync' | 'color_palette' | 'custom'
  target: BroadcastTarget
  payload: Record<string, any>
}

const storeClients = (set: any) => ({
  clients: {} as ClientsMap,

  getClients: async () => {
    const resp = await Ledfx('/api/clients')
    if (resp && typeof resp === 'object') {
      set(
        produce((state: IStore) => {
          state.clients = resp as ClientsMap
        }),
        false,
        'clients/getClients'
      )
    }
  },

  updateClients: (clients: ClientsMap) =>
    set(
      produce((state: IStore) => {
        state.clients = clients
      }),
      false,
      'clients/updateClients'
    ),

  broadcastToClients: async (broadcastData: BroadcastPayload, senderId: string) => {
    try {
      const resp = await Ledfx('/api/clients', 'POST', {
        action: 'broadcast',
        sender_id: senderId,
        ...broadcastData
      })
      return resp
    } catch (error) {
      console.error('Broadcast failed:', error)
      return null
    }
  },

  syncClients: async (clientId: string) => {
    try {
      const resp = await Ledfx('/api/clients', 'POST', {
        action: 'sync',
        client_id: clientId
      })
      return resp
    } catch (error) {
      console.error('Sync failed:', error)
      return null
    }
  }
})

export default storeClients
