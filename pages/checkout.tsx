import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import { getAllProducts } from '../lib/products'
import { useCart } from '../components/CartProvider'
import { useAuth } from '../components/AuthProvider'

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
  const { user, loading: authLoading } = useAuth()
  const { items, clearCart, subtotal } = useCart()
  const products = getAllProducts()

  const [method, setMethod] = useState<'opay' | 'moniepoint' | 'bank' | 'card'>('opay')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(user?.email || '')
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
    if (user?.email) setEmail(user.email)
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`)
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!authLoading && user && items.length === 0 && !status) {
      router.push('/cart')
    }
  }, [authLoading, user, items, router, status])

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
        userId: user?.id || user?.email || 'guest',
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

  if (authLoading || !user) return <p role="status" className="text-sm text-gray-600">Checking your sign-in...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Secure checkout</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Checkout</h1>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          {items.length} item{items.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <form className="space-y-5 rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5" onSubmit={(e) => { e.preventDefault(); handlePay() }}>
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer information</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Full name</span>
                <input aria-label="Full name" autoComplete="name" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Email address</span>
                <input aria-label="Email address" autoComplete="email" type="email" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Phone number</span>
                <input aria-label="Phone number" autoComplete="tel" type="tel" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Delivery address</span>
                <input aria-label="Delivery address" autoComplete="street-address" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200" placeholder="Address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">City</span>
                <input aria-label="City" autoComplete="address-level2" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">State</span>
                <input aria-label="State" autoComplete="address-level1" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery location</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {DELIVERY_OPTIONS.map((option) => {
                const isSelected = deliveryLocation === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDeliveryLocation(option.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{option.name}</span>
                      <span className="text-sm font-semibold">₦{option.price.toLocaleString()}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment method</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { id: 'opay', label: 'OPay' },
                { id: 'moniepoint', label: 'Moniepoint' },
                { id: 'bank', label: 'Bank transfer' },
                { id: 'card', label: 'Card' },
              ].map((option) => {
                const isSelected = method === option.id
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    <input
                      type="radio"
                      name="pm"
                      checked={isSelected}
                      onChange={() => setMethod(option.id as 'opay' | 'moniepoint' | 'bank' | 'card')}
                      className="h-4 w-4 accent-current"
                    />
                  </label>
                )
              })}
            </div>
          </section>

          <div className="pt-2">
            <button className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting || items.length === 0}>{submitting ? 'Preparing payment…' : `Proceed to pay ₦${total.toLocaleString()}`}</button>
          </div>

          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {status && <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">{status}</div>}
        </form>

        <aside className="self-start rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-semibold text-gray-900">Order summary</h3>

          <div className="mt-4 space-y-4 text-sm">
            {orderLines.map((line) => (
              <div key={line.productId} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-gray-900">{line.name}</div>
                  <div className="mt-1 text-gray-500">Qty {line.quantity}</div>
                </div>
                <div className="font-medium text-gray-900">₦{(line.price * line.quantity).toLocaleString()}</div>
              </div>
            ))}

            <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Delivery</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
              Secure payment goes through your selected provider and returns you to the order page after approval.
            </div>

            {bankDetails && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <h4 className="text-sm font-semibold text-gray-900">Bank transfer instructions</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <div>Account name: {bankDetails.account_name}</div>
                  <div>Account number: {bankDetails.account_number}</div>
                  <div>Bank: {bankDetails.bank_name}</div>
                  <div>Reference: {bankDetails.reference}</div>
                  <div>Amount: ₦{total.toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
