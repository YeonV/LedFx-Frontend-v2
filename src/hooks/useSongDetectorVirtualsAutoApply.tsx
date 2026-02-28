import { useCallback, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { Ledfx } from '../api/ledfx'

// --- Virtuals Hook ---
export const useSongDetectorVirtualsAutoApply = () => {
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const thumbnailPath = useStore((state) => state.thumbnailPath)
  const spotifyTexter = useStore((state) => state.spotify.spotifyTexter)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const textAutoApply = useStore((state) => state.textAutoApply)
  const textVirtuals = useStore((state) => state.textVirtuals)
  const gradientAutoApply = useStore((state) => state.gradientAutoApply)
  const gradientVirtuals = useStore((state) => state.gradientVirtuals)
  const selectedGradient = useStore((state) => state.selectedGradient)
  const setGradients = useStore((state) => state.setGradients)
  const setSelectedGradient = useStore((state) => state.setSelectedGradient)
  const extractedColors = useStore((state) => state.extractedColors)
  const setExtractedColors = useStore((state) => state.setExtractedColors)
  const imageAutoApply = useStore((state) => state.imageAutoApply)
  const imageVirtuals = useStore((state) => state.imageVirtuals)
  const imageConfig = useStore((state) => state.imageConfig)
  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)

  // Track previous values to detect changes
  const prevTextTrackRef = useRef<string>('')
  const prevColorTrackRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')
  const prevIsActiveImgVirtRef = useRef(false)
  const prevIsActiveTextVirtRef = useRef(false)

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
    const trackChanged = currentTrack !== '' && currentTrack !== prevColorTrackRef.current
    const thumbnailChanged = thumbnailPath !== '' && thumbnailPath !== prevAlbumArtRef.current
    if (!thumbnailPath || (!trackChanged && !thumbnailChanged)) return
    if (trackChanged) {
      useStore.getState().incrementAlbumArtCache()
    }
    setExtractedColors([])
    setGradients([])
    setSelectedGradient(null)
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
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        if (a < 128) continue
        if (r + g + b < 50 || r + g + b > 700) continue
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        colorMap[hex] = (colorMap[hex] || 0) + 1
      }
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
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
    generatedGradients.push(createGradient(extractedColors))
    if (extractedColors.length >= 4) {
      generatedGradients.push(createGradient(extractedColors.filter((_, i) => i % 2 === 0)))
    }
    if (extractedColors.length >= 4) {
      generatedGradients.push(
        createGradient(extractedColors.slice(0, Math.ceil(extractedColors.length / 2)))
      )
    }
    if (extractedColors.length >= 4) {
      generatedGradients.push(
        createGradient(extractedColors.slice(Math.floor(extractedColors.length / 2)))
      )
    }
    generatedGradients.push(createGradient([...extractedColors].reverse()))
    if (extractedColors.length >= 4) {
      const firstTwo = extractedColors.slice(0, 2)
      const lastTwo = extractedColors.slice(-2)
      generatedGradients.push(createGradient([...firstTwo, ...lastTwo]))
    }
    setGradients(generatedGradients)
    if (selectedGradient === null && generatedGradients.length > 0) {
      setSelectedGradient(0)
    }
    // Microtask: trigger auto-apply after gradients are set
    Promise.resolve().then(() => {
      if (gradientAutoApply && gradientVirtuals.length > 0 && generatedGradients.length > 0) {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global',
          gradient: generatedGradients[0],
          virtuals: gradientVirtuals
        }).then(() => getVirtuals())
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedColors])

  // AUTO-APPLY TEXT: When track changes or toggle activates
  useEffect(() => {
    const hasChanges =
      currentTrack !== prevTextTrackRef.current || textAutoApply !== prevIsActiveTextVirtRef.current
    prevTextTrackRef.current = currentTrack
    prevIsActiveTextVirtRef.current = textAutoApply
    if (!hasChanges || currentTrack === '') return
    const timer = setTimeout(() => {
      if (textAutoApply && textVirtuals.length > 0) {
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
  }, [currentTrack, textAutoApply, textVirtuals, spotifyTexter, getVirtuals])

  // AUTO-APPLY GRADIENT: When gradients change (new song) or toggles change or selection change
  // Remove the old gradient auto-apply effect, now handled in the gradients generation effect

  // AUTO-APPLY IMAGE: When album art changes (new song) or toggles change
  useEffect(() => {
    const albumArtUrl =
      thumbnailPath && albumArtCacheBuster
        ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
        : ''
    const hasChanges =
      albumArtUrl !== prevAlbumArtRef.current || imageAutoApply !== prevIsActiveImgVirtRef.current
    prevAlbumArtRef.current = albumArtUrl
    prevIsActiveImgVirtRef.current = imageAutoApply
    if (!hasChanges || !albumArtUrl) return
    if (imageAutoApply && imageVirtuals.length > 0) {
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
  }, [thumbnailPath, albumArtCacheBuster, imageAutoApply, imageVirtuals, imageConfig, getVirtuals])
}
