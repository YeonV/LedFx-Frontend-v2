import { useCallback } from 'react'
import useStore from '../store/useStore'
import type { EngineSection, NowPlayingEngine } from '../store/ui/storeSongDectector'

const BACKEND_SECTION: Record<EngineSection, 'gradient' | 'track_text' | 'album_art'> = {
  gradient: 'gradient',
  text: 'track_text',
  image: 'album_art'
}

/**
 * One row of the Song Detector's virtual targets, whichever engine runs it.
 *
 * The effective engine is not simply the local preference: if the backend
 * reports a section enabled, the core *is* driving those virtuals, so every
 * client must report core. That is what stops two browsers claiming the same
 * virtuals.
 */
export const useEngineRow = (section: EngineSection) => {
  const backendSection = BACKEND_SECTION[section]

  const preference = useStore((state) => state.nowPlayingEngines[section])
  const setPreference = useStore((state) => state.setNowPlayingEngine)
  // Reachable *and* switched on. The endpoint answers either way so the user
  // can turn the feature on, but while it is off the core reads nothing, so
  // offering Core here would be an engine that never runs.
  const endpointAvailable = useStore((state) => state.nowPlayingAvailable)
  const featureEnabled = useStore((state) => !!state.backendFeatures.now_playing_enabled)
  const available = endpointAvailable && featureEnabled
  const config = useStore((state) => state.nowPlayingState?.config)
  const updateNowPlayingConfig = useStore((state) => state.updateNowPlayingConfig)

  const localVirtuals = useStore((state) =>
    section === 'gradient'
      ? state.gradientVirtuals
      : section === 'text'
        ? state.textVirtuals
        : state.imageVirtuals
  )
  const localEnabled = useStore((state) =>
    section === 'gradient'
      ? state.gradientAutoApply
      : section === 'text'
        ? state.textAutoApply
        : state.imageAutoApply
  )
  const setLocalVirtuals = useStore((state) =>
    section === 'gradient'
      ? state.setGradientVirtuals
      : section === 'text'
        ? state.setTextVirtuals
        : state.setImageVirtuals
  )
  const setLocalEnabled = useStore((state) =>
    section === 'gradient'
      ? state.setGradientAutoApply
      : section === 'text'
        ? state.setTextAutoApply
        : state.setImageAutoApply
  )

  const backend = config?.[backendSection] as
    | { enabled?: boolean; virtual_ids?: string[] }
    | undefined
  // Virtuals too, not just the flag: the core only acts on a section that has
  // both, and track_text/album_art ship enabled by default. Testing the flag
  // alone would hand those rows to a core with nothing selected - it does
  // nothing while the browser stands down, and the row silently stops working.
  const backendOwns = !!backend?.enabled && (backend?.virtual_ids?.length ?? 0) > 0

  const engine: NowPlayingEngine = backendOwns ? 'core' : preference
  const isCore = engine === 'core'

  const writeBackend = useCallback(
    (patch: { enabled?: boolean; virtual_ids?: string[] }) =>
      updateNowPlayingConfig({
        // Spread first: variant/duration/preset are not in the UI and would
        // otherwise be wiped by this write.
        [backendSection]: { ...(backend ?? {}), ...patch }
      } as any),
    [updateNowPlayingConfig, backendSection, backend]
  )

  const setEngine = useCallback(
    async (next: NowPlayingEngine) => {
      if (next === engine) return
      setPreference(section, next)
      if (next === 'core') {
        await writeBackend({ enabled: localEnabled, virtual_ids: localVirtuals })
        setLocalEnabled(false)
      } else {
        const adopted = backend?.virtual_ids ?? localVirtuals
        setLocalVirtuals(adopted)
        // Only inherit running state if something was adopted, or the row
        // comes back active with an empty selection and looks stuck.
        setLocalEnabled(!!backend?.enabled && adopted.length > 0)
        await writeBackend({ enabled: false })
      }
    },
    [
      engine,
      section,
      setPreference,
      writeBackend,
      localEnabled,
      localVirtuals,
      setLocalEnabled,
      setLocalVirtuals,
      backend
    ]
  )

  const virtuals: string[] = isCore ? (backend?.virtual_ids ?? []) : localVirtuals
  // The raw flag, not backendOwns: this drives the play button, which must
  // report what the user actually toggled even before a virtual is picked.
  const enabled = isCore ? !!backend?.enabled : localEnabled

  const setVirtuals = useCallback(
    (next: string[]) => {
      if (isCore) writeBackend({ virtual_ids: next })
      else setLocalVirtuals(next)
    },
    [isCore, writeBackend, setLocalVirtuals]
  )

  const toggleEnabled = useCallback(() => {
    if (isCore) writeBackend({ enabled: !enabled })
    else setLocalEnabled(!enabled)
  }, [isCore, enabled, writeBackend, setLocalEnabled])

  return {
    engine,
    setEngine,
    engineAvailable: available,
    /** True while the core owns this row, so local appliers must stand down. */
    isCore,
    virtuals,
    setVirtuals,
    enabled,
    toggleEnabled
  }
}

export default useEngineRow
