import React, { useCallback } from 'react'
import useStore from '../../../../../store/useStore'
import AutoApplySelector from '../SpotifyWidgetPro/AutoApplySelector'
import CardStack from './CardStack'

const VirtualGradientImageSelectors = () => {
  const virtuals = useStore((state) => state.virtuals)

  // Use global state for gradient and image auto-apply
  const gradientVirtualsGlobal = useStore((state) => state.gradientVirtuals)
  const imageVirtualsGlobal = useStore((state) => state.imageVirtuals)
  const selectedGradientGlobal = useStore((state) => state.selectedGradient)
  const extractedColors = useStore((state) => state.extractedColors)
  const gradientAutoApply = useStore((state) => state.gradientAutoApply)
  const imageAutoApply = useStore((state) => state.imageAutoApply)

  const setGradientVirtualsGlobal = useStore((state) => state.setGradientVirtuals)
  const setImageVirtualsGlobal = useStore((state) => state.setImageVirtuals)
  const setGradientAutoApply = useStore((state) => state.setGradientAutoApply)
  const setImageAutoApply = useStore((state) => state.setImageAutoApply)

  // Use global state directly
  const gradientVirtuals = gradientVirtualsGlobal
  const imageVirtuals = imageVirtualsGlobal
  const selectedGradient = selectedGradientGlobal

  // Compute album art URL using backend API endpoint

  const toggleGradientAutoApply = useCallback(() => {
    setGradientAutoApply(!gradientAutoApply)
  }, [gradientAutoApply, setGradientAutoApply])

  const toggleImageAutoApply = useCallback(() => {
    setImageAutoApply(!imageAutoApply)
  }, [imageAutoApply, setImageAutoApply])

  const handleGradientVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from image virtuals if present
    setImageVirtualsGlobal(imageVirtuals.filter((v) => !selected.includes(v)))
    setGradientVirtualsGlobal(selected)
  }

  const handleImageVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from gradient virtuals if present
    setGradientVirtualsGlobal(gradientVirtuals.filter((v) => !selected.includes(v)))
    setImageVirtualsGlobal(selected)
  }

  return (
    <CardStack>
      <AutoApplySelector
        label="Gradient Virtuals"
        options={Object.keys(virtuals)}
        value={gradientVirtuals}
        onChange={handleGradientVirtualChange}
        isActive={gradientAutoApply}
        onToggle={toggleGradientAutoApply}
        disabled={
          gradientVirtuals.length === 0 || selectedGradient === null || extractedColors.length === 0
        }
      />
      <AutoApplySelector
        label="Image Virtuals"
        options={Object.keys(virtuals)}
        value={imageVirtuals}
        onChange={handleImageVirtualChange}
        isActive={imageAutoApply}
        onToggle={toggleImageAutoApply}
        disabled={imageVirtuals.length === 0 || extractedColors.length === 0}
      />
    </CardStack>
  )
}

export default React.memo(VirtualGradientImageSelectors)
