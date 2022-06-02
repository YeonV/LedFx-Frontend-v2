import { Rnd } from 'react-rnd';
import useStore from '../../../../../store/useStore';

const SpFloating = ({ children }: any) => {
  const swWidth = useStore((state) => (state as any).swWidth);
  const setSwWidth = useStore((state) => (state as any).setSwWidth);
  const swX = useStore((state) => (state as any).swX);
  const setSwX = useStore((state) => (state as any).setSwX);
  const swY = useStore((state) => (state as any).swY);
  const setSwY = useStore((state) => (state as any).setSwY);

  return (
    <Rnd
      size={{ width: swWidth, height: 'auto' }}
      position={{ x: swX, y: swY }}
      onDragStop={(e, d) => {
        setSwX(d.x);
        setSwY(d.y);
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setSwWidth(ref.style.width);
        setSwX(position.x);
        setSwY(position.y);
      }}
      style={{ zIndex: 10 }}
    >
      {children}
    </Rnd>
  );
};

export default SpFloating;
