import {useDraggable} from '@dnd-kit/core';

function Draggable(props: any) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    with: '100px',
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

export default Draggable;