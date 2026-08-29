import { NextPage } from 'next'
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
    <div>
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 && (
            <div className="border rounded p-4 text-sm text-gray-600">Your cart is empty.</div>
          )}
          {items.map(it => {
            const p = products.find(pp => pp.id === it.productId)
            return (
              <div key={it.productId} className="border rounded p-4 flex items-center gap-4">
                <img src={p?.images?.[0] || '/tochiwears logo.jpeg'} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{p?.name || 'Product'}</div>
                  <div className="text-sm text-gray-600">₦{((p?.discount ?? p?.price) ?? 0).toLocaleString()}</div>
                  <div className="mt-2 flex items-center gap-2" aria-label={`Quantity for ${p?.name || 'product'}`}>
                    <button type="button" className="h-8 w-8 rounded border hover:bg-gray-50" onClick={() => setQuantity(it.productId, it.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span className="min-w-6 text-center">{it.quantity}</span>
                    <button type="button" className="h-8 w-8 rounded border hover:bg-gray-50" onClick={() => setQuantity(it.productId, it.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div>
                  <button className="text-red-600" onClick={() => removeFromCart(it.productId)}>Remove</button>
                </div>
              </div>
            )
          })}
        </div>
        <aside className="border rounded p-4">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="mt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>₦0</span></div>
            <div className="flex justify-between font-bold mt-4"><span>Total</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className="mt-4">
              {items.length > 0 ? <Link href="/checkout" className="bg-black text-white w-full inline-block text-center py-2 rounded hover:bg-gray-800">Proceed to Checkout</Link> : <button type="button" disabled className="w-full rounded bg-gray-200 py-2 text-gray-500">Proceed to Checkout</button>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Cart
