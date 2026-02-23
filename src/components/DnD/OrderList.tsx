import { FC } from 'react'
import useStore from '../../store/useStore'
import OrderListBase, { Order } from './OrderListBase'

interface OrderListProps {
  type: 'virtuals' | 'clients'
  dimFilter?: '1D' | '2D'
}

const OrderList: FC<OrderListProps> = ({ type, dimFilter }) => {
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const clientOrder = useStore((state) => state.clientOrder)
  const setClientOrder = useStore((state) => state.setClientOrder)
  const virtuals = useStore((state) => state.virtuals)
  const clients = useStore((state) => state.clients)

  const orderSource = type === 'virtuals' ? virtualOrder : clientOrder
  const setOrderSource = type === 'virtuals' ? setVirtualOrder : setClientOrder

  const enrichedOrders: Order[] = orderSource
    .map((order) => {
      if (type === 'virtuals') {
        const vs = Object.keys(virtuals)
        const virt = vs.find((v) => virtuals[v].id === order.virtId)
        if (virt !== undefined) {
          const is2D = (virtuals[virt].config.rows || 1) > 1
          if (dimFilter === '1D' && is2D) return null
          if (dimFilter === '2D' && !is2D) return null

          return {
            ...order,
            name: virtuals[virt]?.config.name,
            icon: virtuals[virt]?.config.icon_name
          } as Order
        }
      } else {
        const client = clients[order.virtId]
        if (client !== undefined) {
          return {
            ...order,
            name: client.name,
            icon: 'tv'
          } as Order
        }
      }

      return null
    })
    .filter((order): order is Order => order !== null)

  const setCleanedOrder = (newFilteredOrders: Order[]) => {
    const fullOrder = [...orderSource]
    const filteredIndices: number[] = []

    fullOrder.forEach((order, index) => {
      if (type === 'virtuals') {
        const vs = Object.keys(virtuals)
        const virtKey = vs.find((v) => virtuals[v].id === order.virtId)
        if (virtKey !== undefined) {
          const is2D = (virtuals[virtKey].config.rows || 1) > 1
          if (dimFilter === '1D' && is2D) return
          if (dimFilter === '2D' && !is2D) return
          filteredIndices.push(index)
        }
      } else {
        const client = clients[order.virtId]
        if (client !== undefined) {
          filteredIndices.push(index)
        }
      }
    })

    // Place the reordered items back into the full list at the original positions
    filteredIndices.forEach((fullIdx, filterIdx) => {
      fullOrder[fullIdx] = {
        virtId: newFilteredOrders[filterIdx].virtId,
        order: fullIdx
      }
    })

    // Normalize all orders to be sequential
    const normalizedOrder = fullOrder.map((o, i) => ({ ...o, order: i }))
    setOrderSource(normalizedOrder)
  }

  return (
    <OrderListBase
      droppableId={`${type}-${dimFilter || 'all'}`}
      orders={enrichedOrders}
      setOrders={setCleanedOrder}
    />
  )
}

export default OrderList
