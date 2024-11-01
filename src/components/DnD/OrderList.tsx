import { FC } from 'react'
import useStore from '../../store/useStore'
import OrderListBase, { Order } from './OrderListBase'
import { IVirtualOrder } from '../../store/api/storeVirtuals'

const OrderList: FC = () => {
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const virtuals = useStore((state) => state.virtuals)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)

  const enrichedOrders: Order[] = virtualOrder
  .map((order) => {
    const vs = Object.keys(virtuals)
    const virt = vs
      .filter(v => showComplex ? v : !(v.endsWith('-mask') || v.endsWith('-foreground') || v.endsWith('-background')))
      .filter(v => showGaps ? v : !(v.startsWith('gap-')))
      .find((v) => virtuals[v].id === order.virtId)
    if (virt === undefined) {
      return null
    } else {
      return { ...order, name: virtuals[virt]?.config.name, icon: virtuals[virt]?.config.icon_name } as Order
    }
  })
  .filter(order => order !== null)


  const setCleanedOrder = (orders: Order[]) => {
    setVirtualOrder(orders.map((o) => ({ virtId: o.virtId, order: o.order } as IVirtualOrder)))
  }

  return (
    <OrderListBase orders={enrichedOrders} setOrders={setCleanedOrder} />
  )
}

export default OrderList
