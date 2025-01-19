import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { useShallow } from 'zustand/shallow'
import hexColor from '../../pages/Devices/EditVirtuals/EditMatrix/Actions/hexColor'
// import ws from '../../utils/Websocket'

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

        const rows = showMatrix ? virtuals[virtId]?.config?.rows || 1 : 1

        const shape = e.detail.shape
        const totalPixels = pixels.length
        const realPixelCount = virtuals[virtId]?.pixel_count || totalPixels
        const realCols = Math.ceil(realPixelCount / rows)
        const aspectRatio = realCols / rows
        const displayRows =
          (shape && shape[0]) ||
          (realPixelCount > 4096 ? Math.sqrt(4096 / aspectRatio) : rows)

        const displayCols =
          (shape && shape[1]) ||
          (realPixelCount > 4096 ? 4096 / displayRows : realCols)

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

        // if (ws && typeof ws !== 'string') {
        //   const request = {
        //     event_filter: {
        //       vis_id: virtId,
        //       is_device: !!virtuals[virtId]?.is_device
        //     },
        //     event_type: 'visualisation_update',
        //     // id: i,
        //     type: 'subscribe_event'
        //   }
        //   ws.send(JSON.stringify(++request.id && request))
        // }
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
  // const totalPixels = virtuals[virtId]?.pixel_count || 1
  // const rows = showMatrix ? virtuals[virtId]?.config?.rows || 1 : 1
  // const cols = totalPixels / rows || 1

  return (
    <div style={{ position: 'relative' }}>
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
      {/* <div
        onDoubleClick={() => {
          onDoubleClick()
        }}
        style={{
          maxWidth: fullScreen ? '100vw' : '520px',
          maxHeight: fullScreen ? '100vh' : 'unset',
          display: 'flex',
          flexDirection:
            virtuals[virtId].id === 'launchpad-x' ||
            virtuals[virtId].id === 'launchpad-x-matrix'
              ? 'column-reverse'
              : 'column',
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          margin: db ? 0 : '0.5rem 0 0 0',
          objectFit: stretch ? 'fill' : 'contain',
          position: 'absolute',
          top: 0,
          left: 0
          // right: 0,
          // bottom: 0
        }}
        className={`${className} ${active ? 'active' : ''}`}
      >
        {Array.from(Array(rows).keys()).map((row) => (
          <div
            key={`row-${row}`}
            style={{
              maxWidth: fullScreen ? '100vw' : '520px',
              maxHeight: fullScreen ? 'calc(100vh - 200px)' : 'unset',
              display: 'flex',
              width: '100%',
              borderRadius: '0',
              overflow: 'hidden',
              margin: '0',
              background: 'red'
            }}
            className={`${className} ${active ? 'active' : ''}`}
          >
            {Array.from(Array(cols).keys())
              .slice(row * cols, (row + 1) * cols)
              .map((_p: any, i: number) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    margin: `${db || (totalPixels > 100 && rows > 7) ? 1 : 2}px`,
                    borderRadius:
                      db || (totalPixels > 100 && rows > 7) ? '50%' : '5px',
                    position: 'relative',
                    overflow: 'hidden',
                    maxWidth: db ? 3.6 : `${100 / cols}%`,
                    maxHeight: db ? 3.6 : `${100 / cols}%`
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      paddingBottom: '100%',
                      backgroundColor: 'green'
                    }}
                  />
                </div>
              ))}
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default PixelGraphCanvas
