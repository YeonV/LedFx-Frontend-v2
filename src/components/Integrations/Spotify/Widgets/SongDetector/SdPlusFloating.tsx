import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const SdPlusFloating = ({ children }: any) => {
  const sdPlusX = useStore((state) => state.ui.sdPlusX)
  const setSdPlusX = useStore((state) => state.ui.setSdPlusX)
  const sdPlusY = useStore((state) => state.ui.sdPlusY)
  const setSdPlusY = useStore((state) => state.ui.setSdPlusY)

  return (
    <Rnd
      size={{ width: 1200, height: 'auto' }}
      position={{ x: sdPlusX, y: sdPlusY }}
      onDragStop={(e, d) => {
        setSdPlusX(d.x)
        setSdPlusY(d.y)
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setSdPlusX(position.x)
        setSdPlusY(position.y)
      }}
      style={{ zIndex: 10 }}
    >
      {children}
    </Rnd>
  )
}

export default SdPlusFloating
