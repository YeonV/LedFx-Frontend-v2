import { useCallback, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { Ledfx } from '../api/ledfx'

/**
 * Global auto-apply hook for song detector
 * Runs independently of widget visibility
 * Handles color extraction, gradient generation, and auto-apply
 */
const useSongDetectorAutoApply = () => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const thumbnailPath = useStore((state) => state.thumbnailPath)
  const spotifyTexter = useStore((state) => state.spotify.spotifyTexter)
  const getVirtuals = useStore((state) => state.getVirtuals)

  // Text auto-apply state
  const textAutoApply = useStore((state) => state.textAutoApply)
  const textVirtuals = useStore((state) => state.textVirtuals)

  // Gradient auto-apply state
  const gradientAutoApply = useStore((state) => state.gradientAutoApply)
  const gradientVirtuals = useStore((state) => state.gradientVirtuals)
  const selectedGradient = useStore((state) => state.selectedGradient)
  const gradients = useStore((state) => state.gradients)
  const setGradients = useStore((state) => state.setGradients)
  const setSelectedGradient = useStore((state) => state.setSelectedGradient)
  const extractedColors = useStore((state) => state.extractedColors)
  const setExtractedColors = useStore((state) => state.setExtractedColors)

  // Image auto-apply state
  const imageAutoApply = useStore((state) => state.imageAutoApply)
  const imageVirtuals = useStore((state) => state.imageVirtuals)
  const imageConfig = useStore((state) => state.imageConfig)

  // Track previous values to detect changes
  const prevTextTrackRef = useRef<string>('')
  const prevColorTrackRef = useRef<string>('')
  const prevGradientsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')

  // Helper: Calculate color distance (Euclidean distance in RGB space)
  const colorDistance = (hex1: string, hex2: string): number => {
    const rgb1 = {
      r: parseInt(hex1.slice(1, 3), 16),
      g: parseInt(hex1.slice(3, 5), 16),
      b: parseInt(hex1.slice(5, 7), 16)
    }
    const rgb2 = {
      r: parseInt(hex2.slice(1, 3), 16),
      g: parseInt(hex2.slice(3, 5), 16),
      b: parseInt(hex2.slice(5, 7), 16)
    }
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2)
    )
  }

  // Helper: Filter similar colors
  const filterSimilarColors = useCallback((colorList: string[], threshold = 50): string[] => {
    const filtered: string[] = []
    for (const color of colorList) {
      if (filtered.every((c) => colorDistance(c, color) > threshold)) {
        filtered.push(color)
      }
    }
    return filtered
  }, [])

  // EXTRACT COLORS: When album art or track changes
  useEffect(() => {
    // Trigger on track change OR thumbnail path change
    const trackChanged = currentTrack !== '' && currentTrack !== prevColorTrackRef.current
    const thumbnailChanged = thumbnailPath !== '' && thumbnailPath !== prevAlbumArtRef.current

    if (!thumbnailPath || (!trackChanged && !thumbnailChanged)) return

    // Increment cache buster for new track
    if (trackChanged) {
      useStore.getState().incrementAlbumArtCache()
    }

    // Reset colors and gradients for new song
    setExtractedColors([])
    setGradients([])
    setSelectedGradient(null)

    // Use backend API to load image for color extraction with store cache buster
    const cacheBuster = useStore.getState().albumArtCacheBuster
    const imageUrl = `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${cacheBuster}`

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const colorMap: { [key: string]: number } = {}

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        if (a < 128) continue // Skip transparent pixels

        // Skip near-black and near-white colors
        if (r + g + b < 50 || r + g + b > 700) continue

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        colorMap[hex] = (colorMap[hex] || 0) + 1
      }

      // Sort by frequency
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)

      // Filter similar colors and take top colors
      const uniqueColors = filterSimilarColors(sortedColors, 50).slice(0, 8)
      setExtractedColors(uniqueColors)
    }

    img.onerror = () => {}

    prevAlbumArtRef.current = thumbnailPath
    prevColorTrackRef.current = currentTrack
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnailPath, currentTrack, filterSimilarColors])

  // GENERATE GRADIENTS: When colors change
  useEffect(() => {
    if (extractedColors.length < 2) return

    const createGradient = (colorSet: string[]) => {
      const stops = colorSet.map((color, idx) => `${color} ${(idx / (colorSet.length - 1)) * 100}%`)
      return `linear-gradient(90deg, ${stops.join(', ')})`
    }

    const generatedGradients: string[] = []

    // Gradient 1: All colors
    generatedGradients.push(createGradient(extractedColors))

    // Gradient 2: Every other color
    if (extractedColors.length >= 4) {
      generatedGradients.push(createGradient(extractedColors.filter((_, i) => i % 2 === 0)))
    }

    // Gradient 3: First half
    if (extractedColors.length >= 4) {
      generatedGradients.push(
        createGradient(extractedColors.slice(0, Math.ceil(extractedColors.length / 2)))
      )
    }

    // Gradient 4: Second half
    if (extractedColors.length >= 4) {
      generatedGradients.push(
        createGradient(extractedColors.slice(Math.floor(extractedColors.length / 2)))
      )
    }

    // Gradient 5: Reversed
    generatedGradients.push(createGradient([...extractedColors].reverse()))

    // Gradient 6: First and last 2 colors
    if (extractedColors.length >= 4) {
      const firstTwo = extractedColors.slice(0, 2)
      const lastTwo = extractedColors.slice(-2)
      generatedGradients.push(createGradient([...firstTwo, ...lastTwo]))
    }

    setGradients(generatedGradients)

    // Auto-select first gradient if none selected
    if (selectedGradient === null && generatedGradients.length > 0) {
      setSelectedGradient(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedColors, selectedGradient])

  // AUTO-APPLY TEXT: When track changes
  useEffect(() => {
    if (
      textAutoApply &&
      currentTrack &&
      currentTrack !== '' &&
      textVirtuals.length > 0 &&
      currentTrack !== prevTextTrackRef.current
    ) {
      setTimeout(() => {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global_effect',
          type: 'texter2d',
          config: { ...spotifyTexter, text: currentTrack },
          fallback: spotifyTexter.fallback,
          virtuals: textVirtuals
        }).then(() => getVirtuals())
      }, 200)
    }
    prevTextTrackRef.current = currentTrack
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, textAutoApply, textVirtuals, spotifyTexter])

  // AUTO-APPLY GRADIENT: When gradients change (new song)
  useEffect(() => {
    const gradientsKey = gradients.join(',')
    if (
      gradientAutoApply &&
      gradientVirtuals.length > 0 &&
      gradients.length > 0 &&
      selectedGradient !== null &&
      gradients[selectedGradient] &&
      gradientsKey !== prevGradientsRef.current &&
      gradientsKey !== '' // Ensure we have actual gradients, not empty array
    ) {
      Ledfx('/api/effects', 'PUT', {
        action: 'apply_global',
        gradient: gradients[selectedGradient],
        virtuals: gradientVirtuals
      }).then(() => getVirtuals())
    }
    prevGradientsRef.current = gradientsKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradients, gradientAutoApply, selectedGradient, gradientVirtuals])

  // AUTO-APPLY IMAGE: When album art changes (new song)
  useEffect(() => {
    if (
      imageAutoApply &&
      thumbnailPath &&
      thumbnailPath !== '' &&
      imageVirtuals.length > 0 &&
      thumbnailPath !== prevAlbumArtRef.current
    ) {
      Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: 'current_album_art.jpg',
          ...imageConfig
        },
        virtuals: imageVirtuals
      }).then(() => getVirtuals())
    }
    prevAlbumArtRef.current = thumbnailPath
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnailPath, imageAutoApply, imageVirtuals, imageConfig])
}

export default useSongDetectorAutoApply
