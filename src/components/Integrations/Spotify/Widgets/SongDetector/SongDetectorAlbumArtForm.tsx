import { useCallback, useEffect, useRef, useMemo } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Slider,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import useStore from '../../../../../store/useStore'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import { Ledfx } from '../../../../../api/ledfx'
import { getVStore } from '../../../../../hooks/vStore'
import { useWebSocket } from '../../../../../utils/Websocket/WebSocketProvider'
import { colorfulness, rgbSum } from '../../../../../utils/helpers'
import AutoApplySelector from '../SpotifyWidgetPro/AutoApplySelector'
import CardStack from './CardStack'

const SongDetectorAlbumArtForm = ({ preview = true }: { preview?: boolean }) => {
  const virtuals = useStore((state) => state.virtuals)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const thumbnailPath = useStore((state) => state.thumbnailPath)

  const clients = useStore((state) => state.clients)
  const clientIdentity = useStore((state) => state.clientIdentity)
  const broadcastToClients = useStore((state) => state.broadcastToClients)
  const updateVisualizerConfigOptimistic = useStore(
    (state) => state.updateVisualizerConfigOptimistic
  )
  const { send, isConnected } = useWebSocket()

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
  const setSelectedGradientGlobal = useStore((state) => state.setSelectedGradient)
  const setGradientAutoApply = useStore((state) => state.setGradientAutoApply)
  const setImageAutoApply = useStore((state) => state.setImageAutoApply)
  const setImageConfigGlobal = useStore((state) => state.setImageConfig)

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
      nameToId,
      updateVisualizerConfigOptimistic,
      broadcastToClients,
      isConnected,
      send
    ]
  )

  const applyImage = useCallback(async () => {
    if (albumArtUrl && imageVirtuals.length > 0 && thumbnailPath) {
      await Ledfx('/api/effects', 'PUT', {
        action: 'apply_global_effect',
        type: 'imagespin',
        config: {
          image_source: albumArtUrl || 'current_album_art.jpg',
          ...imageConfig
        },
        virtuals: imageVirtuals
      })
      getVirtuals()
    }
  }, [albumArtUrl, imageVirtuals, thumbnailPath, imageConfig, getVirtuals])

  const toggleGradientAutoApply = useCallback(() => {
    setGradientAutoApply(!gradientAutoApply)
  }, [gradientAutoApply, setGradientAutoApply])

  const toggleImageAutoApply = useCallback(() => {
    setImageAutoApply(!imageAutoApply)
  }, [imageAutoApply, setImageAutoApply])

  const prevIsActiveGradVisRef = useRef(false)
  const prevIsActiveGradVirtRef = useRef(false)
  const prevIsActiveImgVisRef = useRef(false)
  const prevIsActiveImgVirtRef = useRef(false)
  const prevColorsRef = useRef<string>('')
  const prevAlbumArtRef = useRef<string>('')

  // AUTO-APPLY GRADIENT: Trigger on color change, toggle change, selection change
  useEffect(() => {
    const colorsKey = gradients[selectedGradient] || ''
    const hasChanges =
      colorsKey !== prevColorsRef.current ||
      isActiveGradientVisualisers !== prevIsActiveGradVisRef.current ||
      gradientAutoApply !== prevIsActiveGradVirtRef.current
    prevColorsRef.current = colorsKey
    prevIsActiveGradVisRef.current = isActiveGradientVisualisers
    prevIsActiveGradVirtRef.current = gradientAutoApply

    if (!hasChanges || colorsKey === '') return

    if (gradientAutoApply) {
      applyGradient()
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
  }, [
    isActiveGradientVisualisers,
    gradientAutoApply,
    selectedGradient,
    gradientVisualisers,
    gradients,
    applyGradient,
    applyVisualiserConfig,
    extractedColors
  ])

  // Auto-reapply image when song changes (if currently active)
  useEffect(() => {
    const hasChanges =
      albumArtUrl !== prevAlbumArtRef.current ||
      isActiveImageVisualisers !== prevIsActiveImgVisRef.current ||
      imageAutoApply !== prevIsActiveImgVirtRef.current
    prevAlbumArtRef.current = albumArtUrl
    prevIsActiveImgVisRef.current = isActiveImageVisualisers
    prevIsActiveImgVirtRef.current = imageAutoApply

    if (!hasChanges || albumArtUrl === '') return

    if (imageAutoApply) {
      applyImage()
    }
    if (isActiveImageVisualisers && imageVisualisers.length > 0) {
      applyVisualiserConfig(imageVisualisers, 'bladeImage', {
        image_source: albumArtUrl
      })
    }
  }, [
    albumArtUrl,
    isActiveImageVisualisers,
    imageAutoApply,
    imageVisualisers,
    applyImage,
    applyVisualiserConfig
  ])

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="column" spacing={2} sx={{ flex: 1, display: 'flex' }}>
        {/* Album Art Thumbnail */}
        {albumArtUrl && preview && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Box
              component="img"
              src={albumArtUrl}
              alt="Album Art"
              sx={{
                maxWidth: 200,
                maxHeight: 200,
                borderRadius: 2,
                boxShadow: 3
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </Box>
        )}

        {/* Gradient Preview and Selection */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Album Art Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="column" spacing={2}>
              {gradients.length > 0 && (
                <BladeFrame title="Gradient Options">
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ width: '100%' }}>
                    {gradients.map((gradient, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setSelectedGradientGlobal(idx)}
                        sx={{
                          flex: 1,
                          minWidth: 60,
                          height: 40,
                          background: gradient,
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: selectedGradient === idx ? '3px solid white' : '1px solid gray',
                          transition: 'border 0.2s'
                        }}
                      />
                    ))}
                  </Stack>
                </BladeFrame>
              )}

              {/* Color Palette Display */}
              {extractedColors.length > 0 && (
                <BladeFrame title="Extracted Colors">
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ width: '100%' }}>
                    {extractedColors.map((color: string, idx: number) => (
                      <Box
                        key={idx}
                        sx={{
                          flex: 1,
                          minWidth: 40,
                          height: 40,
                          backgroundColor: color,
                          borderRadius: 1,
                          border: '1px solid gray'
                        }}
                        title={color}
                      />
                    ))}
                  </Stack>
                </BladeFrame>
              )}

              {/* Image Effect Configuration */}
              <BladeFrame title="Image Effect Settings">
                <Stack direction="column" spacing={2} flex={1} pt={2}>
                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <BladeFrame title="Brightness" style={{ flex: 1 }}>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        valueLabelDisplay="auto"
                        value={imageConfig.brightness}
                        onChange={(_e, v) =>
                          typeof v === 'number' &&
                          setImageConfigGlobal({ ...imageConfig, brightness: v })
                        }
                      />
                    </BladeFrame>
                    <BladeFrame title="BG Brightness" style={{ flex: 1 }}>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        valueLabelDisplay="auto"
                        value={imageConfig.background_brightness}
                        onChange={(_e, v) =>
                          typeof v === 'number' &&
                          setImageConfigGlobal({ ...imageConfig, background_brightness: v })
                        }
                      />
                    </BladeFrame>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <BladeFrame title="Blur" style={{ flex: 1 }}>
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                        value={imageConfig.blur}
                        onChange={(_e, v) =>
                          typeof v === 'number' && setImageConfigGlobal({ ...imageConfig, blur: v })
                        }
                      />
                    </BladeFrame>
                    <BladeFrame title="Min Size" style={{ flex: 1 }}>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        valueLabelDisplay="auto"
                        value={imageConfig.min_size}
                        onChange={(_e, v) =>
                          typeof v === 'number' &&
                          setImageConfigGlobal({ ...imageConfig, min_size: v })
                        }
                      />
                    </BladeFrame>
                  </Stack>

                  <GradientPicker
                    isGradient={false}
                    colors={extractedColors}
                    title="BG Color"
                    pickerBgColor={imageConfig.background_color}
                    sendColorToVirtuals={(v: string) =>
                      setImageConfigGlobal({ ...imageConfig, background_color: v })
                    }
                  />

                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <BladeFrame style={{ flex: 1 }} title="Clip">
                      <Switch
                        checked={imageConfig.clip}
                        onChange={(_e, b) => setImageConfigGlobal({ ...imageConfig, clip: b })}
                        color="primary"
                      />
                    </BladeFrame>
                    <BladeFrame style={{ flex: 1 }} title="Flip H">
                      <Switch
                        checked={imageConfig.flip_horizontal}
                        onChange={(_e, b) =>
                          setImageConfigGlobal({ ...imageConfig, flip_horizontal: b })
                        }
                        color="primary"
                      />
                    </BladeFrame>
                    <BladeFrame style={{ flex: 1 }} title="Flip V">
                      <Switch
                        checked={imageConfig.flip_vertical}
                        onChange={(_e, b) =>
                          setImageConfigGlobal({ ...imageConfig, flip_vertical: b })
                        }
                        color="primary"
                      />
                    </BladeFrame>
                  </Stack>
                </Stack>
              </BladeFrame>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Virtual Device Selectors */}
        <Box sx={{ flexGrow: 1 }} />
        <CardStack>
          <AutoApplySelector
            label="Gradient Virtuals"
            options={Object.keys(virtuals)}
            value={gradientVirtuals}
            onChange={handleGradientVirtualChange}
            isActive={gradientAutoApply}
            onToggle={toggleGradientAutoApply}
            disabled={
              gradientVirtuals.length === 0 ||
              selectedGradient === null ||
              extractedColors.length === 0
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
      </Stack>
    </Box>
  )
}

export default SongDetectorAlbumArtForm
