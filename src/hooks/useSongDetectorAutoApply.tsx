import { useCallback, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { Ledfx } from '../api/ledfx'
import { getVStore } from './vStore'
import { useWebSocket } from '../utils/Websocket/WebSocketProvider'
import { colorfulness, rgbSum } from '../utils/helpers'

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

  // Visualizer auto-apply state
  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )

  const gradientVisualisers = useStore((state) => state.gradientVisualisers || [])
  const isActiveGradientVisualisers = useStore((state) => state.isActiveGradientVisualisers)
  const imageVisualisers = useStore((state) => state.imageVisualisers || [])
  const isActiveImageVisualisers = useStore((state) => state.isActiveImageVisualisers)
  const textVisualisers = useStore((state) => state.textVisualisers || [])
  const isActiveTextVisualisers = useStore((state) => state.isActiveVisualisers)

  const { send } = useWebSocket()

  // Track previous values to detect changes
  const prevTextTrackRef = useRef<string>('')
  const prevColorTrackRef = useRef<string>('')
  const prevGradientsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')
  const prevIsActiveGradVisRef = useRef(false)
  const prevIsActiveGradVirtRef = useRef(false)
  const prevSelectedGradientRef = useRef<number | null>(null)
  const prevIsActiveImgVisRef = useRef(false)
  const prevIsActiveImgVirtRef = useRef(false)
  const prevIsActiveTextVirtRef = useRef(false)
  const prevIsActiveTextVisRef = useRef(false)

  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)
  const albumArtUrl = thumbnailPath
    ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
    : ''

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

  // Memoize nameToId to avoid changing dependencies on every render
  const nameToId = useCallback(() => {
    return clients
      ? Object.entries(clients).reduce(
          (acc, [id, data]) => {
            if (data && data.name) acc[data.name] = id
            return acc
          },
          {} as Record<string, string>
        )
      : {}
  }, [clients])

  const applyVisualiserConfig = useCallback(
    (selectedVisualisers: string[], visualizerId: string, update: Record<string, any>) => {
      const name = clientIdentity?.name || 'unknown-client'
      const nameToIdMap = nameToId()
      const selectedIds = selectedVisualisers.map((n) => nameToIdMap[n]).filter(Boolean)
      const isCurrentClient = clientIdentity && selectedIds.includes(clientIdentity.clientId || '')

      if (isCurrentClient) {
        const vStore = getVStore()
        const vState = vStore?.getState()
        const targetId = visualizerId === 'active' ? vState?.visualType : visualizerId
        if (targetId) {
          const api = (window as any).visualiserApi
          const registry = api?.getVisualizerRegistry?.() || {}
          const schema = registry[targetId]?.getUISchema?.()

          const isPolymorphic = visualizerId === 'active'
          const filteredUpdate = isPolymorphic
            ? Object.keys(update).reduce(
                (acc, key) => {
                  const hasProp =
                    schema?.properties?.[key] !== undefined ||
                    registry[targetId]?.defaultConfig?.[key] !== undefined ||
                    key === 'gradient' ||
                    key === 'gradient2' ||
                    key === 'image_source' ||
                    key === 'primaryColor' ||
                    key === 'secondaryColor' ||
                    key === 'tertiaryColor' ||
                    key === 'low_band' ||
                    key === 'bassColor' ||
                    key === 'mid_band' ||
                    key === 'midColor' ||
                    key === 'high_band' ||
                    key === 'highColor' ||
                    key === 'sunColor' ||
                    key === 'backgroundColor' ||
                    key === 'peakColor'

                  if (hasProp) {
                    acc[key] = update[key]
                  }
                  return acc
                },
                {} as Record<string, any>
              )
            : update

          if (Object.keys(filteredUpdate).length > 0) {
            if (targetId === 'butterchurn') {
              vState?.updateButterchurnConfig?.(filteredUpdate)
            } else {
              vState?.updateVisualizerConfig?.(targetId, filteredUpdate)
            }
            updateVisualizerConfigOptimistic(name, {
              configs: {
                [targetId]: filteredUpdate
              }
            })
          }
        }
      }

      const otherClients = selectedIds.filter((id) => id !== clientIdentity?.clientId)
      if (otherClients.length && broadcastToClients) {
        broadcastToClients(
          {
            broadcast_type: 'custom',
            target: { mode: 'uuids', uuids: otherClients },
            payload: {
              category: 'visualiser',
              action: 'set_visual_config',
              visualizerId,
              config: update
            }
          },
          send
        )
      }
    },
    [clientIdentity, nameToId, updateVisualizerConfigOptimistic, broadcastToClients, send]
  )

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

  // AUTO-APPLY TEXT: When track changes or toggle activates
  useEffect(() => {
    const hasChanges =
      currentTrack !== prevTextTrackRef.current ||
      textAutoApply !== prevIsActiveTextVirtRef.current ||
      isActiveTextVisualisers !== prevIsActiveTextVisRef.current

    prevTextTrackRef.current = currentTrack
    prevIsActiveTextVirtRef.current = textAutoApply
    prevIsActiveTextVisRef.current = isActiveTextVisualisers

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
      if (isActiveTextVisualisers && textVisualisers.length > 0) {
        applyVisualiserConfig(textVisualisers, 'bladeTexter', {
          text: currentTrack.split(' - ')[0] || '',
          text2: currentTrack.split(' - ')[1] || currentTrack.split(' - ')[0] || currentTrack,
          height_percent: 10,
          width_percent: 200,
          speed_option_1: 0.1,
          offset_y2: 0.2,
          offset_y: -0.2,
          font: 'Stop',
          font2: 'technique'
        })
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [
    currentTrack,
    textAutoApply,
    textVirtuals,
    spotifyTexter,
    isActiveTextVisualisers,
    textVisualisers,
    applyVisualiserConfig,
    clientIdentity,
    getVirtuals
  ])

  // AUTO-APPLY GRADIENT: When gradients change (new song) or toggles change or selection change
  useEffect(() => {
    const gradientsKey = gradients.join(',')
    const hasChanges =
      gradientsKey !== prevGradientsRef.current ||
      isActiveGradientVisualisers !== prevIsActiveGradVisRef.current ||
      gradientAutoApply !== prevIsActiveGradVirtRef.current ||
      selectedGradient !== prevSelectedGradientRef.current

    prevGradientsRef.current = gradientsKey
    prevIsActiveGradVisRef.current = isActiveGradientVisualisers
    prevIsActiveGradVirtRef.current = gradientAutoApply
    prevSelectedGradientRef.current = selectedGradient

    if (
      !hasChanges ||
      gradientsKey === '' ||
      selectedGradient === null ||
      !gradients[selectedGradient]
    )
      return

    const timer = setTimeout(() => {
      if (gradientAutoApply && gradientVirtuals.length > 0) {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global',
          gradient: gradients[selectedGradient],
          virtuals: gradientVirtuals
        }).then(() => getVirtuals())
      }

      if (isActiveGradientVisualisers && gradientVisualisers.length > 0) {
        // Sort: most colorful first, grayish after, whitest second-last, blackest last
        const sortedSpecial = [...extractedColors].sort((a, b) => {
          const cA = colorfulness(a)
          const cB = colorfulness(b)
          const sA = rgbSum(a)
          const sB = rgbSum(b)

          // Case 1: Both colorful (high chroma) -> sort by chroma descending
          if (cA > 30 && cB > 30) return cB - cA
          // Case 2: One colorful, one gray -> colorful first
          if (cA > 30) return -1
          if (cB > 30) return 1
          // Case 3: Both gray -> sort by brightness (whitest first)
          return sB - sA
        })

        applyVisualiserConfig(gradientVisualisers, 'active', {
          gradient: sortedSpecial[0] || '#0000ff',
          // gradient: selectedGradient !== null ? gradients[selectedGradient] : sortedSpecial[1] || '',
          gradient2: sortedSpecial[1] || '#00ffff',
          primaryColor: sortedSpecial[0] || '#00ffff',
          secondaryColor: sortedSpecial[1] || '#0000ff',
          tertiaryColor: sortedSpecial[2] || '#00ff00',
          low_band: sortedSpecial[0] || '#00ffff',
          bassColor: sortedSpecial[0] || '#00ffff',
          mid_band: sortedSpecial[1] || '#0000ff',
          midColor: sortedSpecial[1] || '#0000ff',
          high_band: sortedSpecial[2] || '#ff00ff',
          highColor: sortedSpecial[2] || '#ff00ff',
          sunColor:
            [sortedSpecial[sortedSpecial.length - 2], sortedSpecial[3]].sort(
              (a, b) => colorfulness(b) - colorfulness(a)
            )[0] || '#ffff00',
          backgroundColor: '#000000',
          // backgroundColor:
          //   sortedSpecial.length > 0 ? sortedSpecial[sortedSpecial.length - 1] : '#000000',
          peakColor: sortedSpecial.length > 1 ? sortedSpecial[sortedSpecial.length - 2] : '#ffffff'
        })
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [
    gradients,
    gradientAutoApply,
    selectedGradient,
    gradientVirtuals,
    isActiveGradientVisualisers,
    gradientVisualisers,
    applyVisualiserConfig,
    extractedColors,
    getVirtuals
  ])

  // AUTO-APPLY IMAGE: When album art changes (new song) or toggles change
  useEffect(() => {
    const hasChanges =
      thumbnailPath !== prevAlbumArtRef.current ||
      isActiveImageVisualisers !== prevIsActiveImgVisRef.current ||
      imageAutoApply !== prevIsActiveImgVirtRef.current
    prevAlbumArtRef.current = thumbnailPath
    prevIsActiveImgVisRef.current = isActiveImageVisualisers
    prevIsActiveImgVirtRef.current = imageAutoApply

    if (!hasChanges || thumbnailPath === '') return

    if (imageAutoApply && imageVirtuals.length > 0) {
      Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: albumArtUrl || 'current_album_art.jpg',
          ...imageConfig
        },
        virtuals: imageVirtuals
      }).then(() => getVirtuals())
    }

    if (isActiveImageVisualisers && imageVisualisers.length > 0) {
      applyVisualiserConfig(imageVisualisers, 'bladeImage', {
        image_source: albumArtUrl
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    thumbnailPath,
    imageAutoApply,
    imageVirtuals,
    imageConfig,
    isActiveImageVisualisers,
    imageVisualisers,
    applyVisualiserConfig
  ])
}

export default useSongDetectorAutoApply
