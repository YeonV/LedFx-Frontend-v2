import React from 'react'
import useStore from '../../../../../store/useStore'
import useEngineRow from '../../../../../hooks/useEngineRow'
import AutoApplySelector from '../SpotifyWidgetPro/AutoApplySelector'
import CardStack from './CardStack'

const VirtualGradientImageSelectors = () => {
  const virtuals = useStore((state) => state.virtuals)
  const selectedGradient = useStore((state) => state.selectedGradient)
  const extractedColors = useStore((state) => state.extractedColors)

  // Each row reads and writes through whichever engine owns it.
  const gradient = useEngineRow('gradient')
  const image = useEngineRow('image')

  const asList = (value: any): string[] => (typeof value === 'string' ? value.split(',') : value)

  // Album art needs somewhere to draw: an imagespin on a single-row strip is
  // meaningless, so image targets are matrix virtuals only. Gradients apply to
  // any virtual.
  const allVirtuals = Object.keys(virtuals)
  const matrixVirtuals = allVirtuals.filter((v) => (virtuals[v]?.config?.rows || 1) > 1)

  const handleGradientVirtualChange = (event: any) => {
    const selected = asList(event.target.value)
    // A virtual can only carry one of the two effects.
    image.setVirtuals(image.virtuals.filter((v) => !selected.includes(v)))
    gradient.setVirtuals(selected)
  }

  const handleImageVirtualChange = (event: any) => {
    const selected = asList(event.target.value)
    gradient.setVirtuals(gradient.virtuals.filter((v) => !selected.includes(v)))
    image.setVirtuals(selected)
  }

  return (
    <CardStack>
      <AutoApplySelector
        label="Gradient Virtuals"
        options={allVirtuals}
        value={gradient.virtuals}
        onChange={handleGradientVirtualChange}
        isActive={gradient.enabled}
        onToggle={gradient.toggleEnabled}
        engine={gradient.engine}
        onEngineChange={gradient.setEngine}
        engineAvailable={gradient.engineAvailable}
        disabled={
          gradient.virtuals.length === 0 ||
          // The core extracts its own gradients, so it needs neither a local
          // selection nor locally extracted colours.
          (!gradient.isCore && (selectedGradient === null || extractedColors.length === 0))
        }
      />
      <AutoApplySelector
        label="Image Virtuals"
        options={matrixVirtuals}
        value={image.virtuals}
        onChange={handleImageVirtualChange}
        isActive={image.enabled}
        onToggle={image.toggleEnabled}
        engine={image.engine}
        onEngineChange={image.setEngine}
        engineAvailable={image.engineAvailable}
        disabled={image.virtuals.length === 0 || (!image.isCore && extractedColors.length === 0)}
      />
    </CardStack>
  )
}

export default React.memo(VirtualGradientImageSelectors)
