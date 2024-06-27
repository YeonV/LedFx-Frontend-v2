import { useDroppable } from '@dnd-kit/core'

function Droppable({ children }: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable'
  })
  const style = {
    color: isOver ? 'green' : undefined
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  )
}

export default Droppable
