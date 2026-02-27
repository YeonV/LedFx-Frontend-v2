import { useCallback, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { useVStore } from './vStore'
import { colorfulness, rgbSum } from '../utils/helpers'
import { useWebSocket } from '../utils/Websocket/WebSocketProvider'

// --- Visualisers Hook ---
export const useSongDetectorVisualisersAutoApply = () => {
  const visualType = useVStore((state) => state.visualType)
  const updateButterchurnConfig = useVStore((state) => state.updateButterchurnConfig)
  const updateVisualizerConfig = useVStore((state) => state.updateVisualizerConfig)
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
  const gradients = useStore((state) => state.gradients)
  const selectedGradient = useStore((state) => state.selectedGradient)
  const extractedColors = useStore((state) => state.extractedColors)
  const albumArtCacheBuster = useStore((state) => state.albumArtCacheBuster)
  const thumbnailPath = useStore((state) => state.thumbnailPath)
  const prevGradientsRef = useRef<string>('')
  const prevIsActiveGradVisRef = useRef(false)
  const prevSelectedGradientRef = useRef<number | null>(null)
  const prevAlbumArtRef = useRef<string>('')
  const prevIsActiveImgVisRef = useRef(false)
  const prevIsActiveTextVisRef = useRef(false)
  const prevTextTrackRef = useRef<string>('')
  const currentTrack = useStore((state) => state.spotify.currentTrack)
  const { send } = useWebSocket()

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
        const targetId = visualizerId === 'active' ? visualType : visualizerId
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
    [
      clientIdentity,
      visualType,
      updateButterchurnConfig,
      updateVisualizerConfig,
      nameToId,
      updateVisualizerConfigOptimistic,
      broadcastToClients,
      send
    ]
  )

  // AUTO-APPLY TEXT: When track changes or toggle activates
  useEffect(() => {
    const hasChanges =
      currentTrack !== prevTextTrackRef.current ||
      isActiveTextVisualisers !== prevIsActiveTextVisRef.current
    prevTextTrackRef.current = currentTrack
    prevIsActiveTextVisRef.current = isActiveTextVisualisers
    if (!hasChanges || currentTrack === '') return
    const timer = setTimeout(() => {
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
  }, [currentTrack, isActiveTextVisualisers, textVisualisers, applyVisualiserConfig])

  // AUTO-APPLY GRADIENT: When gradients change (new song) or toggles change or selection change
  useEffect(() => {
    const gradientsKey = gradients.join(',')
    const hasChanges =
      gradientsKey !== prevGradientsRef.current ||
      isActiveGradientVisualisers !== prevIsActiveGradVisRef.current ||
      selectedGradient !== prevSelectedGradientRef.current
    prevGradientsRef.current = gradientsKey
    prevIsActiveGradVisRef.current = isActiveGradientVisualisers
    prevSelectedGradientRef.current = selectedGradient
    if (
      !hasChanges ||
      gradientsKey === '' ||
      selectedGradient === null ||
      !gradients[selectedGradient]
    )
      return
    const timer = setTimeout(() => {
      if (isActiveGradientVisualisers && gradientVisualisers.length > 0) {
        const sortedSpecial = [...extractedColors].sort((a, b) => {
          const cA = colorfulness(a)
          const cB = colorfulness(b)
          const sA = rgbSum(a)
          const sB = rgbSum(b)
          if (cA > 30 && cB > 30) return cB - cA
          if (cA > 30) return -1
          if (cB > 30) return 1
          return sB - sA
        })
        applyVisualiserConfig(gradientVisualisers, 'active', {
          gradient: sortedSpecial[0] || '#0000ff',
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
          peakColor: sortedSpecial.length > 1 ? sortedSpecial[sortedSpecial.length - 2] : '#ffffff'
        })
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [
    gradients,
    selectedGradient,
    isActiveGradientVisualisers,
    gradientVisualisers,
    applyVisualiserConfig,
    extractedColors
  ])

  // AUTO-APPLY IMAGE: When album art changes (new song) or toggles change
  useEffect(() => {
    const hasChanges =
      thumbnailPath !== prevAlbumArtRef.current ||
      isActiveImageVisualisers !== prevIsActiveImgVisRef.current
    prevAlbumArtRef.current = thumbnailPath
    prevIsActiveImgVisRef.current = isActiveImageVisualisers
    const albumArtUrl = thumbnailPath
      ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
      : ''
    if (!hasChanges || thumbnailPath === '') return
    if (isActiveImageVisualisers && imageVisualisers.length > 0) {
      applyVisualiserConfig(imageVisualisers, 'bladeImage', {
        image_source: albumArtUrl
      })
    }
  }, [
    thumbnailPath,
    isActiveImageVisualisers,
    imageVisualisers,
    applyVisualiserConfig,
    albumArtCacheBuster
  ])
}
