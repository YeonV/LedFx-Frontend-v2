import { useCallback, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { useVStore } from './vStore'
import { colorfulness, rgbSum, normalizeVisualizerId } from '../utils/helpers'
import { useWebSocket } from '../utils/Websocket/WebSocketProvider'

// --- Visualisers Hook ---
export const useSongDetectorVisualisersAutoApply = () => {
  const visualType = useVStore((state) => state.visualType)
  const updateButterchurnConfig = useVStore((state) => state.updateButterchurnConfig)
  const updateVisualizerConfig = useVStore((state) => state.updateVisualizerConfig)
  const updateAstrofoxConfig = useVStore((state) => state.updateAstrofoxConfig)
  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  const visualizerConfigOptimistic = useStore((state) => state.visualizerConfigOptimistic)
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
      // DEBUG: Log every call to applyVisualiserConfig
      // console.log('[applyVisualiserConfig] visualizerId:', visualizerId, 'update:', update)
      const name = clientIdentity?.name || 'unknown-client'
      const nameToIdMap = nameToId()
      const selectedIds = selectedVisualisers.map((n) => nameToIdMap[n]).filter(Boolean)
      const isCurrentClient = clientIdentity && selectedIds.includes(clientIdentity.clientId || '')
      // console.log('Applying visualiser config', {
      //   visualizerId,
      //   update,
      //   selectedVisualisers,
      //   name,
      //   isCurrentClient,
      //   visualType
      // })
      if (isCurrentClient) {
        const test = useVStore?.getState()?.visualType || visualType
        const rawTargetId = visualizerId === 'active' ? test : visualizerId
        if (rawTargetId) {
          // console.log('Determined target visualizer ID:', rawTargetId)
          const api = (window as any).visualiserApi
          const registry = api?.getVisualizerRegistry?.() || {}
          const targetId = normalizeVisualizerId(rawTargetId, registry)
          const schema = registry[targetId]?.getUISchema?.()
          const isPolymorphic = visualizerId === 'active'
          // DEBUG: Log schema and registry for targetId
          // console.log('[applyVisualiserConfig] schema:', schema)
          // console.log('[applyVisualiserConfig] registry[targetId]:', registry[targetId])
          const filteredUpdate = isPolymorphic
            ? Object.keys(update).reduce(
                (acc, key) => {
                  const hasProp =
                    schema?.properties?.[key] !== undefined ||
                    registry[targetId]?.defaultConfig?.[key] !== undefined ||
                    [
                      'gradient',
                      'gradient2',
                      'image_source',
                      'background_source',
                      'primaryColor',
                      'secondaryColor',
                      'tertiaryColor',
                      'low_band',
                      'bassColor',
                      'mid_band',
                      'midColor',
                      'high_band',
                      'highColor',
                      'sunColor',
                      'backgroundColor',
                      'peakColor',
                      'text',
                      'text2',
                      'font',
                      'font2',
                      'speed',
                      'speed_option_1',
                      'height_percent',
                      'width_percent',
                      'offset_y',
                      'offset_y2'
                    ].includes(key)
                  if (hasProp) {
                    acc[key] = update[key]
                  }
                  return acc
                },
                {} as Record<string, any>
              )
            : update

          // DEBUG: Log filteredUpdate after filtering
          // console.log('[applyVisualiserConfig] filteredUpdate:', filteredUpdate)
          // console.log('so far so good', { targetId, filteredUpdate })
          if (Object.keys(filteredUpdate).length > 0) {
            // console.log(
            //   'Applying visualiser config to',
            //   targetId,
            //   rawTargetId,
            //   visualizerConfigOptimistic?.[clientIdentity?.name || 'unknown-client']?.visualType,
            //   filteredUpdate
            // )
            if (targetId === 'butterchurn') {
              updateButterchurnConfig?.(filteredUpdate)
            } else if (targetId === 'astrofox') {
              updateAstrofoxConfig?.(filteredUpdate)
            } else {
              updateVisualizerConfig?.(
                clientIdentity?.name
                  ? visualizerConfigOptimistic?.[clientIdentity?.name || 'unknown-client']
                      .visualType || targetId
                  : targetId,
                filteredUpdate
              )
            }
            const existingConfig = visualizerConfigOptimistic?.[name]?.configs?.[targetId] || {}
            updateVisualizerConfigOptimistic(name, {
              configs: {
                [targetId]: { ...existingConfig, ...filteredUpdate }
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
      visualizerConfigOptimistic,
      clientIdentity,
      visualType,
      updateButterchurnConfig,
      updateAstrofoxConfig,
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
    // console.log(':(')
    if (
      !hasChanges ||
      gradientsKey === '' ||
      selectedGradient === null ||
      !gradients[selectedGradient]
    )
      return
    // console.log(
    //   ':)',
    //   isActiveGradientVisualisers,
    //   gradientVisualisers.length > 0,
    //   gradients[selectedGradient]
    // )
    // const timer =
    setTimeout(() => {
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
        // console.log('EY', visualType)
        applyVisualiserConfig(gradientVisualisers, 'active', {
          gradient:
            visualType === 'bladeTexter'
              ? sortedSpecial[0] || '#0000ff'
              : gradients[selectedGradient],
          gradient2:
            visualType === 'bladeTexter'
              ? sortedSpecial[1] || '#00ffff'
              : gradients[selectedGradient === gradients.length - 1 ? 0 : selectedGradient + 1],
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
    // return () => clearTimeout(timer)
  }, [
    gradients,

    // JSON.stringify(gradients),
    selectedGradient,
    isActiveGradientVisualisers,
    gradientVisualisers,
    applyVisualiserConfig,
    extractedColors,
    visualType
  ])

  // AUTO-APPLY IMAGE: When album art changes (new song) or toggles change
  useEffect(() => {
    const hasChanges =
      thumbnailPath !== prevAlbumArtRef.current ||
      isActiveImageVisualisers !== prevIsActiveImgVisRef.current ||
      albumArtCacheBuster !== (prevAlbumArtRef as any).cacheBuster
    const albumArtUrl = thumbnailPath
      ? `${window.localStorage.getItem('ledfx-host')}/api/assets/download?path=${thumbnailPath.replace('/assets/', '')}&cb=${albumArtCacheBuster}`
      : ''
    if (!hasChanges || thumbnailPath === '') {
      return
    }
    // Only update refs after confirming a change
    prevAlbumArtRef.current = thumbnailPath
    ;(prevAlbumArtRef as any).cacheBuster = albumArtCacheBuster
    prevIsActiveImgVisRef.current = isActiveImageVisualisers
    if (isActiveImageVisualisers && imageVisualisers.length > 0) {
      applyVisualiserConfig(imageVisualisers, 'active', {
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
