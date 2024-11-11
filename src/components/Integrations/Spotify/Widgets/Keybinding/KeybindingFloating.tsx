import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const MpFloating = ({ children }: any) => {
  const keybindingX = useStore((state) => state.ui.keybindingX)
  const setKeybindingX = useStore((state) => state.ui.setKeybindingX)
  const keybindingY = useStore((state) => state.ui.keybindingY)
  const setKeybindingY = useStore((state) => state.ui.setKeybindingY)

  return (
    <Rnd
      size={{ width: 960, height: 'auto' }}
      position={{ x: keybindingX, y: keybindingY }}
      onDragStop={(e, d) => {
        setKeybindingX(d.x)
        setKeybindingY(d.y)
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setKeybindingX(position.x)
        setKeybindingY(position.y)
      }}
      style={{ zIndex: 10 }}
    >
      {children}
    </Rnd>
  )
}

export default MpFloating
