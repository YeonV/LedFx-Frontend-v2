import React, { useCallback, useEffect, useRef, useMemo } from 'react'
import useStore from '../../../../../store/useStore'
import { useVStore } from '../../../../../hooks/vStore'
import { useWebSocket } from '../../../../../utils/Websocket/WebSocketProvider'
import { colorfulness, rgbSum } from '../../../../../utils/helpers'
import AutoApplySelector from '../SpotifyWidgetPro/AutoApplySelector'
import CardStack from './CardStack'

const VisualiserGradientImageSelectors = () => {
  const thumbnailPath = useStore((state) => state.thumbnailPath)

  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  const { send, isConnected } = useWebSocket()

  // Use global state for gradient and image auto-apply
  const selectedGradientGlobal = useStore((state) => state.selectedGradient)
  const gradientsGlobal = useStore((state) => state.gradients)
  const extractedColors = useStore((state) => state.extractedColors)

  // Global visualizer state
  const gradientVisualisers = useStore((state) => state.gradientVisualisers || [])
  const isActiveGradientVisualisers = useStore((state) => state.isActiveGradientVisualisers)
  const setGradientVisualisers = useStore((state) => state.setGradientVisualisers)
  const setIsActiveGradientVisualisers = useStore((state) => state.setIsActiveGradientVisualisers)

  const imageVisualisers = useStore((state) => state.imageVisualisers || [])
  const isActiveImageVisualisers = useStore((state) => state.isActiveImageVisualisers)
  const setImageVisualisers = useStore((state) => state.setImageVisualisers)
  const setIsActiveImageVisualisers = useStore((state) => state.setIsActiveImageVisualisers)

  // Use global state directly
  const selectedGradient = selectedGradientGlobal
  const gradients = gradientsGlobal
  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)

  const visualType = useVStore((state) => state.visualType)
  const updateButterchurnConfig = useVStore((state) => state.updateButterchurnConfig)
  const updateVisualizerConfig = useVStore((state) => state.updateVisualizerConfig)

  // Compute album art URL using backend API endpoint
  const albumArtUrl = thumbnailPath
    ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
    : ''

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

  const applyVisualiserConfig = useCallback(
    (selectedVisualisers: string[], visualizerId: string, update: Record<string, any>) => {
      const name = clientIdentity?.name || 'unknown-client'
      const selectedIds = selectedVisualisers.map((name) => nameToId[name]).filter(Boolean)
      const isCurrentClient = clientIdentity && selectedIds.includes(clientIdentity.clientId || '')
      console.log('YZ', visualType)

      if (isCurrentClient) {
        const targetId = visualizerId === 'active' ? visualType : visualizerId
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
              updateButterchurnConfig?.(filteredUpdate)
            } else {
              updateVisualizerConfig?.(targetId, filteredUpdate)
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
      if (otherClients.length && broadcastToClients && isConnected) {
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
    [
      clientIdentity,
      visualType,
      broadcastToClients,
      isConnected,
      nameToId,
      updateVisualizerConfigOptimistic,
      updateButterchurnConfig,
      updateVisualizerConfig,
      send
    ]
  )

  const prevIsActiveGradVisRef = useRef(false)
  const prevIsActiveImgVisRef = useRef(false)
  const prevColorsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')

  // AUTO-APPLY GRADIENT (Visualisers ONLY)
  useEffect(() => {
    const colorsKey =
      selectedGradient !== null && gradients[selectedGradient] ? gradients[selectedGradient] : ''
    const hasChanges =
      colorsKey !== prevColorsRef.current ||
      isActiveGradientVisualisers !== prevIsActiveGradVisRef.current

    prevColorsRef.current = colorsKey
    prevIsActiveGradVisRef.current = isActiveGradientVisualisers

    if (!hasChanges || colorsKey === '') return

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
  }, [
    isActiveGradientVisualisers,
    selectedGradient,
    gradientVisualisers,
    gradients,
    applyVisualiserConfig,
    extractedColors
  ])

  // AUTO-APPLY IMAGE (Visualisers ONLY)
  useEffect(() => {
    const hasChanges =
      albumArtUrl !== prevAlbumArtRef.current ||
      isActiveImageVisualisers !== prevIsActiveImgVisRef.current

    prevAlbumArtRef.current = albumArtUrl
    prevIsActiveImgVisRef.current = isActiveImageVisualisers

    if (!hasChanges || albumArtUrl === '') return

    if (isActiveImageVisualisers && imageVisualisers.length > 0) {
      applyVisualiserConfig(imageVisualisers, 'bladeImage', {
        image_source: albumArtUrl
      })
    }
  }, [albumArtUrl, isActiveImageVisualisers, imageVisualisers, applyVisualiserConfig])

  const handleGradientVisualiserChange = (event: any) => {
    const value = event.target.value
    setGradientVisualisers(typeof value === 'string' ? value.split(',') : value)
  }

  const handleImageVisualiserChange = (event: any) => {
    const value = event.target.value
    setImageVisualisers(typeof value === 'string' ? value.split(',') : value)
  }

  const toggleGradientVisualiserAutoApply = () => {
    setIsActiveGradientVisualisers(!isActiveGradientVisualisers)
  }

  const toggleImageVisualiserAutoApply = () => {
    setIsActiveImageVisualisers(!isActiveImageVisualisers)
  }

  // Filter out stale names
  const filteredGradientVisualisers = gradientVisualisers.filter((name) => nameToId[name])
  const filteredImageVisualisers = imageVisualisers.filter((name) => nameToId[name])

  useEffect(() => {
    if (filteredGradientVisualisers.length !== gradientVisualisers.length) {
      setGradientVisualisers(filteredGradientVisualisers)
    }
    if (filteredImageVisualisers.length !== imageVisualisers.length) {
      setImageVisualisers(filteredImageVisualisers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, gradientVisualisers, imageVisualisers])

  const visualizerInitialized = useStore((state) => state.ui.visualizerInitialized)
  if (!visualizerInitialized) {
    return null
  }
  return (
    <CardStack>
      <AutoApplySelector
        label="Gradient Visualisers"
        options={clients ? Object.entries(clients) : []}
        value={filteredGradientVisualisers}
        onChange={handleGradientVisualiserChange}
        isActive={isActiveGradientVisualisers}
        onToggle={toggleGradientVisualiserAutoApply}
        disabled={gradientVisualisers.length === 0}
        getOptionLabel={([, data]) => data?.name || ''}
        getOptionValue={([, data]) => data?.name || ''}
        renderValue={(selected) => selected.join(', ')}
      />
      <AutoApplySelector
        label="Image Visualisers"
        options={clients ? Object.entries(clients) : []}
        value={filteredImageVisualisers}
        onChange={handleImageVisualiserChange}
        isActive={isActiveImageVisualisers}
        onToggle={toggleImageVisualiserAutoApply}
        disabled={imageVisualisers.length === 0}
        getOptionLabel={([, data]) => data?.name || ''}
        getOptionValue={([, data]) => data?.name || ''}
        renderValue={(selected) => selected.join(', ')}
      />
    </CardStack>
  )
}

export default React.memo(VisualiserGradientImageSelectors)
