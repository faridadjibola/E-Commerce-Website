import { NextPage, GetServerSideProps } from 'next'
import Image from 'next/image'
import { getAllProducts, getProductBySlug, Product } from '../../lib/products'
import ProductCard from '../../components/ProductCard'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../../components/CartProvider'

type Props = { product?: Product }

const ProductPage: NextPage<Props> = ({product}) => {
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const cart = useCart()
  
  if (!product) return <div>Product not found</div>

  const related = getAllProducts().filter((item) => item.id !== product.id).slice(0, 4)

  const handleAddToCart = async () => {
    setError('')
    setSuccess('')

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setError('Please select a color')
      return
    }

    try {
      setLoading(true)
      await cart.addToCart(product.id, qty)
      setSuccess('Added to cart!')
      setQty(1)
      setSelectedColor('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = async () => {
    setError('')
    setSuccess('')

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setError('Please select a color')
      return
    }

    try {
      setLoading(true)
      await cart.addToCart(product.id, qty)
      router.push('/checkout')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process purchase')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className="overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-sm">
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
            <Image src={product.images[0]} alt={`${product.name} product photo`} width={1200} height={1200} sizes="(max-width: 768px) 100vw, 50vw" priority className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">Featured</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-end gap-3">
            <div className="text-2xl font-black text-gray-900 sm:text-3xl">₦{(product.discount ?? product.price).toLocaleString()}</div>
            {product.discount && product.discount !== product.price && (
              <div className="pb-1 text-sm text-gray-500 line-through">₦{product.price.toLocaleString()}</div>
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600">SKU: {product.sku}</div>
          <p className="mt-5 text-sm leading-7 text-gray-700 sm:text-base">{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Color <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value)
                  setError('')
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Select a color</option>
                {product.colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium">Qty</span>
              <input type="number" value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)))} min={1} className="w-16 border-0 bg-transparent text-right font-medium text-gray-900 outline-none" />
            </label>

            <button
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleBuyNow}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-gray-900">You May Also Like</h3>
          <span className="text-sm text-gray-500">Curated picks</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string
  const product = getProductBySlug(slug) || null
  return { props: { product } }
}

export default ProductPage
