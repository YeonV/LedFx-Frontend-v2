import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { useShallow } from 'zustand/shallow'
import hexColor from '../../pages/Devices/EditVirtuals/EditMatrix/Actions/hexColor'

const PixelGraphCanvasOffscreen = ({
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
  const workerRef = useRef<Worker | null>(null)
  const transferredRef = useRef(false)
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
    setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas || transferredRef.current) return

      const offscreen = canvas.transferControlToOffscreen()
      const worker = new Worker(
        new URL('./pixelGraphWorker.js', import.meta.url)
      )
      workerRef.current = worker
      transferredRef.current = true

      worker.postMessage({ canvas: offscreen }, [offscreen])

      const handleWebsockets = (e: any) => {
        if (e.detail.id === virtId) {
          const pixels =
            config.transmission_mode === 'compressed'
              ? hexColor(e.detail.pixels, config.transmission_mode)
              : e.detail.pixels
          // const shape = e.detail.shape
          const rows = showMatrix ? virtuals[virtId]?.config?.rows || 1 : 1
          const cols = Math.ceil(pixels.length / rows)

          worker.postMessage({ pixels, rows, cols })
        }
      }

      document.addEventListener('visualisation_update', handleWebsockets)
      return () => {
        document.removeEventListener('visualisation_update', handleWebsockets)
        worker.terminate()
      }
    }, 200)
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

export default PixelGraphCanvasOffscreen
