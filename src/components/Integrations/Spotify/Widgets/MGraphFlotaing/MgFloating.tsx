import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const MgFloating = ({ children }: any) => {
  const mgX = useStore((state) => state.ui.mgX)
  const setMgX = useStore((state) => state.ui.setMgX)
  const mgY = useStore((state) => state.ui.mgY)
  const setMgY = useStore((state) => state.ui.setMgY)

  return (
    <Rnd
      size={{ width: 960, height: 'auto' }}
      position={{ x: mgX, y: mgY }}
      onDragStop={(e, d) => {
        setMgX(d.x)
        setMgY(d.y)
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setMgX(position.x)
        setMgY(position.y)
      }}
      style={{ zIndex: 10 }}
    >
      {children}
    </Rnd>
  )
}

export default MgFloating
