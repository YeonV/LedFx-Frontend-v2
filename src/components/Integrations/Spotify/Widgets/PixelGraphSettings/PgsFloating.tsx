import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const PgsFloating = ({ children }: any) => {
  const pgsX = useStore((state) => state.ui.pgsX)
  const setPgsX = useStore((state) => state.ui.setPgsX)
  const pgsY = useStore((state) => state.ui.pgsY)
  const setPgsY = useStore((state) => state.ui.setPgsY)

  return (
    <Rnd
      size={{ width: 960, height: 'auto' }}
      position={{ x: pgsX, y: pgsY }}
      onDragStop={(e, d) => {
        setPgsX(d.x)
        setPgsY(d.y)
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setPgsX(position.x)
        setPgsY(position.y)
      }}
      style={{ zIndex: 10 }}
    >
      {children}
    </Rnd>
  )
}

export default PgsFloating
