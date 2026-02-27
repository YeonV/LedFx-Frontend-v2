import React, { useCallback, useEffect, useRef } from 'react'
import useStore from '../../../../../store/useStore'
import { Ledfx } from '../../../../../api/ledfx'
import AutoApplySelector from '../SpotifyWidgetPro/AutoApplySelector'
import CardStack from './CardStack'

const VirtualGradientImageSelectors = () => {
  const virtuals = useStore((state) => state.virtuals)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const thumbnailPath = useStore((state) => state.thumbnailPath)

  // Use global state for gradient and image auto-apply
  const gradientVirtualsGlobal = useStore((state) => state.gradientVirtuals)
  const imageVirtualsGlobal = useStore((state) => state.imageVirtuals)
  const selectedGradientGlobal = useStore((state) => state.selectedGradient)
  const gradientsGlobal = useStore((state) => state.gradients)
  const extractedColors = useStore((state) => state.extractedColors)
  const gradientAutoApply = useStore((state) => state.gradientAutoApply)
  const imageAutoApply = useStore((state) => state.imageAutoApply)
  const imageConfigGlobal = useStore((state) => state.imageConfig)

  const setGradientVirtualsGlobal = useStore((state) => state.setGradientVirtuals)
  const setImageVirtualsGlobal = useStore((state) => state.setImageVirtuals)
  const setGradientAutoApply = useStore((state) => state.setGradientAutoApply)
  const setImageAutoApply = useStore((state) => state.setImageAutoApply)

  // Use global state directly
  const gradientVirtuals = gradientVirtualsGlobal
  const imageVirtuals = imageVirtualsGlobal
  const selectedGradient = selectedGradientGlobal
  const gradients = gradientsGlobal
  const imageConfig = imageConfigGlobal
  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)

  // Compute album art URL using backend API endpoint
  const albumArtUrl = thumbnailPath
    ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
    : ''

  const applyGradient = useCallback(async () => {
    if (selectedGradient !== null && gradientVirtuals.length > 0) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global',
        gradient: gradients[selectedGradient],
        virtuals: gradientVirtuals
      })
      getVirtuals()
    }
  }, [selectedGradient, gradientVirtuals, gradients, getVirtuals])

  const applyImage = useCallback(async () => {
    if (imageVirtuals.length > 0) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: 'current_album_art.jpg',
          ...imageConfig
        },
        virtuals: imageVirtuals
      })
      getVirtuals()
    }
  }, [imageVirtuals, imageConfig, getVirtuals])

  const toggleGradientAutoApply = useCallback(() => {
    setGradientAutoApply(!gradientAutoApply)
  }, [gradientAutoApply, setGradientAutoApply])

  const toggleImageAutoApply = useCallback(() => {
    setImageAutoApply(!imageAutoApply)
  }, [imageAutoApply, setImageAutoApply])

  const prevIsActiveGradVirtRef = useRef(false)
  const prevIsActiveImgVirtRef = useRef(false)
  const prevColorsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')
  const prevImageConfigRef = useRef(imageConfig)

  // AUTO-APPLY GRADIENT (Virtuals ONLY)
  useEffect(() => {
    const colorsKey =
      selectedGradient !== null && gradients[selectedGradient] ? gradients[selectedGradient] : ''
    const hasChanges =
      colorsKey !== prevColorsRef.current || gradientAutoApply !== prevIsActiveGradVirtRef.current
    prevColorsRef.current = colorsKey
    prevIsActiveGradVirtRef.current = gradientAutoApply

    if (!hasChanges || colorsKey === '') return

    if (gradientAutoApply) {
      applyGradient()
    }
  }, [gradientAutoApply, selectedGradient, gradients, applyGradient])

  // AUTO-APPLY IMAGE (Virtuals ONLY)
  useEffect(() => {
    // Check if the config actually changed
    const configChanged = prevImageConfigRef.current !== imageConfig

    const hasChanges =
      albumArtUrl !== prevAlbumArtRef.current ||
      imageAutoApply !== prevIsActiveImgVirtRef.current ||
      configChanged // <-- Added to hasChanges

    prevAlbumArtRef.current = albumArtUrl
    prevIsActiveImgVirtRef.current = imageAutoApply
    prevImageConfigRef.current = imageConfig // <-- Update ref

    if (!hasChanges || albumArtUrl === '') return

    if (imageAutoApply) {
      applyImage()
    }
  }, [albumArtUrl, imageAutoApply, imageConfig, applyImage])

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
