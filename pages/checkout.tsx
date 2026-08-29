import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import api from '../lib/api'
import { getAllProducts } from '../lib/products'
import { useCart } from '../components/CartProvider'

const DELIVERY_OPTIONS = [
  { id: 'lagos', name: 'Lagos', price: 2000 },
  { id: 'abuja', name: 'Abuja', price: 3000 },
  { id: 'portharcourt', name: 'Port Harcourt', price: 3500 },
  { id: 'calabar', name: 'Calabar', price: 4000 },
  { id: 'kano', name: 'Kano', price: 4500 },
  { id: 'ibadan', name: 'Ibadan', price: 2500 },
  { id: 'benin', name: 'Benin City', price: 3000 },
  { id: 'enugu', name: 'Enugu', price: 3500 },
  { id: 'owerri', name: 'Owerri', price: 3000 },
  { id: 'warri', name: 'Warri', price: 3500 },
  { id: 'makurdi', name: 'Makurdi', price: 3500 },
  { id: 'ilorin', name: 'Ilorin', price: 3000 },
]

const Checkout: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, clearCart, subtotal } = useCart()
  const products = getAllProducts()

  const [method, setMethod] = useState<'opay' | 'moniepoint' | 'bank' | 'card'>('opay')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [phone, setPhone] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('lagos')
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryLocation) || DELIVERY_OPTIONS[0]
  const deliveryFee = subtotal > 0 ? selectedDelivery.price : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email)
  }, [session])

  useEffect(() => {
    if (items.length === 0 && !status) {
      router.push('/cart')
    }
  }, [items, router, status])

  async function handlePay() {
    setError('')
    if (!items.length) {
      setError('Your cart is empty. Add an item before checking out.')
      return
    }

    if (!fullName || !email || !phone || !addressLine || !city || !state) {
      setError('Please complete every delivery field before continuing.')
      return
    }

    try {
      setSubmitting(true)
      setStatus('Creating your order...')
      const order = await api.createOrder({
        userId: session?.user?.email || 'guest',
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        address: {
          fullName,
          phone,
          addressLine,
          city,
          state,
          country: 'Nigeria',
        },
        payment: { method },
      })

      setStatus('Processing payment...')

      if (method === 'opay') {
        const res = await api.initiateCard(total, email)
        if (res.authorization_url) {
          window.location.href = res.authorization_url
          return
        }
      }

      if (method === 'moniepoint') {
        const res = await api.initiateMoniepoint(total, email)
        if (res.authorization_url) {
          window.location.href = res.authorization_url
          return
        }
      }

      if (method === 'card') {
        const res = await api.initiateCard(total, email)
        if (res.authorization_url) {
          window.location.href = res.authorization_url
          return
        }
      }

      if (method === 'bank') {
        const res = await api.initiateBankTransfer(total, email)
        setBankDetails({ ...res, orderId: order.id })
        setStatus('Bank transfer instructions ready. Please complete the transfer to confirm the order.')
        return
      }

      setStatus('Payment request sent successfully.')
      await clearCart()
      router.push(`/account/orders/${order.id}`)
    } catch (e) {
      setStatus('Payment initiation failed. Please try again.')
      setError('We could not start your payment. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const orderLines = useMemo(() =>
    items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      const unitPrice = product ? (product.discount ?? product.price) : 0
      return {
        productId: item.productId,
        name: product?.name || 'Product',
        quantity: item.quantity,
        price: unitPrice,
      }
    }),
    [items, products]
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form className="border rounded p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); handlePay() }}>
          <h3 className="font-semibold">Customer Information</h3>
          <input aria-label="Full name" autoComplete="name" className="w-full border px-3 py-2 rounded" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input aria-label="Email address" autoComplete="email" type="email" className="w-full border px-3 py-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input aria-label="Phone number" autoComplete="tel" type="tel" className="w-full border px-3 py-2 rounded" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input aria-label="Delivery address" autoComplete="street-address" className="w-full border px-3 py-2 rounded" placeholder="Address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          <div className="grid md:grid-cols-2 gap-3">
            <input aria-label="City" autoComplete="address-level2" className="w-full border px-3 py-2 rounded" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <input aria-label="State" autoComplete="address-level1" className="w-full border px-3 py-2 rounded" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <select className="w-full border px-3 py-2 rounded" defaultValue="Nigeria">
            <option>Nigeria</option>
          </select>

          <h3 className="font-semibold mt-4">Delivery Location</h3>
          <select 
            className="w-full border px-3 py-2 rounded"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
          >
            {DELIVERY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} - ₦{option.price.toLocaleString()}
              </option>
            ))}
          </select>

          <h3 className="font-semibold mt-4">Payment Method</h3>
          <div className="space-y-2">
            <label className="block"><input type="radio" name="pm" checked={method === 'opay'} onChange={() => setMethod('opay')} /> OPay</label>
            <label className="block"><input type="radio" name="pm" checked={method === 'moniepoint'} onChange={() => setMethod('moniepoint')} /> Moniepoint</label>
            <label className="block"><input type="radio" name="pm" checked={method === 'bank'} onChange={() => setMethod('bank')} /> Bank Transfer</label>
            <label className="block"><input type="radio" name="pm" checked={method === 'card'} onChange={() => setMethod('card')} /> Card</label>
          </div>

          <div className="mt-4">
            <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting || items.length === 0}>{submitting ? 'Preparing payment…' : `Proceed to Pay ₦${total.toLocaleString()}`}</button>
          </div>

          {error && <div role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {status && <div className="text-sm text-gray-700">{status}</div>}
        </form>
        <aside className="border rounded p-4">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            {orderLines.map((line) => (
              <div key={line.productId} className="flex justify-between gap-4">
                <span>{line.name} x {line.quantity}</span>
                <span>₦{(line.price * line.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>₦{deliveryFee.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold mt-4"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              After initiating payment you will be redirected to the provider for secure payment where applicable.
            </div>

            {bankDetails && (
              <div className="mt-4 border rounded p-3 bg-gray-50">
                <h4 className="font-semibold">Bank Transfer Instructions</h4>
                <div className="mt-2">Account name: {bankDetails.account_name}</div>
                <div>Account number: {bankDetails.account_number}</div>
                <div>Bank: {bankDetails.bank_name}</div>
                <div className="mt-2 text-sm text-gray-600">Use reference: {bankDetails.reference}</div>
                <div className="mt-2 text-sm text-gray-600">Amount: ₦{total.toLocaleString()}</div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
