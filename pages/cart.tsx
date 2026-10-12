import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../components/CartProvider'
import { getAllProducts } from '../lib/products'

const Cart: NextPage = () => {
  const { items, removeFromCart, setQuantity } = useCart()
  const products = getAllProducts()

  const subtotal = items.reduce((sum, it) => {
    const p = products.find(pp => pp.id === it.productId)
    const price = p ? (p.discount ?? p.price) : 0
    return sum + price * it.quantity
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Your bag</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Shopping Cart</h1>
        </div>
        <div className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
          {items.length} item{items.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
              Your cart is empty. Add a few essentials and come back here.
            </div>
          )}

          {items.map(it => {
            const p = products.find(pp => pp.id === it.productId)
            const price = p ? (p.discount ?? p.price) : 0
            return (
              <div key={it.productId} className="flex gap-3 rounded-[22px] border border-gray-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
                  <Image src={p?.images?.[0] || '/tochiwears logo.jpeg'} alt={p?.name || 'Product'} width={120} height={120} className="h-full w-full object-cover" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900">{p?.name || 'Product'}</div>
                    <div className="mt-1 text-sm text-gray-600">₦{price.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1" aria-label={`Quantity for ${p?.name || 'product'}`}>
                      <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full text-base font-medium text-gray-700 transition hover:bg-white" onClick={() => setQuantity(it.productId, it.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span className="min-w-6 text-center text-sm font-medium text-gray-900">{it.quantity}</span>
                      <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full text-base font-medium text-gray-700 transition hover:bg-white" onClick={() => setQuantity(it.productId, it.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>

                    <button className="text-sm font-medium text-red-600 transition hover:text-red-700" onClick={() => removeFromCart(it.productId)}>Remove</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="self-start rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-semibold text-gray-900">Order summary</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>₦0</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5">
            {items.length > 0 ? (
              <Link href="/checkout" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800">Proceed to Checkout</Link>
            ) : (
              <button type="button" disabled className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-500">Proceed to Checkout</button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Cart
