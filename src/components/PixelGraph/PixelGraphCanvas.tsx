import { useRef, useCallback } from 'react'
import useStore from '../../store/useStore'
import { useShallow } from 'zustand/shallow'
import hexColor from '../../pages/Devices/EditVirtuals/EditMatrix/Actions/hexColor'

import { useSubscription } from '../../utils/Websocket/WebSocketProvider'

const PixelGraphCanvas = ({
  virtId,
  className = '',
  active = false,
  intGraphs = false,
  showMatrix = false,
  fullScreen = false,
  db = false,
  onDoubleClick
}: {
  virtId: string
  dummy?: boolean
  className?: string
  active?: boolean
  intGraphs?: boolean
  showMatrix?: boolean
  fullScreen?: boolean
  db?: boolean
  onDoubleClick?: any
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { virtuals, graphs } = useStore(
    useShallow((state) => ({
      virtuals: state.virtuals,
      graphs: state.graphs
    }))
  )
  const smoothing = useStore((state) => state.uiPersist.pixelGraphSettings?.smoothing)
  const stretch = useStore((state) => state.uiPersist.pixelGraphSettings?.stretch)

  const handleVisualisationUpdate = useCallback(
    (eventData: any) => {
      if (eventData.id !== virtId) {
        return
      }

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const { virtuals, config, showMatrix: currentShowMatrix } = useStore.getState()

      ctx.imageSmoothingEnabled = false

      const pixels =
        config.transmission_mode === 'compressed'
          ? hexColor(eventData.pixels, config.transmission_mode)
          : eventData.pixels

      const rows = currentShowMatrix ? virtuals[virtId]?.config?.rows || 1 : 1

      const shape = eventData.shape
      const totalPixels = pixels.length
      const realPixelCount = virtuals[virtId]?.pixel_count || totalPixels
      const realCols = Math.ceil(realPixelCount / rows)
      const aspectRatio = realCols / rows

      let displayRows, displayCols
      if (currentShowMatrix) {
        displayRows =
          (shape && shape[0]) || (realPixelCount > 4096 ? Math.sqrt(4096 / aspectRatio) : rows)
        displayCols = (shape && shape[1]) || (realPixelCount > 4096 ? 4096 / displayRows : realCols)
      } else {
        displayRows = 1
        displayCols = totalPixels
      }

      canvas.width = displayCols
      canvas.height = displayRows

      const imageData = ctx.createImageData(displayCols, displayRows)
      for (let i = 0; i < pixels.length; i++) {
        const x = i % displayCols
        const y = Math.floor(i / displayCols)
        const index = (y * displayCols + x) * 4
        const color = pixels[i]
        imageData.data[index] = color.r
        imageData.data[index + 1] = color.g
        imageData.data[index + 2] = color.b
        imageData.data[index + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    },
    [virtId]
  )

  useSubscription('visualisation_update', handleVisualisationUpdate)

  const render =
    (virtuals[virtId].active && virtuals[virtId].effect?.name) || virtuals[virtId].streaming

  if (!(graphs || intGraphs)) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`${className} ${active ? 'active' : ''}`}
      style={{
        maxWidth: fullScreen ? '100vw' : '520px',
        maxHeight: fullScreen ? '100vh' : '520px',
        height:
          !render || (virtuals[virtId]?.config?.rows || 1) < 2 || !showMatrix ? '20px' : 'auto',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: db ? 0 : '0.5rem 0 0 0',
        imageRendering: smoothing ? 'unset' : 'pixelated',
        objectFit: stretch && fullScreen ? 'contain' : 'fill'
      }}
      onDoubleClick={onDoubleClick}
    />
  )
}

export default PixelGraphCanvas
