import React, { useEffect, useState, useRef } from 'react'
import useStore from '../../../../../store/useStore'
import { Ledfx } from '../../../../../api/ledfx'
import AutoApplySelector from './AutoApplySelector'

const VirtualTextSelector = ({ generalDetector }: { generalDetector?: boolean }) => {
  const virtuals = useStore((state) => state.virtuals)
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const spotifyTexter = useStore((state) => state.spotify.spotifyTexter)

  const getVirtuals = useStore((state) => state.getVirtuals)

  // Use global state for song detector
  const textAutoApplyGlobal = useStore((state) => state.textAutoApply)
  const textVirtualsGlobal = useStore((state) => state.textVirtuals)
  const setTextAutoApply = useStore((state) => state.setTextAutoApply)
  const setTextVirtuals = useStore((state) => state.setTextVirtuals)

  // Local state for non-song-detector mode
  const [textVirtualsLocal, setTextVirtualsLocal] = useState<string[]>([])
  const [isActiveLocal, setIsActiveLocal] = useState(false)

  // Determine which state to use based on generalDetector prop
  const textVirtuals = generalDetector ? textVirtualsGlobal : textVirtualsLocal
  const isActive = generalDetector ? textAutoApplyGlobal : isActiveLocal

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

    if (!hasChanges || currentTrack === '') return

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
  }, [currentTrack, spotifyTexter, textVirtuals, isActive, getVirtuals])

  const handleTextVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    if (generalDetector) {
      setTextVirtuals(selected)
    } else {
      setTextVirtualsLocal(selected)
    }
  }

  const applyText = async () => {
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
    if (isActive) {
      if (generalDetector) {
        setTextAutoApply(false)
      } else {
        setIsActiveLocal(false)
      }
    } else {
      applyText()
      if (generalDetector) {
        setTextAutoApply(true)
      } else {
        setIsActiveLocal(true)
      }
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
    />
  )
}

export default React.memo(VirtualTextSelector)
