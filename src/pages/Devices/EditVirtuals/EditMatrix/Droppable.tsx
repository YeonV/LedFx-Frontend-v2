import { useDroppable } from '@dnd-kit/core'
import useStyles from './M.styles'
import { IMCell } from './M.utils'

function Droppable({
  id,
  children,
  cell,
  bg = 'transparent',
  opacity = 1,
  onContextMenu,
  onClick
}: {
  id: string
  children: React.ReactNode
  cell?: IMCell
  bg?: string
  opacity?: number
  onContextMenu?: React.MouseEventHandler<HTMLDivElement> | undefined
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}) {
  const { isOver, setNodeRef } = useDroppable({
    id
  })
  const style = {
    opacity,
    background: isOver
      ? cell?.deviceId === ''
        ? 'rgba(0, 255, 0, 0.1)'
        : 'rgba(255, 0, 0, 0.1)'
      : bg
  }
  const classes = useStyles()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classes.gridCell}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Droppable
