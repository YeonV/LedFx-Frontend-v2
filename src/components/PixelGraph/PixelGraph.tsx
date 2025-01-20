import useStore from '../../store/useStore'
import PixelGraphBase from './PixelGraphBase'
import PixelGraphCanvas from './PixelGraphCanvas'
import PixelGraphCanvasOffscreen from './PixelGraphCanvasOffscreen'
import PixelGraphCanvasOffscreenWebGL from './PixelGraphCanvasOffscreenWebGL'
import PixelGraphCanvasOffscreenWebGLSync from './PixelGraphCanvasOffscreenWebGLSync'

const PixelGraph = ({
  virtId,
  dummy = false,
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
  const variants = useStore(
    (state) => state.uiPersist.pixelGraphSettings?.variants
  )
  return (
    <>
      {variants === 'original' && (
        <PixelGraphBase
          virtId={virtId}
          dummy={dummy}
          className={className}
          active={active}
          intGraphs={intGraphs}
          showMatrix={showMatrix}
          fullScreen={fullScreen}
          db={db}
          onDoubleClick={onDoubleClick}
        />
      )}
      {variants === 'canvas' && (
        <PixelGraphCanvas
          virtId={virtId}
          dummy={dummy}
          className={className}
          active={active}
          intGraphs={intGraphs}
          showMatrix={showMatrix}
          fullScreen={fullScreen}
          db={db}
          onDoubleClick={onDoubleClick}
        />
      )}
      {variants === 'canvasOffscreen' && (
        <PixelGraphCanvasOffscreen
          virtId={virtId}
          dummy={dummy}
          className={className}
          active={active}
          intGraphs={intGraphs}
          showMatrix={showMatrix}
          fullScreen={fullScreen}
          db={db}
          onDoubleClick={onDoubleClick}
        />
      )}
      {variants === 'canvasOffscreenWebGL' && (
        <PixelGraphCanvasOffscreenWebGL
          virtId={virtId}
          dummy={dummy}
          className={className}
          active={active}
          intGraphs={intGraphs}
          showMatrix={showMatrix}
          fullScreen={fullScreen}
          db={db}
          onDoubleClick={onDoubleClick}
        />
      )}
      {variants === 'canvasOffscreenWebGLSync' && (
        <PixelGraphCanvasOffscreenWebGLSync
          virtId={virtId}
          dummy={dummy}
          className={className}
          active={active}
          intGraphs={intGraphs}
          showMatrix={showMatrix}
          fullScreen={fullScreen}
          db={db}
          onDoubleClick={onDoubleClick}
        />
      )}
    </>
  )
}

export default PixelGraph
