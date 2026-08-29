import { Order, OrderItem } from '../types/api'

const ORDERS: Order[] = []

export function createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
  const id = `ord_${Date.now()}`
  const createdAt = new Date().toISOString()
  const o: Order = { ...order, id, createdAt }
  ORDERS.push(o)
  return o
}

export function getOrderById(id: string) {
  return ORDERS.find(o => o.id === id) || null
}

export function updateOrderStatus(id: string, status: string) {
  const o = ORDERS.find(x => x.id === id)
  if (!o) return null
  o.status = status
  return o
}

export function listOrders() {
  return ORDERS
}

export default ORDERS
