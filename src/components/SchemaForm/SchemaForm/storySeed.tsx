import { useEffect, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import useStore from '../../../store/useStore'
import { api } from '../../../api/ledfx'

// Story helpers: seed the store, and answer the getters' API calls with the same data (real
// getters, mocked responses) so a fetch on mount keeps the seed; `routes` adds or overrides
// responses. Everything the decorator touches is put back when the story unmounts, so it can't
// leak into other stories.
export type Seed = {
  audioDevices?: object
  virtuals?: object
  comPorts?: string[]
  automagic?: boolean
  routes?: Record<string, unknown>
}
const STATE_KEYS = [
  'audioDevices',
  'virtuals',
  'comPorts',
  'scenes',
  'playlists',
  'devices',
  'instanceLoaded'
]

export const Seeded = ({ seed, children }: { seed: Seed; children: ReactNode }) => {
  const [restore] = useState(() => {
    const { automagic, routes: extra, ...data } = seed
    const before = useStore.getState() as unknown as Record<string, unknown>
    const prev = Object.fromEntries(STATE_KEYS.map((k) => [k, before[k]]))
    const prevAutomagic = useStore.getState().uiPersist.blenderAutomagic
    const prevAdapter = api.defaults.adapter
    const routes: Record<string, unknown> = {
      '/api/audio/devices': { devices: data.audioDevices ?? {}, active_device_index: 0 },
      '/api/virtuals': { paused: false, virtuals: data.virtuals ?? {} },
      '/api/comports': data.comPorts ?? [],
      '/api/scenes': { scenes: {} },
      '/api/playlists': { playlists: {} },
      '/api/devices': { devices: {} },
      ...extra
    }
    useStore.setState({ ...data, instanceLoaded: {} } as never)
    if (automagic !== undefined) {
      useStore.setState((st) => ({ uiPersist: { ...st.uiPersist, blenderAutomagic: automagic } }))
    }
    api.defaults.adapter = async (config) => {
      const body = routes[config.url ?? '']
      if (body === undefined) throw new Error(`no mock for ${config.url}`)
      return { data: body, status: 200, statusText: 'OK', headers: {}, config }
    }
    return () => {
      useStore.setState(prev as never)
      if (automagic !== undefined) {
        useStore.setState((st) => ({
          uiPersist: { ...st.uiPersist, blenderAutomagic: prevAutomagic }
        }))
      }
      api.defaults.adapter = prevAdapter
    }
  })
  useEffect(() => restore, [restore])
  return <>{children}</>
}

export const withStore = (seed: Seed) => (Story: () => ReactElement) => (
  <Seeded seed={seed}>
    <Story />
  </Seeded>
)
