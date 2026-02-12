import { Rnd } from 'react-rnd'
import useStore from '../../../store/useStore'

const ElectronStoreInspectorFloating = ({ children }: any) => {
  const storeInspectorX = useStore((state) => state.ui.storeInspectorX)
  const setStoreInspectorX = useStore((state) => state.ui.setStoreInspectorX)
  const storeInspectorY = useStore((state) => state.ui.storeInspectorY)
  const setStoreInspectorY = useStore((state) => state.ui.setStoreInspectorY)

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
      size={{ width: 700, height: 'auto' }}
      position={{ x: storeInspectorX, y: storeInspectorY }}
      onDragStop={(e, d) => {
        setStoreInspectorX(d.x)
        setStoreInspectorY(d.y)
      }}
      style={{ zIndex: 1050 }}
    >
      {children}
    </Rnd>
  )
}

export default ElectronStoreInspectorFloating
