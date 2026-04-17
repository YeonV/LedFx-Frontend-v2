import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragIndicator } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export interface DragHandleProps {
  listeners: SyntheticListenerMap | undefined
  attributes: Record<string, any>
}

interface SortableCardGridProps {
  items: string[]
  onReorder: (items: string[]) => void
  children: (id: string, dragHandleProps: DragHandleProps) => React.ReactNode
}

function SortableCardWrapper({
  id,
  children
}: {
  id: string
  children: (dragHandleProps: DragHandleProps) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  )
}

export function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <IconButton
      {...listeners}
      {...attributes}
      size="small"
      sx={{
        cursor: 'grab',
        minWidth: '32px',
        padding: '4px',
        '&:active': { cursor: 'grabbing' },
        touchAction: 'none'
      }}
    >
      <DragIndicator fontSize="small" />
    </IconButton>
  )
}

export default function SortableCardGrid({ items, onReorder, children }: SortableCardGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)
      const newItems = arrayMove(items, oldIndex, newIndex)
      onReorder(newItems)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((id) => (
          <SortableCardWrapper key={id} id={id}>
            {(dragHandleProps) => children(id, dragHandleProps)}
          </SortableCardWrapper>
        ))}
      </SortableContext>
    </DndContext>
  )
}
