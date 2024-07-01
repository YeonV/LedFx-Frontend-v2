import { useDroppable } from '@dnd-kit/core'
import useStyles from './M.styles'
import { IMCell } from './M.utils'

function Droppable({
  id,
  children,
  cell
}: {
  id: string
  children: React.ReactNode
  cell?: IMCell
}) {
  const { isOver, setNodeRef } = useDroppable({
    id
  })
  const style = {
    // color: isOver ? 'green' : undefined,
    background: isOver
      ? cell?.deviceId === ''
        ? 'rgba(0, 255, 0, 0.1)'
        : 'rgba(255, 0, 0, 0.1)'
      : undefined
  }
  const classes = useStyles()

  return (
    <div ref={setNodeRef} style={style} className={classes.gridCell}>
      {children}
    </div>
  )
}

export default Droppable
