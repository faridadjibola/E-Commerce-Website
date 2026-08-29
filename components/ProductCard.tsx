import Link from 'next/link'
import { Product } from '../lib/products'

const ProductCard: React.FC<{product: Product}> = ({product}) => {
  const price = product.discount ?? product.price
  return (
    <div className="border rounded-lg overflow-hidden group bg-white">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-lg font-semibold">₦{price.toLocaleString()}</div>
            <div className="text-sm text-yellow-600">★ {product.rating ?? 0}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
