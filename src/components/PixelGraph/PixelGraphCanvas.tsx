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
  const smoothing = useStore(
    (state) => state.uiPersist.pixelGraphSettings?.smoothing
  )

  const stretch = useStore(
    (state) => state.uiPersist.pixelGraphSettings?.stretch
  )

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

        // const shape = e.detail.shape
        const rows = showMatrix ? virtuals[virtId]?.config?.rows || 1 : 1
        const cols = Math.ceil(pixels.length / rows)

        canvas.width = cols
        canvas.height = rows

        const imageData = ctx.createImageData(cols, rows)
        for (let i = 0; i < pixels.length; i++) {
          const x = i % cols
          const y = Math.floor(i / cols)
          const index = (y * cols + x) * 4
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
    (virtuals[virtId].active && virtuals[virtId].effect?.name) ||
    virtuals[virtId].streaming

  if (!(graphs || intGraphs)) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={`${className} ${active ? 'active' : ''}`}
      style={{
        maxWidth: fullScreen ? '100vw' : '520px',
        maxHeight: fullScreen ? '100vh' : 'unset',
        height:
          !render || virtuals[virtId]?.config?.rows < 2 || !showMatrix
            ? '20px'
            : 'auto',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: db ? 0 : '0.5rem 0 0 0',
        imageRendering: smoothing ? 'unset' : 'pixelated',
        objectFit: stretch ? 'fill' : 'contain'
      }}
      onDoubleClick={onDoubleClick}
    />
  )
}

export default PixelGraphCanvas
