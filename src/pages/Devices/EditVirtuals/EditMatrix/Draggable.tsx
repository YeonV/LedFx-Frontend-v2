/* eslint-disable @typescript-eslint/indent */
import { useDraggable } from '@dnd-kit/core'

function Draggable({ children, id, ...props }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id
  })
  const style = transform
    ? {
        width: '100px',
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <div
      type="button"
      ref={setNodeRef}
      style={style}
      {...props}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}

export default Draggable
