import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { useShallow } from 'zustand/shallow'
import hexColor from '../../pages/Devices/EditVirtuals/EditMatrix/Actions/hexColor'

const PixelGraphCanvas = ({
  virtId,
  // dummy = false,
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
  const { pixelGraphs, virtuals, devices, graphs, config } = useStore(
    useShallow((state) => ({
      pixelGraphs: state.pixelGraphs,
      virtuals: state.virtuals,
      devices: state.devices,
      graphs: state.graphs,
      config: state.config
    }))
  )
  const smoothing = useStore((state) => state.uiPersist.pixelGraphSettings?.smoothing)

  const stretch = useStore((state) => state.uiPersist.pixelGraphSettings?.stretch)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.imageSmoothingEnabled = false

    const handleWebsockets = (e: any) => {
      if (e.detail.id === virtId) {
        const pixels =
          config.transmission_mode === 'compressed'
            ? hexColor(e.detail.pixels, config.transmission_mode)
            : e.detail.pixels

        const rows = showMatrix ? virtuals[virtId]?.config?.rows || 1 : 1

        const shape = e.detail.shape
        const totalPixels = pixels.length
        const realPixelCount = virtuals[virtId]?.pixel_count || totalPixels
        const realCols = Math.ceil(realPixelCount / rows)
        const aspectRatio = realCols / rows

        let displayRows, displayCols
        if (showMatrix) {
          displayRows =
            (shape && shape[0]) || (realPixelCount > 4096 ? Math.sqrt(4096 / aspectRatio) : rows)
          displayCols =
            (shape && shape[1]) || (realPixelCount > 4096 ? 4096 / displayRows : realCols)
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
          imageData.data[index + 3] = 255 // Alpha channel
        }
        ctx.putImageData(imageData, 0, 0)
      }
    }

    document.addEventListener('visualisation_update', handleWebsockets)
    return () => {
      document.removeEventListener('visualisation_update', handleWebsockets)
    }
  }, [virtId, virtuals, pixelGraphs, devices, graphs, config, showMatrix])

  const render =
    (virtuals[virtId].active && virtuals[virtId].effect?.name) || virtuals[virtId].streaming

  if (!(graphs || intGraphs)) {
    return null
  }
  // const totalPixels = virtuals[virtId]?.pixel_count || 1
  // const rows = showMatrix ? virtuals[virtId]?.config?.rows || 1 : 1
  // const cols = totalPixels / rows || 1

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
