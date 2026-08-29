import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '../types/api'
import api from '../lib/api'
import { getAllProducts } from '../lib/products'

type CartContextType = {
  items: CartItem[]
  addToCart: (productId: string, quantity?: number) => Promise<void>
  setQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    (async () => {
      try {
        const c = await api.getCart()
        setItems(c)
      } catch (e) {
        setItems([])
      }
    })()
  }, [])

  async function addToCart(productId: string, quantity = 1) {
    const updated = await api.addToCart({ productId, quantity })
    setItems(updated)
  }

  async function removeFromCart(productId: string) {
    const updated = await api.removeFromCart(productId)
    setItems(updated)
  }

  async function setQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }
    const current = items.find((item) => item.productId === productId)
    if (current?.quantity === quantity) return
    await api.removeFromCart(productId)
    const updated = await api.addToCart({ productId, quantity })
    setItems(updated)
  }

  async function clearCart() {
    for (const it of items) {
      await api.removeFromCart(it.productId)
    }
    setItems([])
  }

  const products = getAllProducts()
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return sum
    return sum + (product.discount ?? product.price) * item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, setQuantity, removeFromCart, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartContext
