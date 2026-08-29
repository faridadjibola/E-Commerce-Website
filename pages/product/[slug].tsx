import { NextPage, GetServerSideProps } from 'next'
import { getAllProducts, getProductBySlug, Product } from '../../lib/products'
import ProductCard from '../../components/ProductCard'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../../components/CartProvider'

type Props = { product?: Product }

const ProductPage: NextPage<Props> = ({product}) => {
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
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
    
    // Validate filter selections if available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError('Please select a size')
      return
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setError('Please select a color')
      return
    }
    
    try {
      setLoading(true)
      await cart.addToCart(product.id, qty)
      setSuccess('Added to cart!')
      setQty(1)
      setSelectedSize('')
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
    
    // Validate filter selections if available
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError('Please select a size')
      return
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setError('Please select a color')
      return
    }
    
    try {
      setLoading(true)
      await cart.addToCart(product.id, qty)
      // Redirect to checkout
      router.push('/checkout')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process purchase')
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img src={product.images[0]} alt={product.name} className="w-full object-cover rounded" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="mt-2 text-xl font-bold">₦{(product.discount ?? product.price).toLocaleString()}</div>
        <div className="mt-3">SKU: {product.sku} • {product.stock > 0 ? 'In stock' : 'Out of stock'}</div>
        <p className="mt-4 text-gray-700">{product.description}</p>
        
        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2">
              Size <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value)
                setError('')
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a size</option>
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value)
                setError('')
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a color</option>
              {product.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <div className="mt-6 flex items-center gap-3">
          <input type="number" value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)))} min={1} className="border w-20 px-2 py-2 rounded" />
          <button 
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
          <button 
            className="border px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBuyNow}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>

      <div className="md:col-span-2 mt-8">
        <h3 className="font-semibold mb-4">You May Also Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
