import { produce } from 'immer'
import { Ledfx } from '../../api/ledfx'
import type { IStore } from '../useStore'
import useStore from '../useStore'

const reloadAudioDevices = () => useStore.getState().getAudioDevices()

export interface SendspinServer {
  server_url: string
  client_name: string
}

export interface SendspinServersMap {
  [id: string]: SendspinServer
}

export interface SendspinDiscoveredServer {
  name: string
  server_url: string
  host: string
  port: number
  already_configured: boolean
}

const storeSendspin = (set: any) => ({
  sendspinServers: {} as SendspinServersMap,
  sendspinDiscovered: [] as SendspinDiscoveredServer[],
  sendspinDiscovering: false,
  sendspinAvailable: true,

  getSendspinServers: async () => {
    const resp = await Ledfx('/api/sendspin/servers', 'GET', undefined, false)
    if (resp?.status === 'success') {
      set(
        produce((state: IStore) => {
          state.sendspinServers = resp.data?.servers ?? resp.payload?.servers ?? {}
          state.sendspinAvailable = true
        }),
        false,
        'sendspin/getServers'
      )
    } else if (resp?.status === 'failed') {
      // Endpoint unavailable (Python < 3.12 / missing package) but servers may
      // still be present in config (synced by getSystemConfig). Keep existing
      // sendspinServers and just flag the endpoint as unavailable.
      set(
        produce((state: IStore) => {
          state.sendspinAvailable = false
        }),
        false,
        'sendspin/unavailable'
      )
    }
  },

  addSendspinServer: async (data: { id: string; server_url: string; client_name?: string }) => {
    const resp = await Ledfx('/api/sendspin/servers', 'POST', data)
    if (resp?.status === 'success') {
      set(
        produce((state: IStore) => {
          state.sendspinServers[data.id] = {
            server_url: data.server_url,
            client_name: data.client_name ?? 'LedFx'
          }
        }),
        false,
        'sendspin/addServer'
      )
      reloadAudioDevices()
      return true
    }
    return false
  },

  updateSendspinServer: async (id: string, data: { server_url?: string; client_name?: string }) => {
    const resp = await Ledfx(`/api/sendspin/servers/${id}`, 'PUT', data)
    if (resp?.status === 'success') {
      set(
        produce((state: IStore) => {
          if (state.sendspinServers[id]) {
            state.sendspinServers[id] = {
              ...state.sendspinServers[id],
              ...data
            }
          }
        }),
        false,
        'sendspin/updateServer'
      )
      reloadAudioDevices()
      return true
    }
    return false
  },

  deleteSendspinServer: async (id: string) => {
    const resp = await Ledfx(`/api/sendspin/servers/${id}`, 'DELETE')
    if (resp?.status === 'success') {
      set(
        produce((state: IStore) => {
          delete state.sendspinServers[id]
        }),
        false,
        'sendspin/deleteServer'
      )
      reloadAudioDevices()
      return true
    }
    return false
  },

  renameSendspinServer: async (
    oldId: string,
    newId: string,
    data: { server_url: string; client_name: string }
  ) => {
    // DELETE the old entry first, then POST a new one with the new id
    const delResp = await Ledfx(`/api/sendspin/servers/${oldId}`, 'DELETE')
    if (delResp?.status !== 'success') return false
    const addResp = await Ledfx('/api/sendspin/servers', 'POST', {
      id: newId,
      server_url: data.server_url,
      client_name: data.client_name
    })
    if (addResp?.status === 'success') {
      set(
        produce((state: IStore) => {
          delete state.sendspinServers[oldId]
          state.sendspinServers[newId] = {
            server_url: data.server_url,
            client_name: data.client_name
          }
        }),
        false,
        'sendspin/renameServer'
      )
      reloadAudioDevices()
      return true
    }
    return false
  },

  discoverSendspinServers: async (timeout = 3.0) => {
    set(
      produce((state: IStore) => {
        state.sendspinDiscovering = true
        state.sendspinDiscovered = []
      }),
      false,
      'sendspin/discoverStart'
    )
    const resp = await Ledfx(`/api/sendspin/discover?timeout=${timeout}`, 'GET', undefined, false)
    if (resp?.status === 'success') {
      set(
        produce((state: IStore) => {
          state.sendspinDiscovered = resp.data?.servers ?? []
          state.sendspinDiscovering = false
        }),
        false,
        'sendspin/discoverDone'
      )
    } else {
      set(
        produce((state: IStore) => {
          state.sendspinDiscovering = false
        }),
        false,
        'sendspin/discoverFailed'
      )
    }
  },

  clearSendspinDiscovered: () => {
    set(
      produce((state: IStore) => {
        state.sendspinDiscovered = []
        state.sendspinDiscovering = false
      }),
      false,
      'sendspin/clearDiscovered'
    )
  }
})

export default storeSendspin
