import React, { useEffect, useMemo } from 'react'
import useStore from '../../../../../store/useStore'
import AutoApplySelector from '../SpotifyWidgetPro/AutoApplySelector'
import CardStack from './CardStack'

const VisualiserGradientImageSelectors = () => {
  const clients = useStore((state) => state.clients)

  // Global visualizer state
  const gradientVisualisers = useStore((state) => state.gradientVisualisers || [])
  const isActiveGradientVisualisers = useStore((state) => state.isActiveGradientVisualisers)
  const setGradientVisualisers = useStore((state) => state.setGradientVisualisers)
  const setIsActiveGradientVisualisers = useStore((state) => state.setIsActiveGradientVisualisers)

  const imageVisualisers = useStore((state) => state.imageVisualisers || [])
  const isActiveImageVisualisers = useStore((state) => state.isActiveImageVisualisers)
  const setImageVisualisers = useStore((state) => state.setImageVisualisers)
  const setIsActiveImageVisualisers = useStore((state) => state.setIsActiveImageVisualisers)

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
