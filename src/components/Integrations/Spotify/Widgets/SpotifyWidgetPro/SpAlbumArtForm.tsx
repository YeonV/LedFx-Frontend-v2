import { useEffect, useState, useContext, useCallback, useRef, useMemo } from 'react'
import { Box, Stack, Button } from '@mui/material'
import useStore from '../../../../../store/useStore'
import { SpotifyStateContext, SpStateContext } from '../../SpotifyProvider'
import { Ledfx } from '../../../../../api/ledfx'
import { getVStore } from '../../../../../hooks/vStore'
import { useWebSocket } from '../../../../../utils/Websocket/WebSocketProvider'
import { colorfulness, rgbSum } from '../../../../../utils/helpers'
import AutoApplySelector from './AutoApplySelector'
import CardStack from '../SongDetector/CardStack'

const SpAlbumArtForm = ({ generalDetector }: { generalDetector?: boolean }) => {
  const virtuals = useStore((state) => state.virtuals)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const spotifyCtx = useContext(SpotifyStateContext)
  const spCtx = useContext(SpStateContext)

  const gradientVirtuals = useStore((state) => state.spotify.spotifyAlbumArtGradientVirtuals)
  const imageVirtuals = useStore((state) => state.spotify.spotifyAlbumArtImageVirtuals)
  const setGradientVirtuals = useStore((state) => state.setSpotifyAlbumArtGradientVirtuals)
  const setImageVirtuals = useStore((state) => state.setSpotifyAlbumArtImageVirtuals)

  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  const { send, isConnected } = useWebSocket()

  // Global visualizer state (Song Detector)
  const gradientVisualisersGlobal = useStore((state) => state.gradientVisualisers || [])
  const isActiveGradientVisualisersGlobal = useStore((state) => state.isActiveGradientVisualisers)
  const setGradientVisualisersGlobal = useStore((state) => state.setGradientVisualisers)
  const setIsActiveGradientVisualisersGlobal = useStore(
    (state) => state.setIsActiveGradientVisualisers
  )

  const imageVisualisersGlobal = useStore((state) => state.imageVisualisers || [])
  const isActiveImageVisualisersGlobal = useStore((state) => state.isActiveImageVisualisers)
  const setImageVisualisersGlobal = useStore((state) => state.setImageVisualisers)
  const setIsActiveImageVisualisersGlobal = useStore((state) => state.setIsActiveImageVisualisers)

  // Local visualizer state
  const [gradientVisualisersLocal, setGradientVisualisersLocal] = useState<string[]>([])
  const [isActiveGradientVisualisersLocal, setIsActiveGradientVisualisersLocal] = useState(false)
  const [imageVisualisersLocal, setImageVisualisersLocal] = useState<string[]>([])
  const [isActiveImageVisualisersLocal, setIsActiveImageVisualisersLocal] = useState(false)

  // Determine which state to use
  const gradientVisualisers = generalDetector ? gradientVisualisersGlobal : gradientVisualisersLocal
  const isActiveGradientVisualisers = generalDetector
    ? isActiveGradientVisualisersGlobal
    : isActiveGradientVisualisersLocal

  const imageVisualisers = generalDetector ? imageVisualisersGlobal : imageVisualisersLocal
  const isActiveImageVisualisers = generalDetector
    ? isActiveImageVisualisersGlobal
    : isActiveImageVisualisersLocal

  // Virtuals Auto-Apply State
  const gradientAutoApplyGlobal = useStore((state) => state.gradientAutoApply)
  const imageAutoApplyGlobal = useStore((state) => state.imageAutoApply)
  const setGradientAutoApplyGlobal = useStore((state) => state.setGradientAutoApply)
  const setImageAutoApplyGlobal = useStore((state) => state.setImageAutoApply)

  const [gradientAutoApplyLocal, setGradientAutoApplyLocal] = useState(false)
  const [imageAutoApplyLocal, setImageAutoApplyLocal] = useState(false)

  const isActiveGradientVirtuals = generalDetector
    ? gradientAutoApplyGlobal
    : gradientAutoApplyLocal
  const isActiveImageVirtuals = generalDetector ? imageAutoApplyGlobal : imageAutoApplyLocal

  const [colors, setColors] = useState<string[]>([])
  const [albumArtUrl, setAlbumArtUrl] = useState<string>('')
  const [gradients, setGradients] = useState<string[]>([])
  const [selectedGradient, setSelectedGradient] = useState<number | null>(null)

  const prevColorsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')
  const prevIsActiveGradVisRef = useRef(false)
  const prevIsActiveGradVirtRef = useRef(false)
  const prevSelectedGradientRef = useRef<number | null>(null)
  const prevIsActiveImgVisRef = useRef(false)
  const prevIsActiveImgVirtRef = useRef(false)

  // Get album art URL
  useEffect(() => {
    const url =
      spotifyCtx?.track_window?.current_track?.album.images[0]?.url ||
      spCtx?.item?.album?.images[0]?.url ||
      ''
    setAlbumArtUrl(url)
  }, [spotifyCtx, spCtx])

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
  const filterSimilarColors = (colorList: string[], threshold = 50): string[] => {
    const filtered: string[] = []
    for (const color of colorList) {
      const isSimilar = filtered.some((c) => colorDistance(c, color) < threshold)
      if (!isSimilar) {
        filtered.push(color)
      }
    }
    return filtered
  }

  const nameToId = useMemo(
    () =>
      clients
        ? Object.entries(clients).reduce(
            (acc, [id, data]) => {
              if (data && data.name) acc[data.name] = id
              return acc
            },
            {} as Record<string, string>
          )
        : {},
    [clients]
  )

  const handleMultiClientAction = useCallback(
    (
      selectedVisualisers: string[],
      localAction: (() => void) | null,
      remoteAction: string,
      extraPayload: Record<string, any> = {}
    ) => {
      if (!clientIdentity || !clientIdentity.clientId) return
      const selectedIds = selectedVisualisers.map((name) => nameToId[name]).filter(Boolean)
      if (selectedIds.includes(clientIdentity.clientId) && localAction) {
        localAction()
      }
      const otherClients = selectedIds.filter((id) => id !== clientIdentity.clientId)
      if (otherClients.length && broadcastToClients && isConnected) {
        broadcastToClients(
          {
            broadcast_type: 'custom',
            target: { mode: 'uuids', uuids: otherClients },
            payload: {
              category: 'visualiser',
              action: remoteAction,
              ...extraPayload
            }
          },
          send
        )
      }
    },
    [clientIdentity, nameToId, broadcastToClients, isConnected, send]
  )

  const applyVisualiserConfig = useCallback(
    (selectedVisualisers: string[], visualizerId: string, update: Record<string, any>) => {
      const name = clientIdentity?.name || 'unknown-client'
      const selectedIds = selectedVisualisers.map((name) => nameToId[name]).filter(Boolean)
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
                  const api = (window as any).visualiserApi
                  const registry = api?.getVisualizerRegistry?.() || {}
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

      handleMultiClientAction(selectedVisualisers, null, 'set_visual_config', {
        visualizerId,
        config: update
      })
    },
    [clientIdentity, nameToId, updateVisualizerConfigOptimistic, handleMultiClientAction]
  )

  const applyGradientVirtuals = useCallback(async () => {
    if (selectedGradient !== null && gradientVirtuals.length > 0) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global',
        gradient: gradients[selectedGradient],
        virtuals: gradientVirtuals
      })
      getVirtuals()
    }
  }, [selectedGradient, gradientVirtuals, gradients, getVirtuals])

  const applyImageVirtuals = useCallback(async () => {
    if (albumArtUrl && imageVirtuals.length > 0) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: albumArtUrl,
          min_size: 1
        },
        virtuals: imageVirtuals
      })
      getVirtuals()
    }
  }, [albumArtUrl, imageVirtuals, getVirtuals])

  const applyBoth = useCallback(
    async (once: boolean = false) => {
      await Promise.all([applyGradientVirtuals(), applyImageVirtuals()])

      // Also apply to visualizers
      if (selectedGradient !== null && gradientVisualisers.length > 0) {
        // Sort: most colorful first, grayish after, whitest second-last, blackest last
        const sortedSpecial = [...colors].sort((a, b) => {
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
      if (albumArtUrl && imageVisualisers.length > 0) {
        applyVisualiserConfig(imageVisualisers, 'bladeImage', {
          image_source: albumArtUrl
        })
      }

      if (once) {
        if (generalDetector) {
          setGradientAutoApplyGlobal(false)
          setImageAutoApplyGlobal(false)
        } else {
          setGradientAutoApplyLocal(false)
          setImageAutoApplyLocal(false)
        }
      } else {
        if (generalDetector) {
          setGradientAutoApplyGlobal(true)
          setImageAutoApplyGlobal(true)
        } else {
          setGradientAutoApplyLocal(true)
          setImageAutoApplyLocal(true)
        }
      }
    },
    [
      applyGradientVirtuals,
      applyImageVirtuals,
      selectedGradient,
      gradientVisualisers,
      albumArtUrl,
      imageVisualisers,
      colors,
      applyVisualiserConfig,
      generalDetector,
      setGradientAutoApplyGlobal,
      setImageAutoApplyGlobal
    ]
  )

  // Extract colors from album art
  useEffect(() => {
    if (!albumArtUrl) return

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = albumArtUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      // Sample colors from image (extract dominant colors)
      const colorMap = new Map<string, number>()
      const saturatedColors = new Map<string, number>() // Separate tracking for saturated colors
      const step = 5 // Sample even more pixels for better diversity

      for (let i = 0; i < pixels.length; i += 4 * step) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const a = pixels[i + 3]

        // Skip transparent pixels
        if (a < 128) continue

        // Calculate saturation and brightness
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max === 0 ? 0 : (max - min) / max

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

        // Track all colors
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1)

        // Separately track highly saturated colors with lower threshold
        if (saturation > 0.3) {
          saturatedColors.set(hex, (saturatedColors.get(hex) || 0) + 1)
        }
      }

      // Get top regular colors
      const topColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 200)
        .map((entry) => entry[0])

      // Get ALL saturated colors (ensure we capture even less frequent vibrant colors)
      const topSaturated = Array.from(saturatedColors.entries())
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]) // Get ALL saturated colors, not just top 100

      // Combine both, prioritizing saturated colors
      const combined = Array.from(new Set([...topSaturated, ...topColors]))

      // Filter out similar colors with dynamic threshold
      // Start with tighter threshold for more distinct colors, loosen if needed
      let uniqueColors = filterSimilarColors(combined, 40)
      if (uniqueColors.length < 4) {
        uniqueColors = filterSimilarColors(combined, 50)
      }
      if (uniqueColors.length < 3) {
        uniqueColors = filterSimilarColors(combined, 60)
      }
      if (uniqueColors.length < 2) {
        uniqueColors = filterSimilarColors(combined, 75)
      }

      // Take fewer colors for more distinct palette (4-6 typically)
      setColors(uniqueColors.slice(0, 6))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumArtUrl])

  // Generate multiple gradient variations from colors
  useEffect(() => {
    if (colors.length < 2) return

    const createGradient = (colorSet: string[]) => {
      const stops = colorSet.map((color, index) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        const percentage = ((index / (colorSet.length - 1)) * 100).toFixed(0)
        return `rgb(${r}, ${g}, ${b}) ${percentage}%`
      })
      return `linear-gradient(90deg, ${stops.join(', ')})`
    }

    const generatedGradients: string[] = []

    // Gradient 1: All colors
    generatedGradients.push(createGradient(colors))

    // Gradient 2: Every other color
    if (colors.length >= 4) {
      generatedGradients.push(createGradient(colors.filter((_, i) => i % 2 === 0)))
    }

    // Gradient 3: First half
    if (colors.length >= 4) {
      generatedGradients.push(createGradient(colors.slice(0, Math.ceil(colors.length / 2))))
    }

    // Gradient 4: Second half
    if (colors.length >= 4) {
      generatedGradients.push(createGradient(colors.slice(Math.floor(colors.length / 2))))
    }

    // Gradient 5: Reversed
    generatedGradients.push(createGradient([...colors].reverse()))

    // Gradient 6: First and last 2 colors
    if (colors.length >= 4) {
      generatedGradients.push(
        createGradient([colors[0], colors[1], colors[colors.length - 2], colors[colors.length - 1]])
      )
    }

    setGradients(generatedGradients)

    // Auto-select first gradient if none selected
    if (selectedGradient === null && generatedGradients.length > 0) {
      setSelectedGradient(0)
    }
  }, [colors, selectedGradient]) // Only run when colors change to update generatedGradients

  // AUTO-APPLY GRADIENT: Trigger on color change, toggle change, selection change
  useEffect(() => {
    const colorsKey = colors.join(',')
    const hasChanges =
      colorsKey !== prevColorsRef.current ||
      isActiveGradientVisualisers !== prevIsActiveGradVisRef.current ||
      isActiveGradientVirtuals !== prevIsActiveGradVirtRef.current ||
      selectedGradient !== prevSelectedGradientRef.current

    prevColorsRef.current = colorsKey
    prevIsActiveGradVisRef.current = isActiveGradientVisualisers
    prevIsActiveGradVirtRef.current = isActiveGradientVirtuals
    prevSelectedGradientRef.current = selectedGradient

    if (!hasChanges) return

    const timer = setTimeout(() => {
      if (
        isActiveGradientVirtuals &&
        selectedGradient !== null &&
        gradientVirtuals.length > 0 &&
        gradients[selectedGradient]
      ) {
        Ledfx('/api/effects', 'PUT', {
          action: 'apply_global',
          gradient: gradients[selectedGradient],
          virtuals: gradientVirtuals
        }).then(() => getVirtuals())
      }
      if (
        isActiveGradientVisualisers &&
        selectedGradient !== null &&
        gradientVisualisers.length > 0 &&
        gradients[selectedGradient]
      ) {
        // Sort: most colorful first, grayish after, whitest second-last, blackest last
        const sortedSpecial = [...colors].sort((a, b) => {
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
    colors,
    isActiveGradientVirtuals,
    isActiveGradientVisualisers,
    selectedGradient,
    gradientVirtuals,
    gradientVisualisers,
    gradients,
    getVirtuals,
    applyVisualiserConfig
  ])

  // Auto-reapply image when song changes (if currently active)
  useEffect(() => {
    const hasChanges =
      albumArtUrl !== prevAlbumArtRef.current ||
      isActiveImageVisualisers !== prevIsActiveImgVisRef.current ||
      isActiveImageVirtuals !== prevIsActiveImgVirtRef.current
    prevAlbumArtRef.current = albumArtUrl
    prevIsActiveImgVisRef.current = isActiveImageVisualisers
    prevIsActiveImgVirtRef.current = isActiveImageVirtuals

    if (!hasChanges) return

    if (isActiveImageVirtuals && imageVirtuals.length > 0) {
      Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: albumArtUrl,
          min_size: 1
        },
        virtuals: imageVirtuals
      }).then(() => getVirtuals())
    }
    if (isActiveImageVisualisers && imageVisualisers.length > 0) {
      applyVisualiserConfig(imageVisualisers, 'bladeImage', {
        image_source: albumArtUrl
      })
    }
  }, [
    albumArtUrl,
    isActiveImageVirtuals,
    isActiveImageVisualisers,
    imageVirtuals,
    imageVisualisers,
    getVirtuals,
    applyVisualiserConfig
  ])

  const handleGradientVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from image virtuals if present
    setImageVirtuals(imageVirtuals.filter((v) => !selected.includes(v)))
    setGradientVirtuals(selected)
  }

  const handleImageVirtualChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    // Remove from gradient virtuals if present
    setGradientVirtuals(gradientVirtuals.filter((v) => !selected.includes(v)))
    setImageVirtuals(selected)
  }

  // Filter out stale names not in current clients
  const filteredGradientVisualisers = gradientVisualisers.filter((name) => nameToId[name])
  const filteredImageVisualisers = imageVisualisers.filter((name) => nameToId[name])

  // Auto-cleanup state if stale names are present
  useEffect(() => {
    if (generalDetector) {
      if (filteredGradientVisualisers.length !== gradientVisualisers.length) {
        setGradientVisualisersGlobal(filteredGradientVisualisers)
      }
      if (filteredImageVisualisers.length !== imageVisualisers.length) {
        setImageVisualisersGlobal(filteredImageVisualisers)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, gradientVisualisers, imageVisualisers])

  const handleGradientVisualiserChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    if (generalDetector) {
      setGradientVisualisersGlobal(selected)
    } else {
      setGradientVisualisersLocal(selected)
    }
  }

  const handleImageVisualiserChange = (event: any) => {
    const value = event.target.value
    const selected = typeof value === 'string' ? value.split(',') : value
    if (generalDetector) {
      setImageVisualisersGlobal(selected)
    } else {
      setImageVisualisersLocal(selected)
    }
  }

  const toggleAutoApplyGradientVisualisers = () => {
    if (generalDetector) {
      setIsActiveGradientVisualisersGlobal(!isActiveGradientVisualisersGlobal)
    } else {
      setIsActiveGradientVisualisersLocal(!isActiveGradientVisualisersLocal)
    }
  }

  const toggleAutoApplyImageVisualisers = () => {
    if (generalDetector) {
      setIsActiveImageVisualisersGlobal(!isActiveImageVisualisersGlobal)
    } else {
      setIsActiveImageVisualisersLocal(!isActiveImageVisualisersLocal)
    }
  }

  const toggleAutoApplyGradientVirtuals = () => {
    if (generalDetector) {
      setGradientAutoApplyGlobal(!gradientAutoApplyGlobal)
    } else {
      setGradientAutoApplyLocal(!gradientAutoApplyLocal)
    }
  }

  const toggleAutoApplyImageVirtuals = () => {
    if (generalDetector) {
      setImageAutoApplyGlobal(!imageAutoApplyGlobal)
    } else {
      setImageAutoApplyLocal(!imageAutoApplyLocal)
    }
  }

  return (
    <Stack spacing={2} maxWidth={400}>
      {/* Album Art */}
      {albumArtUrl && (
        <Box
          component="img"
          src={albumArtUrl}
          alt="Album Art"
          sx={{ maxHeight: 300, objectFit: 'contain', borderRadius: 1 }}
        />
      )}

      {/* Extracted Colors */}
      {colors.length > 0 && (
        <Box>
          <Box sx={{ mb: 1, fontWeight: 'bold' }}>Extracted Colors:</Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {colors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 1,
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Generated Gradients */}
      {gradients.length > 0 && (
        <Box>
          <Box sx={{ mb: 1, fontWeight: 'bold' }}>Generated Gradients:</Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {gradients.map((gradient, index) => (
              <Box
                key={index}
                sx={{
                  width: 140,
                  height: 30,
                  background: gradient,
                  borderRadius: '10px',
                  border: selectedGradient === index ? '2px solid #fff' : '1px solid #fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedGradient === index ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                title="Click to select"
                onClick={() => setSelectedGradient(index)}
              />
            ))}
          </Stack>
        </Box>
      )}

      <CardStack>
        <AutoApplySelector
          label="Gradient Virtuals"
          options={Object.keys(virtuals)}
          value={gradientVirtuals}
          onChange={handleGradientVirtualChange}
          isActive={isActiveGradientVirtuals}
          onToggle={toggleAutoApplyGradientVirtuals}
          disabled={gradientVirtuals.length === 0}
        />
        <AutoApplySelector
          label="Image Virtuals"
          options={Object.keys(virtuals)}
          value={imageVirtuals}
          onChange={handleImageVirtualChange}
          isActive={isActiveImageVirtuals}
          onToggle={toggleAutoApplyImageVirtuals}
          disabled={imageVirtuals.length === 0}
        />
      </CardStack>

      <CardStack>
        <AutoApplySelector
          label="Gradient Visualisers"
          options={clients ? Object.entries(clients) : []}
          value={generalDetector ? filteredGradientVisualisers : gradientVisualisers}
          onChange={handleGradientVisualiserChange}
          isActive={isActiveGradientVisualisers}
          onToggle={toggleAutoApplyGradientVisualisers}
          disabled={gradientVisualisers.length === 0}
          getOptionLabel={([, data]) => data?.name || ''}
          getOptionValue={([, data]) => data?.name || ''}
          renderValue={(selected) => selected.join(', ')}
        />
        <AutoApplySelector
          label="Image Visualisers"
          options={clients ? Object.entries(clients) : []}
          value={generalDetector ? filteredImageVisualisers : imageVisualisers}
          onChange={handleImageVisualiserChange}
          isActive={isActiveImageVisualisers}
          onToggle={toggleAutoApplyImageVisualisers}
          disabled={imageVisualisers.length === 0}
          getOptionLabel={([, data]) => data?.name || ''}
          getOptionValue={([, data]) => data?.name || ''}
          renderValue={(selected) => selected.join(', ')}
        />
      </CardStack>

      <Button fullWidth variant="outlined" onClick={() => applyBoth(true)}>
        Test Once
      </Button>
    </Stack>
  )
}

export default SpAlbumArtForm
