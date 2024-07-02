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

  // useDndMonitor({
  //   onDragStart(event) {
  //     const x = (event.active.id as string).split('-')[0]
  //     const y = (event.active.id as string).split('-')[1]
  //     const cell = m[x][y]
  //     const cellsOfGroup = m.flat().filter((c: any) => c.group === cell.group)

  //     console.log('onDragStart', cellsOfGroup, event)
  //   },
  //   onDragMove(event) {
  //     console.log('onDragMove', event)
  //   },
  //   onDragOver(event) {
  //     console.log('onDragOver', event)
  //   },
  //   onDragEnd(event) {
  //     console.log('onDragEnd', event)
  //   },
  //   onDragCancel(event) {
  //     console.log('onDragCancel', event)
  //   }
  // })
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
