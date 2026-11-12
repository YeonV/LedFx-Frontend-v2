import { useEffect, useMemo } from 'react'
import useStore from '../../store/useStore'
import type { IStore } from '../../store/useStore'
import { loadSource } from './loadSource'
import { instanceOptions, type EnumOption, type InstanceState } from './fields'

// Each source's slice of the store; a component subscribes to its own slice only.
const slice = (s: IStore, source?: string): InstanceState[keyof InstanceState] =>
  ({
    audio_devices: s.audioDevices,
    virtuals: s.virtuals,
    com_ports: s.comPorts,
    scenes: s.scenes,
    playlists: s.playlists,
    devices: s.devices
  })[source as keyof InstanceState]

const loaders = (s: IStore) => ({
  audio_devices: s.getAudioDevices,
  virtuals: s.getVirtuals,
  com_ports: s.getComPorts,
  scenes: s.getScenes,
  playlists: s.getPlaylists,
  devices: s.getDevices
})

/** Load a source into the store (deduped, marks it loaded). */
export const loadInstanceSource = (source: string) => {
  const s = useStore.getState()
  return loadSource(source, loaders(s), s.markInstanceLoaded)
}

/**
 * The options of a field marked with `x-ledfx-enum-source`, from the store (see instanceOptions).
 * COM ports have no event to follow, so they are fetched when a field of that source mounts.
 */
export const useInstanceOptions = (source?: string): EnumOption[] | undefined => {
  const data = useStore((s) => slice(s, source))
  // Every source is loaded when it's used: nothing else guarantees it.
  useEffect(() => {
    if (source) loadInstanceSource(source)
  }, [source])
  return useMemo(
    () => (source ? instanceOptions(source, { [source]: data }) : undefined),
    [source, data]
  )
}

/** Whether the source's getter has resolved once. */
export const useInstanceLoaded = (source?: string): boolean =>
  useStore((s) => !!source && !!s.instanceLoaded[source])
