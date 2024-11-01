import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import hexColor from '../pages/Devices/EditVirtuals/EditMatrix/Actions/hexColor'

const PixelGraph = ({
  virtId,
  dummy = false,
  className = '',
  active = false,
  intGraphs = false,
  showMatrix = false,
  fullScreen = false,
  db = false
}: {
  virtId: string
  dummy?: boolean
  className?: string
  active?: boolean
  intGraphs?: boolean
  showMatrix?: boolean
  fullScreen?: boolean
  db?: boolean
}) => {
  const [pixels, setPixels] = useState<any>([])

  const { pixelGraphs, virtuals, devices, graphs, config } = useStore((state) => ({
    pixelGraphs: state.pixelGraphs,
    virtuals: state.virtuals,
    devices: state.devices,
    graphs: state.graphs,
    config: state.config
  }))

  const rows = virtuals[virtId].is_device
    ? devices[virtuals[virtId].is_device]?.config?.rows ||
      virtuals[virtId].config.rows ||
      1
    : virtuals[virtId].config.rows || 1

  const decodedPixels =
    config.transmission_mode === 'compressed'
      ? pixels && pixels.length && hexColor(pixels, config.transmission_mode)
      : pixels

  useEffect(() => {
    const handleWebsockets = (e: any) => {
      if (e.detail.id === virtId) {
        setPixels(e.detail.pixels)
      }
    }
    document.addEventListener('visualisation_update', handleWebsockets)
    return () => {
      document.removeEventListener('visualisation_update', handleWebsockets)
    }
  }, [virtuals, pixelGraphs, virtId])

  const tooLessPixels = useStore((state) => state.dialogs.lessPixels?.open || false)

  if (!(graphs || intGraphs)) {
    return null
  }

  const totalPixels = decodedPixels.length > 0 ? decodedPixels.length : pixels[0]?.length
  const realPixelCount = virtuals[virtId].pixel_count
  const realCols = Math.ceil(realPixelCount / rows)
  const aspectRatio = realCols / rows

  const displayRows = realPixelCount > 4096 ? Math.sqrt(4096 / aspectRatio) : rows
  const displayCols = realPixelCount > 4096 ? 4096 / displayRows : realCols

  return dummy || tooLessPixels ? (
    <div
      style={{
        maxWidth: fullScreen ? '100vw' : '520px',
        maxHeight: fullScreen ? 'calc(100vh - 200px)' : 'unset',
        display: 'flex',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.5rem 0 0 0'
      }}
      className={`${className} ${active ? 'active' : ''}`}
    >
      <div
        key={1}
        style={{
          backgroundColor: '#0002',
          height: '20px',
          flex: 1,
          borderRadius: '0'
        }}
      />
    </div>
  ) : (pixels.length || decodedPixels.length) && rows > 1 && showMatrix ? (
    <div
      style={{
        maxWidth: fullScreen ? '100vw' : '520px',
        maxHeight: fullScreen ? 'calc(100vh - 200px)' : 'unset',
        display: 'flex',
        flexDirection:
          virtuals[virtId].id === 'launchpad-x' ||
          virtuals[virtId].id === 'launchpad-x-matrix'
            ? 'column-reverse'
            : 'column',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: db ? 0 : '0.5rem 0 0 0'
      }}
      className={`${className} ${active ? 'active' : ''}`}
    >
      {Array.from(Array(displayRows).keys()).map((row) => (
        <div
          key={`row-${row}`}
          style={{
            maxWidth: fullScreen ? '100vw' : '520px',
            maxHeight: fullScreen ? 'calc(100vh - 200px)' : 'unset',
            display: 'flex',
            width: '100%',
            borderRadius: '0',
            overflow: 'hidden',
            margin: '0'
          }}
          className={`${className} ${active ? 'active' : ''}`}
        >
          {(config.transmission_mode === 'compressed' && decodedPixels.length > 0
            ? decodedPixels.slice(row * displayCols, (row + 1) * displayCols)
            : pixels[0]?.slice(row * displayCols, (row + 1) * displayCols)
          ).map((_p: any, i: number) => (
            <div
              key={i}
              style={{
                flex: 1,
                margin: `${db || (totalPixels > 100 && displayRows > 7) ? 1 : 2}px`,
                borderRadius: db || (totalPixels > 100 && displayRows > 7) ? '50%' : '5px',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: db ? 3.6 : `${100 / displayCols}%`,
                maxHeight: db ? 3.6 : `${100 / displayCols}%`
              }}
            >
              <div
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  backgroundColor: active
                    ? config.transmission_mode === 'compressed' &&
                      decodedPixels.length > 0 &&
                      decodedPixels[row * displayCols + i]
                      ? `rgb(${Object.values(decodedPixels[row * displayCols + i])})`
                      : `rgb(${pixels[0][row * displayCols + i]},${pixels[1][row * displayCols + i]},${pixels[2][row * displayCols + i]})`
                    : '#0002'
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : (pixels[0] || decodedPixels).length ? (
    <div
      style={{
        maxWidth: fullScreen ? '100vw' : '520px',
        maxHeight: fullScreen ? 'calc(100vh - 200px)' : 'unset',
        display: 'flex',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.5rem 0 0 0'
      }}
      className={`${className} ${active ? 'active' : ''}`}
    >
      {(config.transmission_mode === 'compressed'
        ? decodedPixels
        : pixels[0]
      ).map((p: any, i: number) => (
        <div
          key={i}
          style={{
            height: '20px',
            flex: 1,
            borderRadius: '0',
            backgroundColor: active
              ? config.transmission_mode === 'compressed'
                ? `rgb(${Object.values(p)})`
                : `rgb(${pixels[0][i]},${pixels[1][i]},${pixels[2][i]})`
              : '#0002'
          }}
        />
      ))}
    </div>
  ) : (
    <div
      style={{
        maxWidth: fullScreen ? '100vw' : '520px',
        maxHeight: fullScreen ? 'calc(100vh - 200px)' : 'unset',
        display: 'flex',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.5rem 0 0 0'
      }}
      className={`${className} ${active ? 'active' : ''}`}
    >
      <div
        key={1}
        style={{
          height: '20px',
          borderRadius: '0',
          flex: 1,
          backgroundColor: '#0002'
        }}
      />
    </div>
  )
}

export default PixelGraph
