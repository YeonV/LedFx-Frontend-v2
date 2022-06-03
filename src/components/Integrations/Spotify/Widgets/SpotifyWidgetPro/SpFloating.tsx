import { Rnd } from 'react-rnd';
import useStore from '../../../../../store/useStore';

const SpFloating = ({ children }: any) => {
  const swWidth = useStore((state: any) => state.spotify.swWidth);
  const setSwWidth = useStore((state: any) => state.spotify.setSwWidth);
  const swX = useStore((state: any) => state.spotify.swX);
  const setSwX = useStore((state: any) => state.spotify.setSwX);
  const swY = useStore((state: any) => state.spotify.swY);
  const setSwY = useStore((state: any) => state.spotify.setSwY);

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
