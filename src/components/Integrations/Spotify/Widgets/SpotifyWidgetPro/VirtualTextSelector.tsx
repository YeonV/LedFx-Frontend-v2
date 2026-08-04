import React, { useEffect, useState, useRef } from 'react'
import useStore from '../../../../../store/useStore'
import useEngineRow from '../../../../../hooks/useEngineRow'
import { Ledfx } from '../../../../../api/ledfx'
import AutoApplySelector from './AutoApplySelector'

const VirtualTextSelector = ({ generalDetector }: { generalDetector?: boolean }) => {
  const virtuals = useStore((state) => state.virtuals)
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const spotifyTexter = useStore((state) => state.spotify.spotifyTexter)

  const getVirtuals = useStore((state) => state.getVirtuals)

  // Song-detector mode routes through whichever engine owns the text row.
  const text = useEngineRow('text')
  const useEngine = !!generalDetector

  // Local state for non-song-detector mode
  const [textVirtualsLocal, setTextVirtualsLocal] = useState<string[]>([])
  const [isActiveLocal, setIsActiveLocal] = useState(false)

  const textVirtuals = useEngine ? text.virtuals : textVirtualsLocal
  const isActive = useEngine ? text.enabled : isActiveLocal
  // While the core owns this row it pushes the texter effect itself; this tab
  // must not also push, or the two engines fight over the same virtuals.
  const coreOwns = useEngine && text.isCore

  const matrix = Object.keys(virtuals).filter((v: string) => (virtuals[v].config.rows || 1) > 1)

  const prevTrackRef = useRef<string>('')
  const prevIsActiveVirtRef = useRef<boolean>(false)

  const prevTexterRef = useRef(spotifyTexter)

  useEffect(() => {
    const configChanged = prevTexterRef.current !== spotifyTexter

    const hasChanges =
      currentTrack !== prevTrackRef.current ||
      isActive !== prevIsActiveVirtRef.current ||
      configChanged

    prevTrackRef.current = currentTrack
    prevIsActiveVirtRef.current = isActive
    prevTexterRef.current = spotifyTexter

    if (!hasChanges || currentTrack === '' || coreOwns) return

    const timer = setTimeout(() => {
      if (isActive && textVirtuals.length > 0) {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global_effect',
          type: 'texter2d',
          config: { ...spotifyTexter, text: currentTrack },
          fallback: spotifyTexter.fallback,
          virtuals: textVirtuals
        }).then(() => getVirtuals())
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [currentTrack, spotifyTexter, textVirtuals, isActive, getVirtuals, coreOwns])

  const handleTextVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    if (useEngine) {
      text.setVirtuals(selected)
    } else {
      setTextVirtualsLocal(selected)
    }
  }

  const applyText = async () => {
    if (coreOwns) return
    if (textVirtuals.length > 0 && currentTrack) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'texter2d',
        config: { ...spotifyTexter, text: currentTrack },
        fallback: spotifyTexter.fallback,
        virtuals: textVirtuals
      })
      getVirtuals()
    }
  }

  const toggleAutoApply = () => {
    if (useEngine) {
      // Turning on locally applies once immediately; in core mode this is
      // purely the backend's enabled flag and it pushes on the next track.
      if (!isActive) applyText()
      text.toggleEnabled()
      return
    }
    if (isActive) {
      setIsActiveLocal(false)
    } else {
      applyText()
      setIsActiveLocal(true)
    }
  }

  return (
    <AutoApplySelector
      label="Text Virtuals"
      options={matrix}
      value={textVirtuals}
      onChange={handleTextVirtualChange}
      isActive={isActive}
      onToggle={toggleAutoApply}
      disabled={textVirtuals.length === 0}
      engine={useEngine ? text.engine : undefined}
      onEngineChange={useEngine ? text.setEngine : undefined}
      engineAvailable={text.engineAvailable}
    />
  )
}

export default React.memo(VirtualTextSelector)
