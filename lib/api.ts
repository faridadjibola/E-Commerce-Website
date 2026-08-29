import { Product, User, CartItem, Order, CreateOrderRequest, PaystackInitResponse, PaymentInitResponse } from '../types/api'

const BASE = process.env.NEXT_PUBLIC_API_BASE || ''

async function fetchJson<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...opts,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

// Products
export async function getProducts(): Promise<Product[]> {
  return fetchJson<Product[]>('/api/products')
}

export async function getProduct(slug: string): Promise<Product> {
  return fetchJson<Product>(`/api/products?slug=${encodeURIComponent(slug)}`)
}

// Auth (register uses our API; signin uses NextAuth on the client)
export async function registerUser(name: string, email: string, password: string): Promise<User> {
  return fetchJson<User>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
}

// Cart
export async function getCart(): Promise<CartItem[]> {
  return fetchJson<CartItem[]>('/api/cart')
}

export async function addToCart(item: { productId: string; quantity: number }): Promise<CartItem[]> {
  return fetchJson<CartItem[]>('/api/cart', { method: 'POST', body: JSON.stringify(item) })
}

export async function removeFromCart(productId: string): Promise<CartItem[]> {
  return fetchJson<CartItem[]>(`/api/cart?productId=${encodeURIComponent(productId)}`, { method: 'DELETE' })
}

// Orders
export async function createOrder(payload: CreateOrderRequest): Promise<Order> {
  return fetchJson<Order>('/api/orders', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getOrder(orderId: string): Promise<Order> {
  return fetchJson<Order>(`/api/orders/${orderId}`)
}

export async function getOrders(): Promise<Order[]> {
  return fetchJson<Order[]>('/api/orders')
}

// Payments (Paystack initiation)
export async function initiatePaystack(amount: number, email: string): Promise<PaystackInitResponse> {
  return fetchJson<PaystackInitResponse>('/api/payments/paystack/initiate', { method: 'POST', body: JSON.stringify({ amount, email }) })
}

export async function initiateMoniepoint(amount: number, email: string): Promise<PaymentInitResponse> {
  return fetchJson<PaymentInitResponse>('/api/payments/moniepoint/initiate', { method: 'POST', body: JSON.stringify({ amount, email }) })
}

export async function initiateBankTransfer(amount: number, email: string): Promise<PaymentInitResponse> {
  return fetchJson<PaymentInitResponse>('/api/payments/bank/initiate', { method: 'POST', body: JSON.stringify({ amount, email }) })
}

export async function initiateCard(amount: number, email: string): Promise<PaymentInitResponse> {
  return fetchJson<PaymentInitResponse>('/api/payments/card/initiate', { method: 'POST', body: JSON.stringify({ amount, email }) })
}

export default {
  getProducts,
  getProduct,
  registerUser,
  getCart,
  addToCart,
  removeFromCart,
  createOrder,
  getOrders,
  getOrder,
  initiatePaystack,
  initiateMoniepoint,
  initiateBankTransfer,
  initiateCard,
}
