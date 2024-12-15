import { Rnd } from 'react-rnd'
import useStore from '../../../../../store/useStore'

const MpFloating = ({ children }: any) => {
  const keybindingX = useStore((state) => state.ui.keybindingX)
  const setKeybindingX = useStore((state) => state.ui.setKeybindingX)
  const keybindingY = useStore((state) => state.ui.keybindingY)
  const setKeybindingY = useStore((state) => state.ui.setKeybindingY)

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
      position={{ x: keybindingX, y: keybindingY }}
      onDragStop={(e, d) => {
        setKeybindingX(d.x)
        setKeybindingY(d.y)
      }}
      style={{ zIndex: 1050 }}
    >
      {children}
    </Rnd>
  )
}

export default MpFloating
