import { useCallback } from 'react'
import useStore from '../store/useStore'
import type { EngineSection, NowPlayingEngine } from '../store/ui/storeSongDectector'

/** Row section -> backend config section. */
const BACKEND_SECTION: Record<EngineSection, 'gradient' | 'track_text' | 'album_art'> = {
  gradient: 'gradient',
  text: 'track_text',
  image: 'album_art'
}

/**
 * One row of the Song Detector's virtual targets, independent of which engine
 * runs it.
 *
 * The selector and the play button behave identically to the user; only the
 * destination changes. In browser mode they read and write the local store; in
 * core mode they read and write the backend Now Playing config, where the play
 * button is that section's `enabled` flag.
 *
 * The effective engine is not simply the local preference: if the backend
 * reports a section enabled, the core *is* driving those virtuals right now,
 * so every client reports core regardless of what it would have chosen. That
 * is what stops two browsers from both claiming the same virtuals.
 */
export const useEngineRow = (section: EngineSection) => {
  const backendSection = BACKEND_SECTION[section]

  const preference = useStore((state) => state.nowPlayingEngines[section])
  const setPreference = useStore((state) => state.setNowPlayingEngine)
  const available = useStore((state) => state.nowPlayingAvailable)
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
  const backendOwns = !!backend?.enabled

  // Core wins whenever it is actually driving; otherwise honour the preference.
  const engine: NowPlayingEngine = backendOwns ? 'core' : preference
  const isCore = engine === 'core'

  const writeBackend = useCallback(
    (patch: { enabled?: boolean; virtual_ids?: string[] }) =>
      updateNowPlayingConfig({
        // Spread the existing section so backend-only fields the UI never
        // shows (variant, duration, preset) survive the write.
        [backendSection]: { ...(backend ?? {}), ...patch }
      } as any),
    [updateNowPlayingConfig, backendSection, backend]
  )

  const setEngine = useCallback(
    async (next: NowPlayingEngine) => {
      if (next === engine) return
      setPreference(section, next)
      if (next === 'core') {
        // Hand this row over: carry the current selection up, and stand down
        // locally so both engines are never live at once.
        await writeBackend({ enabled: localEnabled, virtual_ids: localVirtuals })
        setLocalEnabled(false)
      } else {
        // Take it back: adopt whatever the core was using, then release it.
        const adopted = backend?.virtual_ids ?? localVirtuals
        setLocalVirtuals(adopted)
        // Only inherit the running state if there is something to run on -
        // otherwise the row comes back "active" with an empty selection, which
        // can never do anything and looks stuck.
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
  const enabled = isCore ? backendOwns : localEnabled

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
