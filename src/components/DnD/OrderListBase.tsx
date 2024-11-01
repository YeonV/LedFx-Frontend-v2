import { FC } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material'

export interface Order {
  virtId: string
  order: number
  name: string
  icon: string
}

interface OrderListBaseProps {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

const reorder = (list: Order[], startIndex: number, endIndex: number): Order[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  
  return result.map((item, index) => ({ ...item, order: index }))
}

const getItemStyle = (isDragging: boolean, draggableStyle: any, theme: Theme) => ({
  ...draggableStyle,
  borderRadius: 4,
  ...(isDragging && {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    opacity: 0.8,
  })
})

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? 'red' : 'transparent',
})

const OrderListBase: FC<OrderListBaseProps> = ({ orders, setOrders }) => {
  const theme = useTheme() as Theme
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const reorderedItems = reorder(orders, result.source.index, result.destination.index)
    setOrders(reorderedItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <List ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {orders.map((item, index) => (
              <Draggable key={item.virtId} draggableId={item.virtId} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{...getItemStyle(snapshot.isDragging, provided.draggableProps.style, theme), cursor: 'grab'}}
                  >
                    <ListItemIcon>
                      <BladeIcon name={item.icon || 'wled'} sx={{ filter: snapshot.isDragging ? 'invert(1)' : '', mr: 2}} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name || item.virtId}
                    />
                      <BladeIcon name={snapshot.isDragging ? 'DragHandle' : 'DragIndicator'} sx={{}} />
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default OrderListBase
