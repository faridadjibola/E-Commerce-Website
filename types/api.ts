export type Product = {
  id: string
  name: string
  slug: string
  price: number
  discount?: number
  rating?: number
  category: string
  gender: 'men' | 'women' | 'unisex'
  images: string[]
  sku: string
  stock: number
  description: string
  sizes?: string[]
  colors?: string[]
}

export type User = {
  id: string
  name: string
  email: string
}

export type CartItem = {
  productId: string
  quantity: number
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  createdAt: string
}

export type CreateOrderRequest = {
  userId?: string
  items: { productId: string; quantity: number }[]
  address: {
    fullName: string
    phone: string
    addressLine: string
    city: string
    state: string
    country: string
  }
  payment: {
    method: 'paystack' | 'opay' | 'card' | 'bank' | 'moniepoint'
  }
}

export type PaystackInitResponse = {
  reference: string
  authorization_url: string
}

export type PaymentInitResponse = {
  reference: string
  authorization_url?: string
  // bank transfer details
  account_number?: string
  account_name?: string
  bank_name?: string
}
