import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const SdFloating = ({ children }: any) => {
  const sdX = useStore((state) => state.ui.sdX)
  const setSdX = useStore((state) => state.ui.setSdX)
  const sdY = useStore((state) => state.ui.sdY)
  const setSdY = useStore((state) => state.ui.setSdY)

  return (
    <Rnd
      size={{ width: 960, height: 'auto' }}
      position={{ x: sdX, y: sdY }}
      onDragStop={(e, d) => {
        setSdX(d.x)
        setSdY(d.y)
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setSdX(position.x)
        setSdY(position.y)
      }}
      style={{ zIndex: 10 }}
    >
      {children}
    </Rnd>
  )
}

export default SdFloating
