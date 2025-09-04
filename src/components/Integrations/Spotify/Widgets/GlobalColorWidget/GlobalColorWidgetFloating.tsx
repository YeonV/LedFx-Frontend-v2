import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const GlobalColorWidgetFloating = ({ children }: any) => {
  const globalColorWidgetX = useStore((state) => state.ui.globalColorWidgetX)
  const setGlobalColorWidgetX = useStore((state) => state.ui.setGlobalColorWidgetX)
  const globalColorWidgetY = useStore((state) => state.ui.globalColorWidgetY)
  const setGlobalColorWidgetY = useStore((state) => state.ui.setGlobalColorWidgetY)

  return (
    <Rnd
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: false,
        topLeft: false,
        topRight: false
      }}
      size={{ width: 960, height: 'auto' }}
      position={{ x: globalColorWidgetX, y: globalColorWidgetY }}
      onDragStop={(e, d) => {
        setGlobalColorWidgetX(d.x)
        setGlobalColorWidgetY(d.y)
      }}
      style={{ zIndex: 1050 }}
    >
      {children}
    </Rnd>
  )
}

export default GlobalColorWidgetFloating
