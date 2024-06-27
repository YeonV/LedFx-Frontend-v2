/* eslint-disable @typescript-eslint/indent */
import { useDraggable } from '@dnd-kit/core'

function Draggable({ children, ...props }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable'
  })
  const style = transform
    ? {
        width: '100px',
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  )
}

export default Draggable
