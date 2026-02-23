import { FC } from 'react'
import useStore from '../../store/useStore'
import OrderListBase, { Order } from './OrderListBase'
import { IVirtualOrder } from '../../store/api/storeVirtuals'

interface OrderListProps {
  type: 'virtuals' | 'clients'
}

const OrderList: FC<OrderListProps> = ({ type }) => {
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

  const setCleanedOrder = (orders: Order[]) => {
    setOrderSource(
      orders.map(
        (o) =>
          ({
            virtId: o.virtId,
            order: o.order
          }) as IVirtualOrder
      )
    )
  }

  return <OrderListBase droppableId={type} orders={enrichedOrders} setOrders={setCleanedOrder} />
}

export default OrderList
